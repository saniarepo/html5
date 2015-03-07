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
	markers: null,
	
	init: function(){
		this.elements.list = document.getElementById('list');
		this.elements.dropZone = document.getElementById('map');
		this.elements.place = document.getElementById('user-place');
		this.elements.descr = document.getElementById('descr');
		this.elements.lat = document.getElementById('lat');
		this.elements.lng = document.getElementById('lng');
		document.getElementById('add-form').onsubmit = this.addMarker;
		YandexMapService.setService(ymaps);
		YandexMapService.showMap(this.mapIdDom, this.center, this.zoom);
		var savedMarkers = this.restoreMarkers();
		if ( savedMarkers ) this.markers = JSON.parse(savedMarkers);
		var savedCenter = this.restoreCenter();
		if ( savedCenter ){
			this.center = JSON.parse(savedCenter);
		} else{
			Geo.getPosition(this.applyGeoInfo, this.noGeoInfo);
		}
		this.start();
	},
	
	applyGeoInfo: function(center){
		YandexMapService.moveMap(center, App.zoom);
		
		App.center = center;
		App.saveCenter();
	},
	
	start: function(){
		App.elements.place.innerHTML = 'Широта: ' + this.center[0] + '; Долгота: ' + this.center[1];
		YandexMapService.moveMap(this.center, this.zoom);
		if ( App.markers != null ) App.updateMarkers();
		YandexMapService.addMarker()
	},
	
	noGeoInfo: function(errorMsg){
		App.showMsg(errorMsg);
	},
	
	updateMarkers: function(){
		var center = [];
		var text = '';
		YandexMapService.deleteMarkers();
		YandexMapService.addMarker(App.center,'Вы здесь!')
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
			this.saveMarkers();
		}catch(e){
			App.showMsg("Wrong file format!");
			return;
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
		var imgs = document.getElementsByClassName('del-img');
		for ( var i = 0; i < imgs.length; i++ ){
			imgs[i].addEventListener('click', App.handlerClickDelete,false);
		}
		
		//console.log(content);
	},
	
	handlerClickDelete: function(e){
		App.delMarker(parseInt(this.id.split('-').pop()));
	}, 
	
	marker2string: function(i){
		var str = '';
		str += '<li>'; 
		str += '<span class="id">' + App.markers[i].id + '</span>' + '<span class="name">' + App.markers[i].name + '</span>';
		str += '<span class="coord">' + JSON.stringify([App.markers[i].coordinates.latitude,App.markers[i].coordinates.longitude]) + '</span>';
		str += '<span class="del"><img class="del-img" id="del-' + App.markers[i].id + '" title="Удалить" src="img/delete.png"/></span></li>';
		return str;
	},
	
	addMarker: function(e){
		e.preventDefault();
		var id = null;
		for ( var i = 0; i < App.markers.length; i++ ){
			if ( id == null ) id = App.markers[i].id;
			if ( id < App.markers[i].id ) id = App.markers[i].id;
		}
		id++;
		var lat = parseFloat(App.elements.lat.value);
		var lng = parseFloat(App.elements.lng.value);
		App.markers.push({id:id, name:App.elements.descr.value, coordinates:{latitude:lat, longitude:lng}});
		App.updateMarkers();
		App.saveMarkers();
	
	},
	
	delMarker: function(id){
		for ( var i = 0; i < this.markers.length; i++ ){
			if ( this.markers[i].id == id ){
				delete this.markers[i];
				this.markers.splice(i,1);
			} 
		}
		this.updateMarkers();
		this.saveMarkers();
	},
	
	showMsg: function(msg){
		alert(msg);
	},
	
	saveMarkers: function(){
		Storage.save('markers', JSON.stringify(this.markers));
	},
	
	restoreMarkers: function(){
		return Storage.load('markers');
	},
	
	saveCenter: function(){
		Storage.save('center', JSON.stringify(this.center));
	},
	
	restoreCenter: function(){
		return Storage.load('center');
	}
	
	

}