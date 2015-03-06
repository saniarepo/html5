var Geo = 
{
	options: {enableHighAccuracy:true, timeout: 5000, maximumAge: 0},
	success: null,
	error: null,
	getPosition: function(success, error){
		this.success = success;
		this.error = error;
		navigator.geolocation.getCurrentPosition(this.locationSuccess, this.locationError, this.options);
	},
	
	locationSuccess: function (position){
		Geo.success([position.coords.latitude, position.coords.longitude]);	
	},
	
	locationError: function (error){
		var errTypes = {
							1: 'Доступ запрещен',
							2: 'Координаты недоступны',
							3: 'Время ожидания истекло'
						};
		Geo.error('Невозможно определить метоположение: ' + errTypes[error.code]);
	}
}
