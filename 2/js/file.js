window.onload = function(){
	function handlerFileSelect(evt){
		var files = evt.target.files;
		var output = [];
		for(var i=0, f; f=files[i]; i++){
			output.push('<li>',escape(f.name),f.type || 'n/a',f.size, (f.lastModifiedDate)? f.lastModifiedDate.toLocaleString():'n/a','</li>');
		}
		document.getElementById('list').innerHTML = '<ul>' + output.join(':') + '</ul>';
	}
	
	document.getElementById('files').addEventListener('change', handlerFileSelect,false);
	
	
	function handlerFileSelectDrop(evt){
		evt.stopPropagation();
		evt.preventDefault();
		var files = evt.dataTransfer.files;
		var output = [];
		for(var i=0, f; f=files[i]; i++){
			output.push('<li>',escape(f.name),f.type || 'n/a',f.size, (f.lastModifiedDate)? f.lastModifiedDate.toLocaleString():'n/a','</li>');
		}
		document.getElementById('list').innerHTML = '<ul>' + output.join(':') + '</ul>';
	}
	
	function handlerFileSelectDropRead(evt){
		evt.stopPropagation();
		evt.preventDefault();
		var files = evt.dataTransfer.files;
		var output = [];
		var f = files[0];
		var reader = new FileReader();
		reader.onload = function(e){
			
			document.getElementById('list').innerHTML = '<p>' + e.target.result + '</p>';
		};
		reader.readAsText(f);
	}
	
	function handleDragOver(evt){
		evt.stopPropagation();
		evt.preventDefault();
		evt.dataTransfer.dropEffect = 'copy';
	}
	
	var dropZone = document.getElementById('drop_zone');
	var dropZone2 = document.getElementById('drop_zone2');
	dropZone.addEventListener('dragover', handleDragOver,false);
	dropZone.addEventListener('drop', handlerFileSelectDrop,false);
	dropZone2.addEventListener('dragover', handleDragOver,false);
	dropZone2.addEventListener('drop', handlerFileSelectDropRead,false);
	
};