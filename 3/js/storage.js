var Storage =
{
	/**сохранение в локальном хранилище**/
	save: function(key,value){
		if ( typeof(localStorage) != 'undefined'){
			localStorage.setItem(key,value);
		}
	},
	
	/**чтение из локального хранилища**/
	load: function (key){
		if ( typeof(localStorage) != 'undefined'){
			return localStorage.getItem(key);
		}
		return null; 
	},
	
	/**очистка локального хранилища**/
	 clear: function(){
		if ( typeof(localStorage) != 'undefined'){
			localStorage.clear();
		}
	}

}