<?php
    header("Access-Control-Allow-Origin: *");
    $output = file_get_contents("../data/courseInfo.json");
    print $output;
?>