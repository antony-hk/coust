<?php
    header("Access-Control-Allow-Origin: *");
    $output = file_get_contents("courseInfo.json");
    print $output;
?>