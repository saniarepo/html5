var App = 
{
	elements: {
				list: null,
				dropZone: null,
				place: null,
				descr: null,
				lat: null,
				lng: null,
				checkbox_radius: null,
				radius: null
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
		this.elements.checkbox_radius = document.getElementById('checkbox-radius');
		this.elements.radius = document.getElementById('radius');
		this.elements.checkbox_radius.onchange = this.handlerRadius;
		this.elements.radius.onchange = this.handlerRadius;
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
		App.loadRadius();
		App.loadCheckbox();
	},
	
	noGeoInfo: function(errorMsg){
		App.showMsg(errorMsg);
	},
	
	updateMarkers: function(){
		var center = [];
		var text = '';
		YandexMapService.deleteMarkers();
		YandexMapService.addMarker2(App.center,'Вы здесь!')
		for ( var i = 0; i < App.markers.length; i++ ){
			center = [App.markers[i].coordinates.latitude,App.markers[i].coordinates.longitude];
			text = App.markers[i].name;
			YandexMapService.addMarker(center, text);
			if ( !App.markers[i].visible || !App.markers[i].in_radius ){
				YandexMapService.hideMarker(center);
			}
		}
		App.fillList();
	},
	
	readDataFromFile: function(data){
		try{
			this.markers = JSON.parse(data);
			for ( var i = 0; i < this.markers.length; i++ ){
				this.markers[i].visible = true;
				this.markers[i].in_radius = true;
			}
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
		
		var elems = document.getElementsByClassName('hide');
		for ( var i = 0; i < elems.length; i++ ){
			elems[i].addEventListener('click', App.handlerClickHide,false);
		}
		
		var names = document.getElementsByClassName('name');
		for ( var i = 0; i < names.length; i++ ){
			names[i].addEventListener('keyup', App.handlerNameChange,false);
		}
		
	},
	
	handlerClickDelete: function(e){
		App.delMarker(parseInt(this.id.split('-').pop()));
	}, 
	
	handlerClickHide: function(e){
		if ( this.innerText == 'Скрыть' || this.textContent == 'Скрыть' ){
			this.innerText = 'Показать';
			this.textContent = 'Показать';
			App.hideMarker(parseInt(this.id.split('-').pop()));
		}else if ( this.innerText == 'Показать' || this.textContent == 'Показать'  ){
			this.innerText = 'Скрыть';
			this.textContent = 'Скрыть';
			App.showMarker(parseInt(this.id.split('-').pop()));
		}
	},
	
	handlerRadius: function(e){
		var radius = parseInt(App.elements.radius.value);
		if (App.elements.checkbox_radius.checked){
			for ( var i = 0; i < App.markers.length; i++ ){
				App.markers[i].in_radius = (App.getRast([App.markers[i].coordinates.latitude,App.markers[i].coordinates.longitude]) <= radius)? true : false;	
			}
		}else{
			for ( var i = 0; i < App.markers.length; i++ ){
				App.markers[i].in_radius = true;	
			}
		}
		App.saveMarkers();
		App.saveRadius();
		App.saveCheckbox();
		App.updateMarkers();
	},
	
	handlerNameChange: function(e){
		var id = parseInt(this.id.split('-').pop());
		var newName = this.innerHTML;
		for ( var i = 0; i < App.markers.length; i++ ){
			if ( App.markers[i].id == id ){
				App.markers[i].name = newName;
			}
		}
		App.saveMarkers();
		App.updateMarkers();
	},
	
	marker2string: function(i){
		var str = '';
		str += (i % 2 == 0)? '<li class="odd">' : '<li>'; 
		str += '<span class="id">' + App.markers[i].id + '</span>' + '<span id="name-' + App.markers[i].id + '" class="name" contenteditable="true">' + App.markers[i].name + '</span>';
		str += '<span class="coord">' + JSON.stringify([App.markers[i].coordinates.latitude,App.markers[i].coordinates.longitude]) + '</span>';
		str += '<span class="del"><img class="del-img" id="del-' + App.markers[i].id + '" title="Удалить" src="img/delete.png"/></span>';
		str += '<span class="hide" id="hide-' + App.markers[i].id + '">';
		str += ( App.markers[i].visible )? 'Скрыть' : 'Показать';
		str += '</span></li>';
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
		App.markers.push({id:id, name:App.elements.descr.value, coordinates:{latitude:lat, longitude:lng}, visible:true});
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
	
	hideMarker: function(id){
		for ( var i = 0; i < App.markers.length; i++ ){
			if ( App.markers[i].id == id ){
				var center = [App.markers[i].coordinates.latitude, App.markers[i].coordinates.longitude];
				App.markers[i].visible = false;
				YandexMapService.hideMarker(center);
			}
		}
		App.saveMarkers();
	},
	
	showMarker: function(id){
		for ( var i = 0; i < App.markers.length; i++ ){
			if ( App.markers[i].id == id ){
				var center = [App.markers[i].coordinates.latitude, App.markers[i].coordinates.longitude];
				App.markers[i].visible = true;
				YandexMapService.showMarker(center);
			}
		}
		App.saveMarkers();
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
	},
	
	saveRadius: function(){
		Storage.save('radius', App.elements.radius.value);
	},
	
	loadRadius: function(){
		App.elements.radius.value = parseInt(Storage.load('radius'));
		if ( !App.elements.radius.value ) App.elements.radius.value = 1000;
	},
	
	saveCheckbox: function(){
		Storage.save('checkbox', App.elements.checkbox_radius.checked);
	},
	
	loadCheckbox: function(){
		App.elements.checkbox_radius.checked = JSON.parse(Storage.load('checkbox'));
	},
	
	getRast: function(dot){
		/**pi - число pi, rad - радиус сферы (Земли)**/
		var rad = 6372795;

		/**координаты двух точек**/
		var llat1 = dot[0];
		var llong1 = dot[1];

		var llat2 = App.center[0];
		var llong2 = App.center[1];

		/**в радианах**/
		var lat1 = llat1*Math.PI/180;
		var lat2 = llat2*Math.PI/180;
		var long1 = llong1*Math.PI/180;
		var long2 = llong2*Math.PI/180;

		/**косинусы и синусы широт и разницы долгот**/
		var cl1 = Math.cos(lat1)
		var cl2 = Math.cos(lat2)
		var sl1 = Math.sin(lat1)
		var sl2 = Math.sin(lat2)
		var delta = long2 - long1
		var cdelta = Math.cos(delta)
		var sdelta = Math.sin(delta)

		/**вычисления длины большого круга**/
		var y = Math.sqrt(Math.pow(cl2*sdelta,2)+Math.pow(cl1*sl2-sl1*cl2*cdelta,2))
		var x = sl1*sl2+cl1*cl2*cdelta
		var ad = Math.atan2(y,x)
		var dist = ad*rad
		return dist;
	}
	
	

}