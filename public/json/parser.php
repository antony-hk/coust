<?php
    header("Access-Control-Allow-Origin: *");
    include_once("parser.inc.php");
    $course_url = !empty($_GET["curl"]) ? $_GET["curl"] : "https://w5.ab.ust.hk/wcq/cgi-bin/1340/subject/COMP/";
    $parser = new Parser();
    $result = $parser->parseCoursePage($course_url);
    //print_r($result);
    
    $courseList = json_decode(file_get_contents("../data/courseList.json"));
    $output = array();
    $type = $_GET["type"];
    if ($type == "searchhints") {
        $q = trim($_GET["term"]);
        foreach ($courseList as $code => $name) {
            if (stripos($code." ".$name, $q)!==false) {
                $output[] = $code . " " . $name;
            }
        }
    }
    else if ($type=="courselist") {
        foreach ($courseList as $code => $name) {
            $output[] = $code . " " . $name;
        }
    }
    print json_encode($output);
?>