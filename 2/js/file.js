window.onload = function(){
	
	var list = document.getElementById('list');
	var dropZone = document.getElementById('drop_zone');
	var dropZone2 = document.getElementById('drop_zone2');
	var clear_btn = document.getElementById('clear-data');
	
	list.innerHTML = (loadFromLocalStorage('list'))? loadFromLocalStorage('list') : '';
	
	/**���������� ������ ������**/
	function handlerFileSelect(evt){
		var files = evt.target.files;
		var output = [];
		for(var i=0, f; f=files[i]; i++){
			output.push('<li>',escape(f.name),f.type || 'n/a',f.size, (f.lastModifiedDate)? f.lastModifiedDate.toLocaleString():'n/a','</li>');
		}
		document.getElementById('list').innerHTML = '<ul>' + output.join(':') + '</ul>';
	}
	
	document.getElementById('files').addEventListener('change', handlerFileSelect,false);
	
	/**���������� �������� �����**/
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
	
	/**���������� �������� ����� � ������� ��� ������**/
	function handlerFileSelectDropRead(evt){
		evt.stopPropagation();
		evt.preventDefault();
		var files = evt.dataTransfer.files;
		var output = [];
		var f = files[0];
		var reader = new FileReader();
		reader.onload = function(e){
			
			list.innerHTML = '<p>' + e.target.result + '</p>';
			saveToLocalStorage('list',e.target.result);
			
		};
		reader.readAsText(f);
	}
	
	
	
	function handleDragOver(evt){
		evt.stopPropagation();
		evt.preventDefault();
		evt.dataTransfer.dropEffect = 'copy';
	}
	
	/**�������� ������������**/
	
	dropZone.addEventListener('dragover', handleDragOver,false);
	dropZone.addEventListener('drop', handlerFileSelectDrop,false);
	dropZone2.addEventListener('dragover', handleDragOver,false);
	dropZone2.addEventListener('drop', handlerFileSelectDropRead,false);
	clear_btn.addEventListener('click', clear,false);
	
	/**���������� � ��������� ���������**/
	function saveToLocalStorage(key,value){
		if ( typeof(localStorage) != 'undefined'){
			localStorage.setItem(key,value);
		}
	}
	
	/**������ �� ���������� ���������**/
	function loadFromLocalStorage(key){
		if ( typeof(localStorage) != 'undefined'){
			return localStorage.getItem(key);
		}
	}
	
	/**������� ���������� ���������**/
	function clearLocalStorage(){
		if ( typeof(localStorage) != 'undefined'){
			localStorage.clear();
		}
	}
	
	
	function clear(){
		clearLocalStorage();
		list.innerHTML = '';
	}
	
};