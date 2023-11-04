<?php
    header("Access-Control-Allow-Origin: *");

    if (isset($_GET["term"]) && preg_match("/^\d{4}$/", $_GET["term"])) {
        $output = json_decode(file_get_contents("./data/courseInfo_" . $_GET["term"] . ".json"));
    } else {
        $output = json_decode(file_get_contents("./data/courseInfo.json"));
    }

    print json_encode($output);
?>