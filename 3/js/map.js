var YandexMapService =
{
	service: null,
	map: null,
	zoom: 10,
	center: [0,0],
	id: null,
	markers: [],
	
	setService: function(service){
		this.service = service;
	},
	
	showMap: function(id, center, zoom){
		this.id = (id != undefined)? id:this.id;
		this.center = (center != undefined)? center:this.center;
		this.zoom = (zoom != undefined)? zoom: this.zoom;
		this.map = new this.service.Map(this.id, {center:this.center, zoom:this.zoom});
	},
	
	moveMap: function(center, zoom){
		this.map.setCenter(center,zoom);
	},
	
	addMarker: function(center, text){
		var properties = {iconContent:text, hint:text}
		var options = {draggable:false, preset: 'islands#blackStretchyIcon'};
		var myPlacemark = new ymaps.Placemark(center, properties, options);
		this.map.geoObjects.add(myPlacemark);
		this.markers.push({lat:center[0], lng:center[1], text:text, object: myPlacemark});
	},
	
	addMarker2: function(center, text){
		var properties = {iconContent:text, hint:text}
		var options = {draggable:false, preset: 'islands#icon', iconColor: '#a5260a'};
		var myPlacemark = new ymaps.Placemark(center, properties, options);
		this.map.geoObjects.add(myPlacemark);
		this.markers.push({lat:center[0], lng:center[1], text:text, object: myPlacemark});
	},
	
	deleteMarkers: function(){
		this.map.geoObjects.removeAll();
		this.markers = [];
	},
	
	hideMarker: function(center){
		for ( var i = 0; i < this.markers.length; i++ ){
			if ( this.markers[i].lat == center[0] && this.markers[i].lng == center[1] ){
				
				this.markers[i].object.options.set('visible', false);
			}
		}
	},
	
	showMarker: function(center){
		for ( var i = 0; i < this.markers.length; i++ ){
			if ( this.markers[i].lat == center[0] && this.markers[i].lng == center[1] ){
				this.markers[i].object.options.set('visible', true);
				
			}
		}
	}
	
}

