<?php
    include_once("parser.inc.php");
?>

<!DOCTYPE html>
<html>
    <head>
        <title>Parser</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            pre {
                white-space: pre-wrap;       /* CSS 3 */
                white-space: -moz-pre-wrap;  /* Mozilla, since 1999 */
                white-space: -pre-wrap;      /* Opera 4-6 */
                white-space: -o-pre-wrap;    /* Opera 7 */
                word-wrap: break-word;       /* Internet Explorer 5.5+ */
            }
        </style>
    </head>
    <body>
        <pre style="margin: 50px 100px;">
            <?php 
		$course_url = isset($_GET["curl"]) ? $_GET["curl"] : "https://w5.ab.ust.hk/wcq/cgi-bin/1340/subject/COMP/";
                $parser = new Parser();
		$result = $parser->parseCoursePage($course_url);
                print "\n";
                print_r($result);
            ?>
        </pre>
    </body>
</html>
