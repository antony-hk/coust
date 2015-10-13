<?php

include_once("parser.inc.php");

$parser = new Parser();
$result = $parser->parseCoursePage();$courseList = array();

foreach($result['depts'] as $dept) {
	$data = $parser->parseCoursePage("https://w5.ab.ust.hk".$result['terms'][0]['href']."subject/".$dept);
	
	
	/*$courseInformation['courseCode'] = $course->code;
	$courseInformation['courseName'] = $course->name;
	$courseInformation['courseDescription'] = $course->description;
	$courseInformation['courseCredit'] = $course->credit;
	$courseInformation['courseCode'] = $course->code;*/
	
	
	
	foreach($data['courses'] as $course) {
		$courseList[$course->code] =  $course->name;
	}
}

file_put_contents("../data/courseList.json", json_encode($courseList));

?>