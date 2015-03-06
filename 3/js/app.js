var App = 
{
	elements: {
				list: null,
				dropZone: null,
				place: null,
				descr: null,
				lat:null,
				lng:null
	},
	
	mapIdDom: 'map',
	center: [55.76, 37.64],
	zoom: 10,
	storageKey: 'myapp',
	markers: null,
	
	init: function(){
		this.elements.list = document.getElementById('list');
		this.elements.dropZone = document.getElementById('drop_zone');
		this.elements.place = document.getElementById('user-place');
		this.elements.descr = document.getElementById('descr');
		this.elements.lat = document.getElementById('lat');
		this.elements.lng = document.getElementById('lng');
		document.getElementById('add-form').onsubmit = this.addMarker;
		YandexMapService.setService(ymaps);
		YandexMapService.showMap(this.mapIdDom, this.center, this.zoom);
		var savedData = Storage.load(this.storageKey);
		if ( savedData ) this.markers = JSON.parse(savedData);
		Geo.getPosition(this.applyGeoInfo, this.noGeoInfo);
	},
	
	applyGeoInfo: function(center){
		YandexMapService.moveMap(center, App.zoom);
		App.elements.place.innerHTML = 'Широта: ' + center[0] + '; Долгота: ' + center[1];
		if ( App.markers != null ) App.updateMarkers();
	},
	
	noGeoInfo: function(errorMsg){
		App.elements.place.innerHTML = 'Неопределено';
		alert(errorMsg);
	},
	
	updateMarkers: function(){
		var center = [];
		var text = '';
		YandexMapService.deleteMarkers();
		for ( var i = 0; i < this.markers.length; i++ ){
			center = [this.markers[i].coordinates.latitude,this.markers[i].coordinates.longitude];
			text = this.markers[i].name;
			YandexMapService.addMarker(center, text);
		}
		App.fillList();
	},
	
	readDataFromFile: function(data){
		try{
			this.markers = JSON.parse(data);
			Storage.save(this.storageKey, JSON.stringify(this.markers));
			
		}catch(e){
			alert("Wrong file format!");
		}
		this.updateMarkers();
		
	},
	
	fillList: function(){
		var content = '<ul>';
		for( var i = 0; i < App.markers.length; i++ ){
			content += App.marker2string(i);
		}
		content += '</ul>';
		App.elements.list.innerHTML = content;
	},
	
	marker2string: function(i){
		var str = '';
		str += '<li>'; 
		str += App.markers[i].id + '<span>' + App.markers[i].name + '</span>';
		str += '<span>' + JSON.stringify([App.markers[i].coordinates.latitude,App.markers[i].coordinates.longitude]) + '</span>';
		str += '</li>';
		return str;
	},
	
	addMarker: function(e){
		e.preventDefault();
		var id = null;
		for ( var i = 0; i < App.markers[i]; i++ ){
			if ( id == null ) id = App.markers[i].id;
			console.log(App.markers[i].id);
			if ( id < App.markers[i].id ) id = App.markers[i].id;
		}
		id++;
		var lat = parseFloat(App.elements.lat.value);
		var lng = parseFloat(App.elements.lng.value);
		App.markers.push({id:id, name:App.elements.descr.value, coordinates:{latitude:lat, longitude:lng}});
		App.updateMarkers();
	
	}
	
	
	
	
	

}