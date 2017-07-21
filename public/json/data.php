<?php
    header("Access-Control-Allow-Origin: *");
    $output = json_decode(file_get_contents("../data/courseInfo.json"));
    print json_encode($output);
?>