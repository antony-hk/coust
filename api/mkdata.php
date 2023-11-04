<?php

include_once("parser.inc.php");

$parser = new Parser();
$result = $parser->parseCoursePage();

$isValidTermProvided = isset($_GET["term"]) && preg_match("/^\d{4}$/", $_GET["term"]);
$term = $isValidTermProvided ? $_GET["term"] : $result["terms"]["current"]["num"];

$courseInfo = [
    "terms" => $result["terms"],
    "lastUpdated" => date("j F, Y, g:i a")
];

foreach ($result["depts"] as $dept) {
    $url = "https://w5.ab.ust.hk/wcq/cgi-bin/{$term}/subject/{$dept}";
    $data = $parser->parseCoursePage($url);
    foreach ($data['courses'] as $course) {
        $courseInfo[$course->code] =  $course;
    }
}

$jsonData = json_encode($courseInfo);

file_put_contents("./data/courseInfo_${term}.json", $jsonData);
if ($term === $result["terms"]["current"]["num"]) {
    file_put_contents("./data/courseInfo.json", $jsonData);
}

print "DONE";

?>