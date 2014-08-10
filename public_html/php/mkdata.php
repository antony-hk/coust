<?php

include_once("parser.inc.php");

$parser = new Parser();
$result = $parser->parseCoursePage();
$courseInfo = array();

foreach($result['depts'] as $dept) {
	$data = $parser->parseCoursePage("https://w5.ab.ust.hk".$result['terms'][0]['href']."subject/".$dept);
	foreach($data['courses'] as $course) {
		$courseInfo[$course->code] =  $course;
	}
}

file_put_contents("courseInfo.json", json_encode($courseInfo));

print "DONE";

?>