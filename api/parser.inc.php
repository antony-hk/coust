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
    var $credit;
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

class Parser {

    private function parseRemark($div) {
        $result = array();
        foreach ($div->childNodes as $child) {
            if ($child->nodeName=="#text") {
                $text = trim($child->textContent);
                // Today's markup leaves blank text nodes around the <br> tags.
                // The 2023-24 Fall payload contains no empty remark entries at
                // all, so drop them instead of padding the array.
                if ($text !== "") {
                    $result[] = $text;
                }
            }
        }
        return $result;
    }

    private function parseQuota($element) {
        $details = array();
        $all = "";
        // An empty Quota cell — every continuation row has one — was reported as
        // "" by the old API, not as an object. Keep that.
        if (trim($element->nodeValue) === "") {
            return "";
        }
        $divs = $element->getElementsByTagName("div");
        if ($divs->length==0) {
            $all = $element->nodeValue;
        }
        else {
            // ->item(0) is null when the cell has no <span>; reading ->nodeValue
            // off that is a fatal error in PHP 8, not a warning.
            $span = $element->getElementsByTagName("span")->item(0);
            $all = $span === null ? $element->nodeValue : $span->nodeValue;
            foreach ($divs as $div) {
                if ($div->getAttribute("class")=="quotadetail") {
                    // the header - Quota/Enrol/Avail
                    $pattern = "/[A-Z][a-z]+\/[A-Z][a-z]+\/[A-Z][a-z]+/";
                    if (preg_match($pattern, $div->nodeValue, $matches)) {
                        $details[] = $matches[0];
                    }
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

    private function parseDateTime($element) {
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

    /*
     * HKUST serves the whole term selector inside an HTML comment:
     *
     *   <!--<div> <li class="term"><div class="termselect">
     *       <a href="/wcq/cgi-bin/2610/">2026-27 Fall</a>...</div>
     *       <a href="#" onclick="return false">2026-27 Fall <i></i></a></li>...-->
     *
     * DOMDocument turns that into a single comment node, so no amount of
     * getElementsByTagName() will ever reach it — which is why `terms` came back
     * empty, `$term` became null, and mkdata.php wrote `courseInfo_.json`.
     *
     * The comment node itself is still in the tree, so its contents can simply
     * be re-parsed and walked as HTML. Both layouts are handled: live markup is
     * tried first, the comment second.
     */
    private function parseTerms($doc) {
        // The selector is normally live markup; try the element tree first.
        $terms = $this->termsFromDoc($doc);

        // When it is commented out, DOMDocument still keeps the comment as a node
        // — re-parse its contents and walk that with the DOM the same way.
        if (empty($terms)) {
            $xpath = new DOMXPath($doc);
            foreach ($xpath->query("//comment()") as $comment) {
                if (strpos($comment->nodeValue, "termselect") === false) {
                    continue;
                }
                $inner = new DOMDocument();
                @$inner->loadHTML('<meta http-equiv="Content-Type" content="text/html; charset=utf-8">'
                    . $comment->nodeValue);
                $terms = $this->termsFromDoc($inner);
                if (!empty($terms)) {
                    break;
                }
            }
        }

        // Fallback: every department link carries the term being viewed, so the
        // current term still resolves even if the selector markup disappears.
        if (!isset($terms["current"])) {
            $xpath = new DOMXPath($doc);
            $deptLinks = $xpath->query('//div[@class="depts"]//a');
            if ($deptLinks->length > 0
                && preg_match("/\/(\d{4})\/subject\//", $deptLinks->item(0)->getAttribute("href"), $m)) {
                foreach ($terms as $key => $term) {
                    if ($key !== "current" && $term["num"] === $m[1]) {
                        $terms["current"] = $term;
                        break;
                    }
                }
                if (!isset($terms["current"])) {
                    $terms["current"] = array("num"  => $m[1],
                                              "href" => "/wcq/cgi-bin/" . $m[1] . "/",
                                              "text" => $m[1]
                                              );
                }
            }
        }

        return $terms;
    }

    private function termsFromDoc($doc) {
        $terms = array();
        $xpath = new DOMXPath($doc);

        foreach ($xpath->query('//div[@class="termselect"]//a') as $link) {
            $href = $link->getAttribute("href");
            if (!preg_match("/\/(\d{4})\/?$/", $href, $m)) {
                continue;
            }
            $terms[] = array("num"  => $m[1],
                             "href" => $href,
                             "text" => trim($link->textContent)
                             );
        }
        if (empty($terms)) {
            return $terms;
        }

        // The current term is the plain <a href="#"> label beside the selector.
        foreach ($xpath->query('//a[@href="#"]') as $label) {
            $text = trim($label->textContent);
            foreach ($terms as $term) {
                if ($term["text"] === $text) {
                    $terms["current"] = $term;
                    break 2;
                }
            }
        }

        return $terms;
    }

    public function parseCoursePage($url = "https://w5.ab.ust.hk/wcq/cgi-bin/") {

        // siteAlive() used to gate every call, which doubled the number of requests
        // and judged a 340KB page against a 5 second budget. The real request now
        // carries its own timeout and its status code is checked directly instead.
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        // CURLOPT_TIMEOUT defaults to 0, meaning "wait forever", and PHP's
        // max_execution_time does not count time spent in external I/O — without
        // these two lines nothing would ever stop a stalled crawl.
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);
        curl_setopt($ch, CURLOPT_TIMEOUT, 60);
        curl_setopt($ch, CURLOPT_USERAGENT, "coust-parser/1.0");
        $output = curl_exec($ch);
        $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($output === false || $httpcode < 200 || $httpcode >= 300) {
            return null;
        }

        $doc = new DOMDocument();
        @$doc->loadHTML($output);

        $depts = array();
        $terms = $this->parseTerms($doc);
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
                // The heading used to be an <h2>. HKUST now renders it as
                //   <div class='subject'>ACCT 2010 - Principles of Accounting I (3 units)</div>
                // so the old lookup found nothing and every name/credit came out null.
                $heading = "";
                foreach ($item->getElementsByTagName("div") as $sdiv) {
                    if ($sdiv->getAttribute("class") == "subject") {
                        $heading = $sdiv->nodeValue;
                        break;
                    }
                }
                if ($heading !== "") {
                    // course name
                    if (preg_match('/- (.+)\(\d/', $heading, $matches)) {
                        $c->name = trim($matches[1]);
                    }
                    // credit
                    if (preg_match('/\((\d+)/', $heading, $matches)) {
                        $c->credit = $matches[1];
                    }
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
                        if ($innerspan !== null && $innerdiv !== null) {
                            $c->attributes_popup[] = array(trim($innerspan->nodeValue), trim($innerdiv->nodeValue));
                        }
                    }
                    // get popup course details
                    else if ($div->getAttribute("class")=="popupdetail" && strpos($div->parentNode->getAttribute("class"), "courseattr")!==false) {
                        $details_table = $div->getElementsByTagName("table")->item(0);
                        if ($details_table === null) {
                            continue;
                        }
                        $rows = $details_table->getElementsByTagName("tr");
                        foreach ($rows as $row) {
                            $th = $row->getElementsByTagName("th")->item(0);
                            $td = $row->getElementsByTagName("td")->item(0);
                            if ($th === null || $td === null) {
                                continue;
                            }
                            $header = trim($th->nodeValue);
                            $content = trim($td->nodeValue);
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
                            $rowclass = $row->getAttribute("class");
                            $isMainRow = strpos($rowclass, "mainRow") !== false;
                            $isOtherRow = strpos($rowclass, "otherRow") !== false;
                            // The table also carries mobile-only duplicates
                            // (mobileInstructorRow, mobileViewDetail). Accepting any row
                            // with cells counted every section about three times over.
                            if (!$isMainRow && !$isOtherRow) {
                                continue;
                            }
                            $contents = array();
                            $cols = $row->getElementsByTagName("td");
                            if ($cols->length == 0) {
                                continue;
                            }
                            // A continuation row now carries an empty Section cell instead
                            // of one fewer column, so the headers line up one to one and
                            // the old $shift would push every value into the wrong field.
                            $prev = ($isOtherRow && !empty($c->sections))
                                ? $c->sections[count($c->sections)-1] : null;
                            for ($coln=0; $coln<$cols->length; $coln++) {
                                if (!isset($keys[$coln])) {
                                    continue;
                                }
                                if ($keys[$coln]=="Remarks") {
                                    $rdivs = $cols->item($coln)->getElementsByTagName("div");
                                    foreach ($rdivs as $rdiv) {
                                        if ($rdiv->getAttribute("class")=="popupdetail") {
                                            if (empty($contents[$keys[$coln]])) {
                                                $contents[$keys[$coln]] = array();
                                            }
                                            $contents[$keys[$coln]]
                                            = array_merge($contents[$keys[$coln]], $this->parseRemark($rdiv));
                                        }
                                    }
                                }
                                else if ($keys[$coln]=="Quota") {
                                    $contents[$keys[$coln]] = $this->parseQuota($cols->item($coln));
                                }
                                else if ($keys[$coln]=="Date&Time") {
                                    $contents[$keys[$coln]] = $this->parseDateTime($cols->item($coln));
                                }
                                else if ($keys[$coln]=="Section") {
                                    // `X` is not a typo: self-paced online classes use
                                    // LX / LAX, which the old /[0-9]+/ silently dropped.
                                    $pattern = "/(L|LA|T|R)(X|[0-9]+)[A-Z]*/i";
                                    $cell = $cols->item($coln)->nodeValue;
                                    $contents[$keys[$coln]] =
                                        preg_match($pattern, $cell, $matches) ? $matches[0] : "";
                                    $pattern = "/\([0-9]{4}\)/";
                                    $contents["ClassNum"] =
                                        preg_match($pattern, $cell, $matches) ? substr($matches[0], 1, 4) : "";
                                }
                                else if ($keys[$coln]=="Instructor") {
                                    $links = $cols->item($coln)->getElementsByTagName("a");
                                                                    $contents[$keys[$coln]] = array();
                                    foreach ($links as $link) {
                                        $contents[$keys[$coln]][] = $link->nodeValue;
                                    }
                                    if (!isset($contents[$keys[$coln]])) {
                                        $contents[$keys[$coln]][0] = "TBA";
                                    }
                                }
                                else {
                                    $contents[$keys[$coln]] = $cols->item($coln)->nodeValue;
                                }
                            }
                            // The Section cell is blank on a continuation row — carry the
                            // code and class number down from the row it belongs to.
                            if ($prev !== null) {
                                if (empty($contents["Section"])) {
                                    $contents["Section"] = $prev->section;
                                }
                                if (empty($contents["ClassNum"])) {
                                    $contents["ClassNum"] = $prev->classnum;
                                }
                                // Some continuation rows spell the instructor as plain
                                // "TBA" instead of repeating the link, which reads as no
                                // instructor at all. The old API carried the name down
                                // (422 of 425 such rows in the 2023-24 Fall data), so do
                                // the same rather than dropping it.
                                if (empty($contents["Instructor"])) {
                                    $contents["Instructor"] = $prev->instructor;
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
                    // A "termselect" branch used to sit here. It could never fire:
                    // HKUST wraps the entire term selector in an HTML comment, and a
                    // comment is not an element, so DOMDocument never yielded it.
                    // Terms now come from the raw HTML — see parseTerms().
            else {
                // ignore other elements
                continue;
            }
        }
        return array("terms" => $terms, "depts" => $depts, "courses" => $courses);
    }

    // No longer called by parseCoursePage(); kept for any external caller.
    public function siteAlive( $url ) {
        // Undefined under CLI/cron, where there is no incoming request.
        $useragent = isset($_SERVER['HTTP_USER_AGENT'])
            ? $_SERVER['HTTP_USER_AGENT'] : "coust-parser/1.0";

        $options = array(
                CURLOPT_RETURNTRANSFER => true,      // return web page
                CURLOPT_HEADER         => false,     // do not return headers
                CURLOPT_FOLLOWLOCATION => true,      // follow redirects
                CURLOPT_USERAGENT      => $useragent, // who am i
                CURLOPT_AUTOREFERER    => true,       // set referer on redirect
                CURLOPT_CONNECTTIMEOUT => 5,          // timeout on connect (in seconds)
                CURLOPT_TIMEOUT        => 5,          // timeout on response (in seconds)
                CURLOPT_MAXREDIRS      => 10,         // stop after 10 redirects
                CURLOPT_SSL_VERIFYPEER => false,     // SSL verification not required
                CURLOPT_SSL_VERIFYHOST => false,     // SSL verification not required
        );
        $ch = curl_init( $url );
        curl_setopt_array( $ch, $options );
        curl_exec( $ch );

        $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        return ($httpcode >= 200 && $httpcode<300);
    }

}

?>
