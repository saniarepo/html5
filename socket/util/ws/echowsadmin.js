// =============================================================
// script written by Petukhovsky - 2014.06.16
// http://petukhovsky.com
// =============================================================

"use strict"; //All my JavaScript written in Strict Mode http://ecma262-5.com/ELS5_HTML.htm#Annex_C

(function () {
    // ======== private vars ========
	var srvaddress = 'http://yourdomain.com/';
	var adminaddress = srvaddress+'echowsadmin.php?';
	var logfile = srvaddress+'echowslog.html?';


	var xhttp, xhttplog;

    ////////////////////////////////////////////////////////////////////////////
    var init = function () {

		loaddataloop();

		document.getElementById('echo-ws-start').onclick = function () {
			loaddata('act=start');
		}; 

		document.getElementById('echo-ws-stop').onclick = function () {
			loaddata('act=stop');
		}; 

		//document.getElementById('echo-ws-restart').onclick = function () {
		//	loaddata('act=restart');
		//}; 

		document.getElementById('echo-ws-status-refresh').onclick = function () {
			loaddata('act=status');
		}; 

		document.getElementById('echo-ws-logfile-refresh').onclick = function () {
			load_log();
		}; 


    };

    //////////////////////////////DATAEXCHANGE/////////////////////////////////////
    var loaddata = function(act) {

		document.getElementById('echo-ws-status-refresh').disabled = true;
		document.getElementById('echo-ws-start').disabled = true;
		document.getElementById('echo-ws-stop').disabled = true;

        xhttp = new XMLHttpRequest();
        xhttp.open('GET',adminaddress+act,true);
        xhttp.send();
        xhttp.onreadystatechange=function(){
            if (xhttp.readyState==4){
				//Принятое содержимое файла должно быть опубликовано
				console.log(xhttp.responseText);
                 //Принятое содержимое json файла должно быть вначале обработано функцией eval
				var json=eval( '('+xhttp.responseText+')' ); 

				document.getElementById('echo-ws-status').style.color = json.color;
				document.getElementById('echo-ws-status').innerHTML = json.msg;
				document.getElementById('echo-ws-status-refresh').disabled = false;
				document.getElementById('echo-ws-start').disabled = false;
				document.getElementById('echo-ws-stop').disabled = false;

			}
        }
    };


    var load_log = function() {
		document.getElementById('echo-ws-logfile-refresh').disabled = true;
        xhttplog = new XMLHttpRequest();
        xhttplog.open('GET',logfile+Math.random(),true); //Добавляем случайное число, чтобы избежать проблем с кешированием
        xhttplog.send();
        xhttplog.onreadystatechange=function(){
            if (xhttplog.readyState==4){
                //Принятое содержимое файла должно быть опубликовано
                document.getElementById('echo-ws-logfile').innerHTML = xhttplog.responseText;
				document.getElementById('echo-ws-logfile-refresh').disabled = false;
            }
        }
    };

    //////////////////////////////MAIN LOOP/////////////////////////////////////
    var loaddataloop = function () {
        loaddata('act=status');
        load_log();
        setTimeout(loaddataloop, 20000);
    };

    return {
        ////////////////////////////////////////////////////////////////////////////
        // ---- onload event ----
        load : function () {
            window.addEventListener('load', function () {
                init();
            }, false);
        }
    }
})().load();
