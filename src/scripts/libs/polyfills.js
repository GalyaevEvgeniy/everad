(function(){
	if(!NodeList.prototype.forEach){
		NodeList.prototype.forEach = function(callback, thisArg){

			var T, k;

			if(this == null){
				throw new TypeError(' this is null or not defined');
			}

			var O = Object(this);

			var len = O.length >>> 0;

			if(typeof callback !== 'function'){
				throw new TypeError(callback + ' is not a function');
			}

			if(arguments.length > 1){
				T = thisArg;
			}

			k = 0;

			while(k < len){

				var kValue;

				if(k in O){
					kValue = O[k];
					callback.call(T, kValue, k, O);
				}
				k++;
			}
		};
	}
})();

(function(){
	// helpers
	var regExp = function(name){
		return new RegExp('(^| )' + name + '( |$)');
	};
	var forEach = function(list, fn, scope){
		for(var i = 0; i < list.length; i++){
			fn.call(scope, list[i]);
		}
	};

	// class list object with basic methods
	function ClassList(element){
		this.element = element;
	}

	ClassList.prototype = {
		add: function(){
			forEach(arguments, function(name){
				if(!this.contains(name)){
					this.element.className += ' ' + name;
				}
			}, this);
		},
		remove: function(){
			forEach(arguments, function(name){
				this.element.className =
					this.element.className.replace(regExp(name), '');
			}, this);
		},
		toggle: function(name){
			return this.contains(name)
				? (this.remove(name), false) : (this.add(name), true);
		},
		contains: function(name){
			return regExp(name).test(this.element.className);
		},
		// bonus..
		replace: function(oldName, newName){
			this.remove(oldName), this.add(newName);
		}
	};

	// IE8/9, Safari
	if(!('classList' in Element.prototype)){
		Object.defineProperty(Element.prototype, 'classList', {
			get: function(){
				return new ClassList(this);
			}
		});
	}

	// replace() support for others
	if(window.DOMTokenList && DOMTokenList.prototype.replace == null){
		DOMTokenList.prototype.replace = ClassList.prototype.replace;
	}
})();