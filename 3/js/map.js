var YandexMapService =
{
	service: null,
	map: null,
	zoom: 10,
	center: [0,0],
	id: null,
	marks: [],
	
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
		this.marks.push({lat:center[0], lng:center[1], text:text});
	},
	
	deleteMarkers: function(){
		this.map.geoObjects.removeAll();
		this.marks = [];
	}
	
}

