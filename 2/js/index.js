window.onload = function(){
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
			map.geoObjects.add(myPlacemark);
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

	
	
}

