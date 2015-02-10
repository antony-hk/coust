<?php
header("Content-Type: text/css");
$bgColor = array(
	array('FEC','FC9','EED','FFE','F73','E86','EBB','8EF','9FB','FCF')
);
$borderColor = array(
	array('544','543','432','554','521','422','433','245','353','535')
);
$textColor = array(
	array('544','543','432','554','521','422','433','245','353','535')
);
$colorChosen = rand(0, count($color)-1);
foreach($bgColor[$colorChosen] as $i => $bgColorCode) {
	echo ".color{$i} {";
		echo "background: #{$bgColorCode};";
	echo "}\n";
	echo "div.color{$i} {";
		echo "border: 2px solid #{$borderColor[$colorChosen][$i]};";
		echo "color: #{$textColor[$colorChosen][$i]};";
	echo "}\n";
	echo "tr.color{$i} {";
		echo "color: #{$textColor[$colorChosen][$i]};";
	echo "}\n";
}
?>