<pre><?php

function parseCourse(&$htmlArray) {
	/* foreach($htmlArray as $line) {
		echo $line . "\n";
	} */
	
	//print_r($htmlArray);
	
	for($line=12 ; $htmlArray[$line]=="</div>" ; $line++);
	preg_match('/<h2>([A-Z]{4}) ([0-9]{4})([A-Z]?) - (.*) \(([0-9]{1,2}) unit[s]?\)<\/h2>/', $htmlArray[$line], $courseInfo);
	// print_r($courseInfo);
	
	$course['dept']    = $courseInfo[1];
	$course['code']    = $courseInfo[2];
	$course['subCode'] = $courseInfo[3];
	$course['title']   = $courseInfo[4];
	$course['credit']  = $courseInfo[5];
	
	$course['matching'] = "";
	if(preg_match("/<div class=\"matching\">\[Matching between (.*) required\]<\/div>/", $htmlArray[3], $temp)) {
		$course['matching'] = $temp[1];
	}
	
	
	$course['attribute'] = $htmlArray[8];
	
	preg_match_all("/<tr><th>(.*?)<\/th><td>(.*?)<\/td><\/tr>/", $htmlArray[8], $course['attribute']);
	
	print_r($course);
	
	//print_r($htmlArray);
	/* $sectionBreak = array();
	for($i=16 ; $i<count($htmlArray)-1 ; $i++) {
		if(preg_match("/<td align=\"center\"\s?(rowspan=\"[0-9]*\")?>([A-Za-z0-9]*) \(([0-9]*)\)<\/td>/", $htmlArray[$i])) {
			$n = array_push($sectionBreak, $i);
		}
	}
	$n = array_push($sectionBreak, $i);
	
	for($i=0 ; $i<$n-1 ; $i++) {
		preg_match("/<td align=\"center\"\s?(rowspan=\"[0-9]*\")?>([A-Za-z0-9]*) \(([0-9]*)\)<\/td>/", $htmlArray[$sectionBreak[$i]], $result1);
		
		$html = $htmlArray[ $sectionBreak[$i]+1 ];
		
		for($line=$sectionBreak[$i]+2 ; $line<$sectionBreak[$i+1] ; $line++) {
			$html = $html . $htmlArray[$line];
		}
		
		preg_match('/<td>(.*)<\/td><td>(.*)<\/td><td>(.*)<\/td><td\s?(class=\"quota\")? align=\"center\"\s?(rowspan=\"[0-9]*\")?>(.*)<\/td><td align=\"center\"\s?(rowspan=\"[0-9]*\")?>(.*)<\/td><td align=\"center\"\s?(rowspan=\"[0-9]*\")?>(.*)<\/td><td align=\"center\"\s?(rowspan=\"[0-9]*\")?>(.*)<\/td><td\s?(rowspan=\"[0-9]*\")? align=\"center\">(<div.*<\/div><\/div>)*&nbsp;<\/td><\/tr>(.*)/', $html, $result2);
		
		$rawData['section']    = $result1[2];
		$rawData['class']      = $result1[3];
		
		$rawData['slot'][0]['date'] = "";
		$rawData['slot'][0]['time'] = "";
		$result7 = explode("<br>",$result2[1]);
		if(count($result7)==1) {
			if($result7[0]!="TBA") {
				$rawData['slot'][0]['time'] = $result7[0];
			}
		} else {
			$rawData['slot'][0]['date'] = $result7[0];
			$rawData['slot'][0]['time'] = $result7[1];
		}
		
		$rawData['slot'][0]['venue'] = "";
		if($result2[2]!="TBA") {
			if(preg_match("/(.*?)\s?\([0-9]+\)/", $result2[2], $result6)) {
				$rawData['slot'][0]['venue'] = $result6[1];
			} else {
				$rawData['slot'][0]['venue'] = $result2[2];
			}
		}
		
		$rawData['slot'][0]['instructor'] = array();
		if($result2[3]!="TBA") {
			$rawData['slot'][0]['instructor'] = explode("<br>", strip_tags($result2[3], "<br>"));
		}
		if(preg_match("/<span>([0-9]*)<\/span>(.*)<br>(.*)<br><\/div><\/div>/", $result2[6], $result3)) {
			$rawData['quota']    = $result3[1];
			$rawData['subQuota'] = $result3[3];
		} else {
			$rawData['quota']    = strip_tags($result2[6]);
		}
		$rawData['enroll']     = strip_tags($result2[8]);
		$rawData['space']      = strip_tags($result2[10]);
		$rawData['wait']       = strip_tags($result2[12]);
		$rawData['consent'] = false;
		if(preg_match("/<div class=\"popup classnotes\"><div class=\"popupdetail\">(.*?)<\/div><\/div>(<div class=\"popup consent\"><div class=\"popupdetail\">Instructor Consent Required)?/", $result2[14], $result5)) {
			$rawData['remark'] = explode("<br />&gt; ", "<br />" . $result5[1]);
			array_shift($rawData['remark']);
			if($result5[2]) {
				$rawData['consent'] = true;
			}
		}
		preg_match_all("/<tr class=\"sect(odd|even)\"><td>(.*?)<\/td><td>(.*?)<\/td><td>(.*?)<\/td><\/tr>/", $result2[15], $result4);
		for($k=0 ; $k<count($result4[0]) ; $k++) {
			$rawData['slot'][$k+1]['date'] = "";
			$rawData['slot'][$k+1]['time'] = "";
			$result7 = explode("<br>",$result4[2][$k]);
			if(count($result7)==1) {
				if($result7[0]!="TBA") {
					$rawData['slot'][$k+1]['time'] = $result7[0];
				}
			} else {
				$rawData['slot'][$k+1]['date'] = $result7[0];
				$rawData['slot'][$k+1]['time'] = $result7[1];
			}
			$rawData['slot'][$k+1]['venue'] = "";
			if($result4[3][$k]!="TBA") {
				if(preg_match("/(.*?)\s?\([0-9]+\)/", $result4[3][$k], $result6)) {
					$rawData['slot'][$k+1]['venue']  = $result6[1];
				} else {
					$rawData['slot'][$k+1]['venue']  = $result2[2];
				}
			}
			$rawData['slot'][$k+1]['instructor'] = array();
			if($result4[4][$k]!="TBA") {
				$rawData['slot'][$k+1]['instructor'] = explode("<br>", strip_tags($result4[4][$k], "<br>"));
			}
		}
		
		for($k=0 ; $k<count($rawData['slot']) ; $k++) {
			if(	empty($rawData['slot'][$k]['date']) &&
				empty($rawData['slot'][$k]['time']) &&
				empty($rawData['slot'][$k]['venue']) &&
				count($rawData['slot'][$k]['instructor'])==0 ) {
					array_splice($rawData['slot'], $k--, 1);
				}
		}
		
		print_r($rawData);
	} */
}

function parseDept($url) {
	$webPageLine = explode("\n",str_replace("\r","",file_get_contents($url)));
	
	$courseAppeared = false;
	$seperatorLineIds = array();

	for($lineId=0, $lineNum=count($webPageLine) ; ($lineId+1)<$lineNum ; $lineId++) {
		$line = trim($webPageLine[$lineId]);
		$nextLine = trim($webPageLine[$lineId + 1]);
		
		if($line == "<div class=\"course\">" || $courseAppeared && $line == "</div>" && $nextLine == "<script type=\"text/javascript\">") {
			$courseAppeared = true;
			array_push($seperatorLineIds, $lineId);
		}
	}

	// print_r($seperatorLineIds);
	// parseCourses($webPageLine, $seperatorLineIds);
	$courseNum = count($seperatorLineIds) - 1;
	for($i=0 ; $i<$courseNum ; $i++) {
		parseCourse(array_slice($webPageLine, $seperatorLineIds[$i], $seperatorLineIds[$i+1]-$seperatorLineIds[$i]));
	}
}

parseDept("https://w5.ab.ust.hk/wcq/cgi-bin/1330/subject/HUMA");

?></pre>