"use strict"; //All my JavaScript written in Strict Mode http://ecma262-5.com/ELS5_HTML.htm#Annex_C

(function () {
    // ======== private vars ========
	var socket;
	var xhttp;
	var srvaddress = 'http://yourdomain.com/';
	var startserveraddress = srvaddress+'echowsstart.php';

    ////////////////////////////////////////////////////////////////////////////
    var init = function () {

		wsserverrun();
		
		socket = new WebSocket(document.getElementById("sock-addr").value);

		socket.onopen = connectionOpen; 
		socket.onmessage = messageReceived; 
		//socket.onerror = errorOccurred; 
		//socket.onopen = connectionClosed;

        document.getElementById("sock-send-butt").onclick = function () {
            socket.send(document.getElementById("sock-msg").value);
        };


        document.getElementById("sock-disc-butt").onclick = function () {
            connectionClose();
        };

        document.getElementById("sock-recon-butt").onclick = function () {
			wsserverrun();

			socket = new WebSocket(document.getElementById("sock-addr").value);
            socket.onopen = connectionOpen;
            socket.onmessage = messageReceived;
        };

    };


	function connectionOpen() {
	   socket.send("Connection with \""+document.getElementById("sock-addr").value+"\" Подключение установлено обоюдно, отлично!");
	}

	function messageReceived(e) {
	    console.log("Ответ сервера: " + e.data);
        document.getElementById("sock-info").innerHTML += (e.data+"<br />");
	}

    function connectionClose() {
        socket.close();
        document.getElementById("sock-info").innerHTML += "Соединение закрыто <br />";

    }

    var wsserverrun = function() {

        xhttp = new XMLHttpRequest();
        xhttp.open('GET',startserveraddress,true);
        xhttp.send();
        xhttp.onreadystatechange=function(){
            if (xhttp.readyState==4){
				//Принятое содержимое файла должно быть опубликовано
				console.log(xhttp.responseText);
                 //Принятое содержимое json файла должно быть вначале обработано функцией eval
				var json=eval( '('+xhttp.responseText+')' ); 

				if (json.run == 1) return;
				else if (json.run == 1){sleep(500); return;}
			}
        }
    };

	function sleep(ms) {
		ms += new Date().getTime();
		while (new Date().getTime() < ms){}
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