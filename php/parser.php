<?php

class Section {
    var $section;
    var $classnum;
    var $datetime;
    var $room;
    var $instructor;
    var $quota;
    var $enrol;
    var $avail;
    var $wait;
    var $remarks;
}

class Course {
    var $code;
    var $name;
    var $prerequisite;
    var $exclusion;
    var $prevcode;
    var $description;
    var $vector;
    var $attributes;
    var $attributes_popup;
    var $matching;
    var $sections;
}

function parseRemark($div) {
    $result = array();
    foreach ($div->childNodes as $child) {
        if ($child->nodeName=="#text") {
            $result[] = trim($child->textContent);
        }
    }
    return $result;
}

function parseQuota($element) {
    $details = array();
    $all = "";
    $divs = $element->getElementsByTagName("div");
    if ($divs->length==0) {
        $all = $element->nodeValue;
    }
    else {
        $all = $element->getElementsByTagName("span")->item(0)->nodeValue;
        foreach ($divs as $div) {
            if ($div->getAttribute("class")=="quotadetail") {
                // the header - Quota/Enrol/Avail
                $pattern = "/[A-Z][a-z]+\/[A-Z][a-z]+\/[A-Z][a-z]+/";
                preg_match($pattern, $div->nodeValue, $matches);
                $details[] = $matches[0];
                // the details - e.g. FINA: 5/0/5, MBA: 45/37/8
                $pattern = "/[A-Z]+: [0-9]+\/[0-9]+\/[0-9]+/";
                preg_match_all($pattern, $div->nodeValue, $matches);
                foreach ($matches[0] as $match) {
                    $details[] = $match;
                }
                break;
            }
        }
    }
    return array("all"=>$all, "details"=>$details);
}

function parseDateTime($element) {
    $datetime = array();
    // date, for summer and winter semster
    $pattern = "/[0-9]{2}-[A-Z]{3}-[0-9]{4} - [0-9]{2}-[A-Z]{3}-[0-9]{4}/";
    preg_match_all($pattern, $element->nodeValue, $matches);
    foreach ($matches[0] as $match) {
        $datetime[] = $match;
    }
    // weekday and time
    $pattern = "/(Mo|Tu|We|Th|Fr|Sa|Su)+ [0-9]{2}[:][0-9]{2}[A|P]M - [0-9]{2}[:][0-9]{2}[A|P]M/i";
    preg_match_all($pattern, $element->nodeValue, $matches);
    foreach ($matches[0] as $match) {
        $datetime[] = $match;
    }
    // TBA
    if (stripos($element->nodeValue, "TBA")!==false) {
        $datetime[] = "TBA";
    }
    return $datetime;
}

function parseCoursePage($url = "https://w5.ab.ust.hk/wcq/cgi-bin/") {
    if (strrpos($url, "/")!=strlen($url)-1) {
	$url .= "/";
    }
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    $output = curl_exec($ch);
    curl_close($ch);

    $doc = new DOMDocument();
    @$doc->loadHTML($output);
    
    $depts = array();
    $terms = array();
    $courses = array();

    $items = $doc->getElementsByTagName("div");
    foreach ($items as $item) {
        $element_classname = $item->getAttribute("class");
        if ($element_classname == "course") {
            // get all details of a course
            $c = new Course();
            // get course code
            $links = $item->getElementsByTagName("a");
            foreach ($links as $link) {
                if ($link->hasAttribute("name") && $link->parentNode->getAttribute("class")=="courseanchor") {
                    // course code
                    $c->code = trim($link->getAttribute("name"));
                }
            }
            // get course name
            $name_h2 = $item->getElementsByTagName("h2");
            if ($name_h2->length > 0) {
		preg_match("/- (.)+[(][0-9]/", $name_h2->item(0)->nodeValue, $matches);
		$cname = substr($matches[0], 2, -2);
                // course name
                $c->name = trim($cname);
		// credit
		preg_match("/[(][0-9]+( )/", $name_h2->item(0)->nodeValue, $matches);
		$cred = substr($matches[0], 1, -1);
		$c->credit = trim($cred);
            }
            $divs = $item->getElementsByTagName("div");
            foreach ($divs as $div) {
                // get whether matching is needed, the variable store a string
                // e.g. [Matching between Lecture & Tutorial required]
                // e.g. [Matching between Lecture & Lab required]
                if ($div->getAttribute("class")=="matching") {
                    $c->matching = trim($div->nodeValue);
                }
                // get popup attribute words, e.g. [3Y10], CC for 3Y 2010 & 2011 cohorts
                else if ($div->getAttribute("class")=="popup attrword") {
                    $innerspan = $div->getElementsByTagName("span")->item(0);
                    $innerdiv = $div->getElementsByTagName("div")->item(0);
                    $c->attributes_popup[] = array(trim($innerspan->nodeValue), trim($innerdiv->nodeValue));
                }
                // get popup course details
                else if ($div->getAttribute("class")=="popupdetail" && strpos($div->parentNode->getAttribute("class"), "courseattr")!==false) {
                    $details_table = $div->getElementsByTagName("table")->item(0);
                    $rows = $details_table->getElementsByTagName("tr");
                    foreach ($rows as $row) {
                        $header = trim($row->getElementsByTagName("th")->item(0)->nodeValue);
                        $content = trim($row->getElementsByTagName("td")->item(0)->nodeValue);
                        if ($header=="EXCLUSION") {
                            $c->exclusion = $content;
                        }
                        else if ($header=="PREVIOUS CODE") {
                            $c->prevcode = $content;
                        }
                        else if ($header=="DESCRIPTION") {
                            $c->description = $content;
                        }
                        else if ($header=="VECTOR") {
                            $c->vector = $content;
                        }
                        else if ($header=="PRE-REQUISITE") {
                            $c->prerequisite = $content;
                        }
                        else if ($header=="ATTRIBUTES") {
                            $element = $row->getElementsByTagName("td")->item(0);
                            foreach ($element->childNodes as $child) {
                                if ($child->nodeName=="#text") {
                                    $c->attributes[] = trim($child->textContent);
                                }
                            }
                        }
                    }
                }
            }
            // get sections information
            foreach ($item->getElementsByTagName("table") as $table) {
                if ($table->getAttribute("class")=="sections") {
                    // sections table
                    $rows = $table->getElementsByTagName("tr");
                    // get headers
                    $headers = $table->getElementsByTagName("th");
                    $keys = array();
                    $contents = array();
                    foreach ($headers as $header) {
                        $keys[] = str_replace(' ', '', $header->nodeValue);
                    }
                    // get info of each section
                    foreach ($rows as $row) {
                        $cols = $row->getElementsByTagName("td");
                        if ($cols->length == 0) {
                            continue;
                        }
                        $shift = 0;
                        if (strpos($row->getAttribute("class"), "newsect")===false) {
                            $contents["Section"] = $c->sections[count($c->sections)-1]->section;
                            $contents["ClassNum"] = $c->sections[count($c->sections)-1]->classnum;
                            $shift = 1;
                        }
                        for ($coln=0; $coln<$cols->length; $coln++) {
                            if ($keys[$coln+$shift]=="Remarks") {
                                $rdivs = $cols->item($coln)->getElementsByTagName("div");
                                foreach ($rdivs as $rdiv) {
                                    if ($rdiv->getAttribute("class")=="popupdetail") {
                                        $contents[$keys[$coln+$shift]] = parseRemark($rdiv);
                                        break;
                                    }
                                }
                            }
                            else if ($keys[$coln+$shift]=="Quota") {
                                $contents[$keys[$coln+$shift]] = parseQuota($cols->item($coln));
                            }
                            else if ($keys[$coln+$shift]=="Date&Time") {
                                $contents[$keys[$coln+$shift]] = parseDateTime($cols->item($coln));
                            }
                            else if ($keys[$coln+$shift]=="Section") {
                                $pattern = "/(L|LA|T|R)[0-9]+/i";
                                preg_match($pattern, $cols->item($coln)->nodeValue, $matches);
                                $contents[$keys[$coln+$shift]] = $matches[0];
                                $pattern = "/\([0-9]{4}\)/";
                                preg_match($pattern, $cols->item($coln)->nodeValue, $matches);
                                $contents["ClassNum"] = substr($matches[0], 1, 4);
                            }
                            else if ($keys[$coln+$shift]=="Instructor") {
                                $links = $cols->item($coln)->getElementsByTagName("a");
								$contents[$keys[$coln+$shift]] = array();
                                foreach ($links as $link) {
                                    $contents[$keys[$coln+$shift]][] = $link->nodeValue;
                                }
                                if (!isset($contents[$keys[$coln+$shift]])) {
                                    $contents[$keys[$coln+$shift]][0] = "TBA";
                                }
                            }
                            else {
                                $contents[$keys[$coln+$shift]] = $cols->item($coln)->nodeValue;
                            }
                        }
                        $s = new Section();
                        $s->section = isset($contents["Section"]) ? $contents["Section"] : "";
                        $s->datetime = isset($contents["Date&Time"]) ? $contents["Date&Time"] : "";
                        $s->room = isset($contents["Room"]) ? $contents["Room"] : "";
                        $s->instructor = isset($contents["Instructor"]) ? $contents["Instructor"] : "";
                        $s->quota = isset($contents["Quota"]) ? $contents["Quota"] : "";
                        $s->enrol = isset($contents["Enrol"]) ? $contents["Enrol"] : "";
                        $s->avail = isset($contents["Avail"]) ? $contents["Avail"] : "";
                        $s->wait = isset($contents["Wait"]) ? $contents["Wait"] : "";
                        $s->remarks = isset($contents["Remarks"]) ? $contents["Remarks"] : "";
                        $s->classnum = isset($contents["ClassNum"]) ? $contents["ClassNum"] : "";
                        // push the section into the course
                        $c->sections[] = $s;
                    }
                    break;
                }
            }
            // push it into the array
            $courses[] = $c;
        }
        else if ($element_classname == "depts") {
            // list of departments
            $deptsArr = $item->getElementsByTagName("a");
            foreach ($deptsArr as $dept) {
                $depts[] = $dept->nodeValue;
            }
        }
		else if ($element_classname == "termselect") {
			// get terms available
			$links = $item->parentNode->getElementsByTagName("a");
			foreach ($links as $link) {
				$address = $link->getAttribute("href");
				preg_match("/[0-9]{4}/", $address, $matches);
				if ($address=="#") {
					foreach ($terms as $term) {
						if ($term["text"]==trim($link->nodeValue)) {
							$terms["current"] = array("num" => $term["num"],
								"href" => $term["href"],
								"text" => $term["text"]
								);
						}
					}
				}
				else {
					$terms[] = array("num" => trim($matches[0]),
							"href" => trim($address),
							"text" => trim($link->nodeValue)
							);
				}
			}
		}
        else {
            // ignore other elements
            continue;
        }
    }
    return array("terms" => $terms, "depts" => $depts, "courses" => $courses);
}

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
                $result = parseCoursePage($course_url);
                print "\n";
                print_r($result);
            ?>
        </pre>
    </body>
</html>