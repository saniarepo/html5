window.onload = function(){
	
	document.getElementById('start_btn').onclick = findSimple2;
	document.getElementById('stop_btn').onclick = findStop;
	var simple = document.getElementById('simple');
	
	var map;
    var center =  [55.76, 37.64];  
    var zoom = 10;
	ymaps.ready(function(){
        map = showMap(center,zoom);
		getPosition();
    });
	
	function showMap(center,zoom){
		map = new ymaps.Map("map", {
			center: center,
			zoom: zoom
		});
		return map;
	}

	function resetMap(center,zoom){
		map.setCenter(center,zoom);
	}

	function addMarker(center){
		var myPlacemark = new ymaps.Placemark(center);
			console.log(map.geoObjects);
			map.geoObjects.add(myPlacemark);
			console.log(myPlacemark);
	}

	function getPosition(){
		var locationParams = {enableHighAccuracy:true, timeout: 5000, maximumAge: 0};
		navigator.geolocation.getCurrentPosition(locationSuccess, locationError, locationParams);
	}

	function locationSuccess(position){
		console.log(position);
		center = [position.coords.latitude, position.coords.longitude]
		console.log(center);
		resetMap(center,zoom);
		addMarker(center);
	}

	function locationError(error){
		var errTypes = {
							1: 'Доступ запрещен',
							2: 'Координаты недоступны',
							3: 'Время ожидания истекло'
						};
		alert('Невозможно определить метоположение: ' + errTypes[error.code]);
		resetMap(center,zoom);
		addMarker(center);
	} 

	function findSimple(){
		var n = 1;
		search: while(true){
			n += 1;
			for( var i = 2; i < Math.sqrt(n); i++ )
				if( n % i == 0 )
					continue search;
			simple.innerHTML = ' ' + n;
			
		}
	}
	
	
	/**работа с Worker**/
	
	var worker; 
	
	function findSimple2(){
		worker = new Worker('js/simple.js');
		worker.onmessage = function(e){
			simple.value = e.data;
		};
		
		
		worker.postMessage();
	}
	
	function findStop(){
		worker.terminate();
	}	
		
	
}




