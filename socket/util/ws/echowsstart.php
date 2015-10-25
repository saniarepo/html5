<?php
$baseDir = dirname(__FILE__);
$pidfile = $baseDir.'/pid_file.pid';

if( file_exists($pidfile) ) {	//Не будем делать сложные проверки на устойчивость и долбать сервер, pid-файл есть, значит всё работает. 
	echo "{run:1}"; //1 уже запущен
} else {
	exec("php -q echows.php &");
	echo "{run:2}"; //2 сейчас будет запущен
}
?>
