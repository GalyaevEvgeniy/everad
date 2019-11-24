NodeList.prototype.onEvent = function(multiType, callback){
	for(var i = 0, elem; elem = this[i++];){
		onEvent(elem, multiType, callback);
	}
	return this;
};

function onEvent(elem, multiType, callback){
	multiType.split(" ").forEach(function(type){
		if(elem.addEventListener){
			elem.addEventListener(type, callback, false);
		} else if(elem.attachEvent){
			elem.attachEvent("on" + type, callback);
		} else{
			elem["on" + type] = callback;
		}
	});
	return elem;
}