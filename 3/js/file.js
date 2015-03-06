var File = 
{
	app: null,
	dropZone: null,
	bind: function(app){
		this.app = app;
		this.dropZone = app.elements.dropZone;
		this.dropZone.addEventListener('drop', this.handlerDrop, false);
		this.dropZone.addEventListener('dragover', this.handleDragOver,false);
	}, 
	
	/**обработчик бросания файла в область для чтения**/
	handlerDrop: function (evt){
		evt.stopPropagation();
		evt.preventDefault();
		var files = evt.dataTransfer.files;
		var output = [];
		var f = files[0];
		var reader = new FileReader();
		reader.onload = function(e){
			File.app.readDataFromFile(e.target.result);	
		};
		reader.readAsText(f);
	},
	
	handleDragOver: function (evt){
		evt.stopPropagation();
		evt.preventDefault();
		evt.dataTransfer.dropEffect = 'copy';
	}
	
	
};