<?php
ini_set('display_errors', 1);
error_reporting(E_ALL); //Выводим все ошибки и предупреждения

$address = '127.0.0.1'; // адресс localhost.
$port = 8889; // порт с которым будет установленно соединение.

$baseDir = dirname(__FILE__);
$pidfile = $baseDir.'/pid_file.pid';
$offfile = $baseDir.'/off_file.pid';

if(isset($_GET['act'])) $act = $_GET['act'];
else {
	echo "echo ws server admin is OK";
	exit();
}

if($act=='start') { //Если происходит действите старт, инициализируем игру
	exec("php -q echows.php &");

	//воткнуть паузу 0,5 для того, чтобы ws сервак мог нормально стартануть
	usleep(300000);
	status($pidfile);
	exit();
} elseif($act=='stop'){ //Если действите старт не произошло и игра не инициализирована, то выходим
	
	$pid = getstatus($pidfile);
	if($pid==-1){
		//echo "{color:\"grey\",msg:\"[<b>".date("Y.m.d-H:i:s")."</b>] ws echo server already stopped\"}";//Не работает передача - это JSON 
		status($pidfile);
		exit();
	} 
	//создаём offfile только зная что процесс запущен, чтобы избежать глюков при следующем запуске процесса
	file_put_contents($offfile, $pid);//СОХРАНЯЕМ PID в OFF файле

	usleep(300000);

	//Для того, чтобы полностью отключить сервер, нужно отправить ему сообщение, чтобы у него сработал read
	$socket = socket_create(AF_INET, SOCK_STREAM, SOL_TCP);
	if ($socket < 0){/* Ошибка */ }
	$connect = socket_connect($socket, $address, $port);
	if($connect === false) { /* echo "Ошибка : ".socket_strerror(socket_last_error())."<br />"; */ } 
	else { //Общение
		//echo 'Сервер сказал: '; $awr = socket_read($socket, 1024); echo $awr."<br />";
		//$msg = "Hello Сервер!"; echo "Говорим серверу \"".$msg."\"..."; socket_write($socket, $msg, strlen($msg));
	}

	if(isset($socket))	socket_close($socket);

	//воткнуть паузу для того, чтобы сервак мог нормально завершить работу
	usleep(500000);

	status($pidfile);
	exit();
} elseif($act=='status'){ //Если действите старт не произошло и игра не инициализирована, то выходим
	status($pidfile);
	exit();
}


function status($pidfile) {

  if( file_exists($pidfile)  ) {
    $pid = file_get_contents($pidfile);

	//получаем статус процесса
	$output = null;
	exec("ps -aux -p ".$pid, $output);
    
	if(count($output)>1){//Если в результате выполнения больше одной строки то процесс есть! т.к. первая строка это заголовок, а вторая уже процесс
		echo "{color:\"green\",msg:\"[<b>".date("Y.m.d-H:i:s")."</b>] ws echo server is running with PID =".$pid."<br />";
		echo $output[0]."<br />";//строка с информацией о процессе
		echo $output[1]."\"}";//строка с информацией о процессе
		return;
	} else {
      //pid-файл есть, но процесса нет
	  echo  "{color:\"red\",msg:\"[<b>".date("Y.m.d-H:i:s")."</b>] ws echo server is down cause abnormal reason with PID =".$pid."<br />\"}";
	  return;
    }
  }
  echo "{color:\"grey\",msg:\"[<b>".date("Y.m.d-H:i:s")."</b>] ws echo server is off, press start\"}";
}

function getstatus($pidfile) {

  if( file_exists($pidfile) ) {
    $pid = file_get_contents($pidfile);

	//получаем статус процесса
	$output = null;
	exec("ps -aux -p ".$pid, $output);
    
	if(count($output)>1){//Если в результате выполнения больше одной строки то процесс есть! т.к. первая строка это заголовок, а вторая уже процесс
		return $pid;
	} else {
      //pid-файл есть, но процесса нет
	   return -1;
    }
  }
  return -1;//файла и процесса нет
}

?>