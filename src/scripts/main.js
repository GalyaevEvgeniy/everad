(function(){
	const phoneInput = document.querySelectorAll(".form input[name=\"phone\"]"),
		nameInput = document.querySelectorAll(".form input[name=\"name\"]");

	// Валидация ввода в инпут телефона
	phoneInput.onEvent("input paste change", (event) => {
		const target = event.target;
		const value = target.value;
		const regexp = /[^0-9]/g;

		if(value.match(regexp)){
			target.value = value.replace(regexp, "");
			target.style.backgroundColor = "rgba(255, 0, 0, .75)";
			setTimeout(() => {
				target.setAttribute("style", "");
			}, 150);
		}
	});

	// Валидация ввода в инпут имени
	nameInput.onEvent("input paste change", (event) => {
		const target = event.target;

		const value = target.value;
		const regexp = /[^A-Za-zЁёА-Яа-я ]/g;

		if(value.match(regexp)){
			target.value = value.replace(regexp, "");
			target.style.backgroundColor = "rgba(255, 0, 0, .75)";
			setTimeout(() => {
				target.setAttribute("style", "");
			}, 150);
		}
	});

	// Отправка формы
	document.querySelectorAll(".form form").onEvent("submit", (event) => {
		event.preventDefault();
		event.stopPropagation();

		alert("Ваша заявка отправленна\n\nВ ближайшее время с вами свяжутся наши специалисты");

		let data = new FormData(),
			xhr = new XMLHttpRequest();

		data.append("phone", phoneInput.value);
		data.append("name", nameInput.value);

		xhr.open("POST", "./some_url");
		xhr.send(data);

		xhr.onreadystatechange = () => {
			if(xhr.readyState !== XMLHttpRequest.DONE){
				return;
			}

			phoneInput.value = "";
			nameInput.value = "";

			//=====================
			// Фиксируем ошибку
			if(xhr.status === 200){
				alert("Ваша заявка отправленна\n\nВ ближайшее время с вами свяжутся наши специалисты");
			} else{
				console.error("Ошибка с сервера при отправке формы");
				console.error(xhr.response);
			}
		};
	});
}());