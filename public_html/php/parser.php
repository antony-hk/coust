<?php
    include_once("parser.inc.php");
    $course_url = !empty($_GET["curl"]) ? $_GET["curl"] : "https://w5.ab.ust.hk/wcq/cgi-bin/1340/subject/COMP/";
    $parser = new Parser();
    $result = $parser->parseCoursePage($course_url);
    $courses = $result["courses"];
    //print_r($result);
    $output = array();
    $type = $_GET["type"];
    if ($type == "searchhints") {
        $q = trim($_GET["term"]);
        foreach ($courses as $course) {
            if (stripos($course->code, $q)!==false || stripos($course->name, $q)!==false) {
                $output[] = $course->code . " " . $course->name;
            }
        }
    }
    else if ($type=="courselist") {
        foreach ($courses as $course) {
            $output[] = $course->code . " " . $course->name;
        }
    }
    print json_encode($output);
?>