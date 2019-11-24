"use strict";

(function () {
  if (!NodeList.prototype.forEach) {
    NodeList.prototype.forEach = function (callback, thisArg) {
      var T, k;

      if (this == null) {
        throw new TypeError(' this is null or not defined');
      }

      var O = Object(this);
      var len = O.length >>> 0;

      if (typeof callback !== 'function') {
        throw new TypeError(callback + ' is not a function');
      }

      if (arguments.length > 1) {
        T = thisArg;
      }

      k = 0;

      while (k < len) {
        var kValue;

        if (k in O) {
          kValue = O[k];
          callback.call(T, kValue, k, O);
        }

        k++;
      }
    };
  }
})();

(function () {
  // helpers
  var regExp = function regExp(name) {
    return new RegExp('(^| )' + name + '( |$)');
  };

  var forEach = function forEach(list, fn, scope) {
    for (var i = 0; i < list.length; i++) {
      fn.call(scope, list[i]);
    }
  }; // class list object with basic methods


  function ClassList(element) {
    this.element = element;
  }

  ClassList.prototype = {
    add: function add() {
      forEach(arguments, function (name) {
        if (!this.contains(name)) {
          this.element.className += ' ' + name;
        }
      }, this);
    },
    remove: function remove() {
      forEach(arguments, function (name) {
        this.element.className = this.element.className.replace(regExp(name), '');
      }, this);
    },
    toggle: function toggle(name) {
      return this.contains(name) ? (this.remove(name), false) : (this.add(name), true);
    },
    contains: function contains(name) {
      return regExp(name).test(this.element.className);
    },
    // bonus..
    replace: function replace(oldName, newName) {
      this.remove(oldName), this.add(newName);
    }
  }; // IE8/9, Safari

  if (!('classList' in Element.prototype)) {
    Object.defineProperty(Element.prototype, 'classList', {
      get: function get() {
        return new ClassList(this);
      }
    });
  } // replace() support for others


  if (window.DOMTokenList && DOMTokenList.prototype.replace == null) {
    DOMTokenList.prototype.replace = ClassList.prototype.replace;
  }
})();
"use strict";

NodeList.prototype.onEvent = function (multiType, callback) {
  for (var i = 0, elem; elem = this[i++];) {
    onEvent(elem, multiType, callback);
  }

  return this;
};

function onEvent(elem, multiType, callback) {
  multiType.split(" ").forEach(function (type) {
    if (elem.addEventListener) {
      elem.addEventListener(type, callback, false);
    } else if (elem.attachEvent) {
      elem.attachEvent("on" + type, callback);
    } else {
      elem["on" + type] = callback;
    }
  });
  return elem;
}
"use strict";

(function () {
  var phoneInput = document.querySelectorAll(".form input[name=\"phone\"]"),
      nameInput = document.querySelectorAll(".form input[name=\"name\"]"); // Валидация ввода в инпут телефона

  phoneInput.onEvent("input paste change", function (event) {
    var target = event.target;
    var value = target.value;
    var regexp = /[^0-9]/g;

    if (value.match(regexp)) {
      target.value = value.replace(regexp, "");
      target.style.backgroundColor = "rgba(255, 0, 0, .75)";
      setTimeout(function () {
        target.setAttribute("style", "");
      }, 150);
    }
  }); // Валидация ввода в инпут имени

  nameInput.onEvent("input paste change", function (event) {
    var target = event.target;
    var value = target.value;
    var regexp = /[^A-Za-zЁёА-Яа-я ]/g;

    if (value.match(regexp)) {
      target.value = value.replace(regexp, "");
      target.style.backgroundColor = "rgba(255, 0, 0, .75)";
      setTimeout(function () {
        target.setAttribute("style", "");
      }, 150);
    }
  }); // Отправка формы

  document.querySelectorAll(".form form").onEvent("submit", function (event) {
    event.preventDefault();
    event.stopPropagation();
    alert("Ваша заявка отправленна\n\nВ ближайшее время с вами свяжутся наши специалисты");
    var data = new FormData(),
        xhr = new XMLHttpRequest();
    data.append("phone", phoneInput.value);
    data.append("name", nameInput.value);
    xhr.open("POST", "./some_url");
    xhr.send(data);

    xhr.onreadystatechange = function () {
      if (xhr.readyState !== XMLHttpRequest.DONE) {
        return;
      }

      phoneInput.value = "";
      nameInput.value = ""; //=====================
      // Фиксируем ошибку

      if (xhr.status === 200) {
        alert("Ваша заявка отправленна\n\nВ ближайшее время с вами свяжутся наши специалисты");
      } else {
        console.error("Ошибка с сервера при отправке формы");
        console.error(xhr.response);
      }
    };
  });
})();