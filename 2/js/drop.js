window.onload = function(){
	var drop = document.getElementById('drop');
	drop.ondrop = function(event){
		var event = event || window.event;
		this.innerHTML += '<img src="'+event.dataTransfer.getData('Text')+'"/>';
		event.cancelBubble = true;
		return false;
	};
	
	drop.ondragover = function(event){
		return false;
	};
	
	drop.ondragenter = function(event){
		return false;
	}
	
	var imgs = document.getElementsByTagName('img');
	var i = imgs.length;
	while(i--){
		imgs[i].ondragstart = function(event){
			var event = event || window.event;
			event.dataTransfer.setData('Text', this.src);
		};
	}
};