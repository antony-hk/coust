<?php

include_once("parser.inc.php");

header("Content-Type: text/plain; charset=utf-8");

/*
 * A full run is around a hundred sequential requests to HKUST and takes minutes.
 * Without output it looks indistinguishable from a hang, and an idle connection
 * is what proxies drop first, so every department is reported as it finishes.
 *
 * Emitting output has a side effect worth naming: PHP only notices that the
 * client has gone when it next tries to write, and by default it then kills the
 * script. That would leave a browser-triggered run half done, so aborts are
 * ignored — close the tab and the crawl still finishes.
 *
 * The time limit has to go too. It does not count time spent inside curl, but
 * parsing a hundred pages of HTML is real CPU and would hit the default 30s.
 * Each request carries its own timeout, so the run stays bounded regardless.
 */
@set_time_limit(0);
ignore_user_abort(true);
while (ob_get_level() > 0) {
    ob_end_flush();
}
ob_implicit_flush(true);

// Relative to this script. data.php reads "./data" too, so the two have to be
// deployed into the same directory or they will not agree on where data lives.
define("DATA_DIR", "./data");

function fail($message) {
    // Progress output has already sent the headers by the time most failures
    // happen; setting a status code then is just a warning in the log.
    if (!headers_sent()) {
        http_response_code(502);
    }
    print "FAILED: " . $message . "\n";
    exit(1);
}

/*
 * Write through a temporary file and rename into place.
 *
 * data.php cannot tell a bad payload from a good one — it json_decode()s
 * whatever is on disk and serves the result, so an empty or half-written file
 * silently turns the whole API into `null`. Renaming is atomic, so the live
 * file is either the old one or the complete new one, never something in
 * between.
 */
function writeJson($path, $json) {
    $tmp = $path . ".tmp";
    if (file_put_contents($tmp, $json) !== strlen($json)) {
        @unlink($tmp);
        fail("could not write " . $tmp);
    }
    if (!rename($tmp, $path)) {
        @unlink($tmp);
        fail("could not move " . $tmp . " into place");
    }
}

print "Fetching the schedule index...\n";

$parser = new Parser();
$base = $parser->parseCoursePage();

if ($base === null) {
    fail("could not fetch the HKUST class schedule page");
}

$current = isset($base["terms"]["current"]["num"]) ? $base["terms"]["current"]["num"] : null;

// Called without ?term= — the usual way — this updates the current term.
if (isset($_GET["term"]) && preg_match("/^\d{4}$/", $_GET["term"])) {
    $term = $_GET["term"];
} else {
    $term = $current;
}

/*
 * $current is null only when the term selector could not be read at all.
 *
 * Every URL below would then collapse to ".../cgi-bin//subject/XXXX", the crawl
 * would quietly return nothing, and the old code still wrote that out: it is
 * how `courseInfo_.json` was created and how the live `courseInfo.json` got
 * emptied.
 */
if ($term === null) {
    fail("could not determine the current term from the schedule page");
}

// The department list differs between terms, so take it from the term actually
// being crawled rather than from wherever the base page redirected to.
$page = $base;
if ($term !== $current) {
    $page = $parser->parseCoursePage("https://w5.ab.ust.hk/wcq/cgi-bin/" . $term . "/");
    if ($page === null) {
        fail("could not fetch the index for term " . $term);
    }
}

if (empty($page["depts"])) {
    fail("no departments found for term " . $term);
}

$courseInfo = array(
    "terms" => $base["terms"],
    "lastUpdated" => date("j F, Y, g:i a")
);

$total = count($page["depts"]);
print "Term " . $term . ", " . $total . " departments\n";

$failed = array();
$done = 0;
foreach ($page["depts"] as $dept) {
    $done++;
    $url = "https://w5.ab.ust.hk/wcq/cgi-bin/" . $term . "/subject/" . $dept;
    $data = $parser->parseCoursePage($url);
    if ($data === null) {
        $failed[] = $dept;
        printf("  [%d/%d] %-6s FAILED\n", $done, $total, $dept);
        continue;
    }
    foreach ($data["courses"] as $course) {
        $courseInfo[$course->code] = $course;
    }
    printf("  [%d/%d] %-6s %d\n", $done, $total, $dept, count($data["courses"]));
}

// Everything except "terms" and "lastUpdated" is a course.
$courseCount = count($courseInfo) - 2;
if ($courseCount < 1) {
    fail("crawled " . count($page["depts"]) . " departments and found no courses");
}

$jsonData = json_encode($courseInfo);
if ($jsonData === false) {
    fail("json_encode failed: " . json_last_error_msg());
}

writeJson(DATA_DIR . "/courseInfo_" . $term . ".json", $jsonData);
if ($term === $current) {
    writeJson(DATA_DIR . "/courseInfo.json", $jsonData);
}

print "DONE\n";
print "term:     " . $term . ($term === $current ? " (current)" : "") . "\n";
print "courses:  " . $courseCount . "\n";
print "bytes:    " . strlen($jsonData) . "\n";
if (!empty($failed)) {
    print "skipped:  " . count($failed) . " department(s): " . implode(", ", $failed) . "\n";
}

?>
