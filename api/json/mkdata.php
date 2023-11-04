<?php

include_once("parser.inc.php");

$parser = new Parser();
$result = $parser->parseCoursePage();

if (isset($_GET["term"]) && preg_match("/^\d{4}$/", $_GET["term"])) {
    $term = $_GET["term"];
} else {
    $term = $result["terms"]["current"]["num"];
}

$courseInfo = array();

$courseInfo["terms"] = $result["terms"];

foreach($result['depts'] as $dept) {
    $url =  "https://w5.ab.ust.hk/wcq/cgi-bin/" . $term . "/subject/" . $dept;
    $data = $parser->parseCoursePage($url);
    foreach($data['courses'] as $course) {
        $courseInfo[$course->code] =  $course;
    }
}
$last_updated = date("j F, Y, g:i a");
$courseInfo["lastUpdated"] = $last_updated;
file_put_contents("../data/courseInfo_${term}.json", json_encode($courseInfo));

print "DONE";

?>