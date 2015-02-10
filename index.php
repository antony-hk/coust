<!DOCTYPE html>
<html>
    <head>
        <meta name="description" content="CoUST - A visualized course planner which enables you to manage timetable by drag and drop. Specialized for HKUST students.">
        <meta name="keywords" content="HKUST, Course Planner, CoUST, Courser, Github">
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="shortcut icon" href="favicon.ico">
        <script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
        <!--<link rel="stylesheet" href="//ajax.googleapis.com/ajax/libs/jqueryui/1.11.0/themes/smoothness/jquery-ui.css" />-->
		<link rel="stylesheet" href="ui.css">
        <script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.11.0/jquery-ui.min.js"></script>
        <script src="jquery.ui.touch-punch.min.js"></script>
        <link rel="stylesheet" href="style.css" />
		<link rel="stylesheet" href="color.php" />
        <script src="timetable.js"></script>
		<link href="http://fonts.googleapis.com/css?family=Open+Sans:300italic,400italic,600italic,700italic,800italic,400,300,600,700,800" rel="stylesheet" type="text/css">
        <title>CoUST | HKUST Timetable Planner </title>
    </head>
    <body>
	<header>
		<div class="container">
			<a class="logo" href="."></a>
			<div id="searchBar">
				<form onsubmit="return addCourse('','')">
					<ul>
						<li id="termInfo">Loading...</li>
						<li><input type="text" id="add" value="Add Courses to Timetable"></li>
					</ul>
				</form>
			</div>
		</div>
	</header>
	<div class="headerFix"></div>
	<div class="container">
        <div id="timetable_wrapper" class="noselect">
            <div id="readmode"><span title="Any changes will not be saved.">Read Mode</span></div>
            <div id="loading" style="display: block;width: 200px;margin: 0 auto; padding-top: 50px; font-size: 50px;">
                <span>Loading...</span>
            </div>
            <div id="timetable-div">
            <table id="timetable" class="content">
                <colgroup></colgroup>
                <colgroup span="2"></colgroup>
                <colgroup span="2"></colgroup>
                <colgroup span="2"></colgroup>
                <colgroup span="2"></colgroup>
                <colgroup span="2"></colgroup>
                <colgroup span="2"></colgroup>
                <colgroup span="2"></colgroup>
                <colgroup span="2"></colgroup>
                <colgroup span="2"></colgroup>
                <colgroup span="2"></colgroup>
                <colgroup span="2"></colgroup>
                <colgroup span="2"></colgroup>
                <colgroup span="2"></colgroup>
                <colgroup span="2"></colgroup>
                <tbody id="times">
                    <tr class="times-tr">
                    <td class="time"><div class="timediv">09:00</div></td>
                    <td class="time alt"><div class="timediv">09:30</div></td>
                    <td class="time"><div class="timediv">10:00</div></td>
                    <td class="time alt"><div class="timediv">10:30</div></td>
                    <td class="time"><div class="timediv">11:00</div></td>
                    <td class="time alt"><div class="timediv">11:30</div></td>
                    <td class="time"><div class="timediv">12:00</div></td>
                    <td class="time alt"><div class="timediv">12:30</div></td>
                    <td class="time"><div class="timediv">13:00</div></td>
                    <td class="time alt"><div class="timediv">13:30</div></td>
                    <td class="time"><div class="timediv">14:00</div></td>
                    <td class="time alt"><div class="timediv">14:30</div></td>
                    <td class="time"><div class="timediv">15:00</div></td>
                    <td class="time alt"><div class="timediv">15:30</div></td>
                    <td class="time"><div class="timediv">16:00</div></td>
                    <td class="time alt"><div class="timediv">16:30</div></td>
                    <td class="time"><div class="timediv">17:00</div></td>
                    <td class="time alt"><div class="timediv">17:30</div></td>
                    <td class="time"><div class="timediv">18:00</div></td>
                    <td class="time alt"><div class="timediv">18:30</div></td>
                    <td class="time"><div class="timediv">19:00</div></td>
                    <td class="time alt"><div class="timediv">19:30</div></td>
                    <td class="time"><div class="timediv">20:00</div></td>
                    <td class="time alt"><div class="timediv">20:30</div></td>
                    <td class="time"><div class="timediv">21:00</div></td>
                    <td class="time alt"><div class="timediv">21:30</div></td>
                    <td class="time"><div class="timediv">22:00</div></td>
                    <td class="time alt"><div class="timediv">22:30</div></td>
                    <td class="time"><div class="timediv">23:00</div></td>
                    <td></td>
                    </tr>
                </tbody>
                <tbody id="Mo" class="days">
                    <tr>
                    <th class="weekday" rowspan="1">MON</th>
                    <td class="h09 m00"></td>
                    <td class="h09 m30"></td>
                    <td class="h10 m00"></td>
                    <td class="h10 m30"></td>
                    <td class="h11 m00"></td>
                    <td class="h11 m30"></td>
                    <td class="h12 m00"></td>
                    <td class="h12 m30"></td>
                    <td class="h13 m00"></td>
                    <td class="h13 m30"></td>
                    <td class="h14 m00"></td>
                    <td class="h14 m30"></td>
                    <td class="h15 m00"></td>
                    <td class="h15 m30"></td>
                    <td class="h16 m00"></td>
                    <td class="h16 m30"></td>
                    <td class="h17 m00"></td>
                    <td class="h17 m30"></td>
                    <td class="h18 m00"></td>
                    <td class="h18 m30"></td>
                    <td class="h19 m00"></td>
                    <td class="h19 m30"></td>
                    <td class="h20 m00"></td>
                    <td class="h20 m30"></td>
                    <td class="h21 m00"></td>
                    <td class="h21 m30"></td>
                    <td class="h22 m00"></td>
                    <td class="h22 m30"></td>
                    </tr>
                </tbody>
                <tr class="separator"><th></th><td colspan="28"></td></tr>
                <tbody id="Tu" class="days">
                    <tr>
                    <th class="weekday" rowspan="1">TUE</th>
                    <td class="h09 m00"></td>
                    <td class="h09 m30"></td>
                    <td class="h10 m00"></td>
                    <td class="h10 m30"></td>
                    <td class="h11 m00"></td>
                    <td class="h11 m30"></td>
                    <td class="h12 m00"></td>
                    <td class="h12 m30"></td>
                    <td class="h13 m00"></td>
                    <td class="h13 m30"></td>
                    <td class="h14 m00"></td>
                    <td class="h14 m30"></td>
                    <td class="h15 m00"></td>
                    <td class="h15 m30"></td>
                    <td class="h16 m00"></td>
                    <td class="h16 m30"></td>
                    <td class="h17 m00"></td>
                    <td class="h17 m30"></td>
                    <td class="h18 m00"></td>
                    <td class="h18 m30"></td>
                    <td class="h19 m00"></td>
                    <td class="h19 m30"></td>
                    <td class="h20 m00"></td>
                    <td class="h20 m30"></td>
                    <td class="h21 m00"></td>
                    <td class="h21 m30"></td>
                    <td class="h22 m00"></td>
                    <td class="h22 m30"></td>
                    </tr>
                </tbody>
                <tr class="separator"><th></th><td colspan="28"></td></tr>
                <tbody id="We" class="days">
                    <tr>
                    <th class="weekday" rowspan="1">WED</th>
                    <td class="h09 m00"></td>
                    <td class="h09 m30"></td>
                    <td class="h10 m00"></td>
                    <td class="h10 m30"></td>
                    <td class="h11 m00"></td>
                    <td class="h11 m30"></td>
                    <td class="h12 m00"></td>
                    <td class="h12 m30"></td>
                    <td class="h13 m00"></td>
                    <td class="h13 m30"></td>
                    <td class="h14 m00"></td>
                    <td class="h14 m30"></td>
                    <td class="h15 m00"></td>
                    <td class="h15 m30"></td>
                    <td class="h16 m00"></td>
                    <td class="h16 m30"></td>
                    <td class="h17 m00"></td>
                    <td class="h17 m30"></td>
                    <td class="h18 m00"></td>
                    <td class="h18 m30"></td>
                    <td class="h19 m00"></td>
                    <td class="h19 m30"></td>
                    <td class="h20 m00"></td>
                    <td class="h20 m30"></td>
                    <td class="h21 m00"></td>
                    <td class="h21 m30"></td>
                    <td class="h22 m00"></td>
                    <td class="h22 m30"></td>
                    </tr>
                </tbody>
                <tr class="separator"><th></th><td colspan="28"></td></tr>
                <tbody id="Th" class="days">
                    <tr>
                    <th class="weekday" rowspan="1">THU</th>
                    <td class="h09 m00"></td>
                    <td class="h09 m30"></td>
                    <td class="h10 m00"></td>
                    <td class="h10 m30"></td>
                    <td class="h11 m00"></td>
                    <td class="h11 m30"></td>
                    <td class="h12 m00"></td>
                    <td class="h12 m30"></td>
                    <td class="h13 m00"></td>
                    <td class="h13 m30"></td>
                    <td class="h14 m00"></td>
                    <td class="h14 m30"></td>
                    <td class="h15 m00"></td>
                    <td class="h15 m30"></td>
                    <td class="h16 m00"></td>
                    <td class="h16 m30"></td>
                    <td class="h17 m00"></td>
                    <td class="h17 m30"></td>
                    <td class="h18 m00"></td>
                    <td class="h18 m30"></td>
                    <td class="h19 m00"></td>
                    <td class="h19 m30"></td>
                    <td class="h20 m00"></td>
                    <td class="h20 m30"></td>
                    <td class="h21 m00"></td>
                    <td class="h21 m30"></td>
                    <td class="h22 m00"></td>
                    <td class="h22 m30"></td>
                    </tr>
                </tbody>
                <tr class="separator"><th></th><td colspan="28"></td></tr>
                <tbody id="Fr" class="days">
                    <tr>
                    <th class="weekday" rowspan="1">FRI</th>
                    <td class="h09 m00"></td>
                    <td class="h09 m30"></td>
                    <td class="h10 m00"></td>
                    <td class="h10 m30"></td>
                    <td class="h11 m00"></td>
                    <td class="h11 m30"></td>
                    <td class="h12 m00"></td>
                    <td class="h12 m30"></td>
                    <td class="h13 m00"></td>
                    <td class="h13 m30"></td>
                    <td class="h14 m00"></td>
                    <td class="h14 m30"></td>
                    <td class="h15 m00"></td>
                    <td class="h15 m30"></td>
                    <td class="h16 m00"></td>
                    <td class="h16 m30"></td>
                    <td class="h17 m00"></td>
                    <td class="h17 m30"></td>
                    <td class="h18 m00"></td>
                    <td class="h18 m30"></td>
                    <td class="h19 m00"></td>
                    <td class="h19 m30"></td>
                    <td class="h20 m00"></td>
                    <td class="h20 m30"></td>
                    <td class="h21 m00"></td>
                    <td class="h21 m30"></td>
                    <td class="h22 m00"></td>
                    <td class="h22 m30"></td>
                    </tr>
                </tbody>
                <tr class="separator"><th></th><td colspan="28"></td></tr>
                <tbody id="Sa" class="days hidden">
                    <tr>
                    <th class="weekday" rowspan="1">SAT</th>
                    <td class="h09 m00"></td>
                    <td class="h09 m30"></td>
                    <td class="h10 m00"></td>
                    <td class="h10 m30"></td>
                    <td class="h11 m00"></td>
                    <td class="h11 m30"></td>
                    <td class="h12 m00"></td>
                    <td class="h12 m30"></td>
                    <td class="h13 m00"></td>
                    <td class="h13 m30"></td>
                    <td class="h14 m00"></td>
                    <td class="h14 m30"></td>
                    <td class="h15 m00"></td>
                    <td class="h15 m30"></td>
                    <td class="h16 m00"></td>
                    <td class="h16 m30"></td>
                    <td class="h17 m00"></td>
                    <td class="h17 m30"></td>
                    <td class="h18 m00"></td>
                    <td class="h18 m30"></td>
                    <td class="h19 m00"></td>
                    <td class="h19 m30"></td>
                    <td class="h20 m00"></td>
                    <td class="h20 m30"></td>
                    <td class="h21 m00"></td>
                    <td class="h21 m30"></td>
                    <td class="h22 m00"></td>
                    <td class="h22 m30"></td>
                    </tr>
                </tbody>
                <tr class="separator"><th></th><td colspan="28"></td></tr>
                <tbody id="Su" class="days hidden">
                    <tr>
                    <th class="weekday" rowspan="1">SUN</th>
                    <td class="h09 m00"></td>
                    <td class="h09 m30"></td>
                    <td class="h10 m00"></td>
                    <td class="h10 m30"></td>
                    <td class="h11 m00"></td>
                    <td class="h11 m30"></td>
                    <td class="h12 m00"></td>
                    <td class="h12 m30"></td>
                    <td class="h13 m00"></td>
                    <td class="h13 m30"></td>
                    <td class="h14 m00"></td>
                    <td class="h14 m30"></td>
                    <td class="h15 m00"></td>
                    <td class="h15 m30"></td>
                    <td class="h16 m00"></td>
                    <td class="h16 m30"></td>
                    <td class="h17 m00"></td>
                    <td class="h17 m30"></td>
                    <td class="h18 m00"></td>
                    <td class="h18 m30"></td>
                    <td class="h19 m00"></td>
                    <td class="h19 m30"></td>
                    <td class="h20 m00"></td>
                    <td class="h20 m30"></td>
                    <td class="h21 m00"></td>
                    <td class="h21 m30"></td>
                    <td class="h22 m00"></td>
                    <td class="h22 m30"></td>
                    </tr>
                </tbody>
            </table>
            </div>
        </div>
        <div class="content">
            <div style="margin-right:50px;float:right;">
                <div id="dialog"></div>
                <div>
                    <p><button id="show-faq" style="width: 120px">Show FAQ</button></p>
                    <?php if($_GET["debug"]) echo '<p><button id="switch-view" style="width: 120px" onclick="switchView()">Switch View</button></p>'; ?>
                </div>
                <div>
                    <p style="font-size: 10px; color: gray;">Data Last Updated: <br/><span id="update-time"></span></p>
                </div>
            </div>
            <div id="tba-courses-div" style="color: gray; font-size: 14px; margin-left: 50px;">
                Courses with "TBA" date & time: <span id="no-tba">None</span><span id="tba-courses"></span>
            </div>
            <table id="timetable_controls">
                <thead>
                <tr>
                    <th>Code</th>
                    <th>Title</th>
                    <th>Actions</th>
                </tr>
                <tr id="none">
                    <td colspan="3">No courses added.</td>
                </tr>
                </thead>
                <tbody id="courselist">
                </tbody>
            </table>
        </div>
        <div title="FAQ" id="faq" style="display: none; line-height: 25px; text-align: left; padding: 20px 20px; font-size: 15px;">
            <p>
            <div><strong>Q:</strong> Is data always up-to-date?</div>
            <div><strong>A:</strong> No, data have to be manually updated by running <a style="color: darkblue" target="_blank" href="http://coust.442.hk/json/mkdata.php">this page</a> to obtain and save data from <a style="color: darkblue" target="_blank" href="https://w5.ab.ust.hk/wcq/cgi-bin/">HKUST Class Schedule and Quota</a> by crawling and parsing the website, i.e. data are correct up to the latest time of running the data retrieving page.</div>
            </p>
            <p>
            <div><strong>Q:</strong> What is Read Mode?</div>
            <div><strong>A:</strong> With read mode on, you can only view the timetable. And your original timetable in non read mode will not be affected. You may exit read mode and view your own timetable by clicking the logo (which returns to the home page).</div>
            </p>
            <p>
            <div><strong>Q:</strong> Does the web app supports all browsers?</div>
            <div><strong>A:</strong> No, the web app uses jQuery and thus requires browser version supporting jQuery (e.g. IE9+).</div>
            </p>
            <p>
			<div><strong>If you any enquires, please find us on <a href="http://www.facebook.com/CoUST.HK">our Facebook page</a>.</strong></div>
			</p>
            <div><strong>GitHub:</strong> <a target="_blank" href="https://github.com/antonytse/CoUST">https://github.com/antonytse/CoUST</a></div>
            </p>
            </p>
            <div><strong>Authors:</strong> Alan Chung, Antony Tse</div>
            </p>
        </div>
    </div>
    </body>
</html>
