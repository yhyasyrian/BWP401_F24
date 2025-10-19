function appendAlert(type, message) {
	let alert = "";
	switch (type) {
		case "success":
			alert = `<div class="alert alert-success" role="alert">${message}</div>`;
			break;
		case "error":
			alert = `<div class="alert alert-danger" role="alert">${message}</div>`;
			break;
		default:
			alert = `<div class="alert alert-warning" role="alert">${message}</div>`;
			break;
	}
	document.getElementById("alerts").innerHTML = alert;
	setTimeout(() => {
		let opacity = 100;
		let interval = setInterval(() => {
			document.getElementById("alerts").childNodes[0].style.opacity = `${opacity}%`;
			document.getElementById("alerts").childNodes[0].style.transform = `translateY(-${50 - opacity}px)`;
			opacity -= 5;
			if (opacity <= 0) {
				clearInterval(interval);
				document.getElementById("alerts").childNodes[0].remove();
			}
		}, 30);
	}, 1000);
}
document.addEventListener("DOMContentLoaded", function () {
	const filterCategories = document.querySelector(".filter-categories");
	// For run logic only in document have this section
	if (filterCategories) {
		const buttons = filterCategories.querySelectorAll(".btn[data-type]");
		function filterCategoriesLogic() {
			const currentType = filterCategories.getAttribute("data-current-type");
			const categories = filterCategories.querySelectorAll(".row > [data-type]");
			const filterQuery = filterCategories.getAttribute("data-filter-query") || "";
			const filterDate = filterCategories.getAttribute("data-filter-date") || "";
			const filterCity = filterCategories.getAttribute("data-filter-city") || "";
			categories.forEach((category) => {
				if (
					(filterQuery.length > 0 && category.querySelector("h5").textContent.toLowerCase().includes(filterQuery.toLowerCase())) ||
					(filterDate.length > 0 && category.querySelector("time").getAttribute("datetime").includes(filterDate)) ||
					(filterCity.length > 0 && category.querySelector(".location").textContent.toLowerCase().includes(filterCity.toLowerCase())) ||
					category.getAttribute("data-type") === currentType ||
					currentType === "all"
				) {
					category.style.display = "block";
				} else {
					category.style.display = "none";
				}
			});
			buttons.forEach((el) => {
				if (el.getAttribute("data-type") === currentType) {
					el.classList.add("btn-primary");
					el.classList.remove("btn-outline-primary");
				} else {
					el.classList.remove("btn-primary");
					el.classList.add("btn-outline-primary");
				}
			});
		}
		// for run logic when load page, why? for if i need to change default ;)
		buttons.forEach((el) =>
			el.addEventListener("click", () => {
				if (el.getAttribute("data-type") === "custom") return;
				filterCategories.setAttribute("data-current-type", el.getAttribute("data-type"));
				filterCategories.setAttribute("data-filter-query", "");
				filterCategories.setAttribute("data-filter-date", "");
				filterCategoriesLogic();
			})
		);
		const filterCustom = document.querySelector("#filter-custom-submit");
		if (filterCustom) {
			filterCustom.addEventListener("click", () => {
				const query = document.querySelector("#query").value;
				const date = document.querySelector("#date").value;
				const city = document.querySelector("#filter-city").value;
				filterCategories.setAttribute("data-filter-query", query);
				filterCategories.setAttribute("data-filter-date", date);
				filterCategories.setAttribute("data-filter-city", city);
				console.log(city)
				if (query.length > 0 || date.length > 0 || (city.length > 0 && !["بدون", "without"].includes(city))) {
					filterCategories.setAttribute("data-current-type", "custom");
				} else {
					filterCategories.setAttribute("data-current-type", "all");
				}
				filterCategoriesLogic();
			});
		}
		filterCategoriesLogic();
	}
	const translations = {
		"ar":{
			"fill-all-fields":"الرجاء تعبئة كامل الحقول",
			"invalid-email":"البريد الإلكتروني غير صالح",
			"done-send-event":"تم تقديم الفعالية بنجاح",
			"done-send-message":"تم إرسال الرسالة بنجاح",
		},
		"en":{
			"fill-all-fields":"Please fill in all fields",
			"invalid-email":"Invalid email",
			"done-send-event":"Event submitted successfully",
			"done-send-message":"Message sent successfully",
		}
	};
	const currentLang = window.localStorage.getItem("language") || "ar";
	// in event page
	const suggestEvent = document.getElementById("suggest-event");
	if (suggestEvent) {
		const submit = document.getElementById("suggest-event-submit");
		submit.addEventListener("click", () => {
			const name = document.getElementById("name").value;
			const email = document.getElementById("email").value;
			const event = document.getElementById("event").value;
			const description = document.getElementById("description").value;
			const city = document.getElementById("suggest-city").value;
			if (name.length === 0 || email.length === 0 || event.length === 0 || description.length === 0 || city.length === 0) {
				if (name.length === 0) {
					document.getElementById("name").classList.add("is-invalid");
				}
				if (email.length === 0) {
					document.getElementById("email").classList.add("is-invalid");
				}
				if (event.length === 0) {
					document.getElementById("event").classList.add("is-invalid");
				}
				if (description.length === 0) {
					document.getElementById("description").classList.add("is-invalid");
				}
				if (city.length === 0) {
					document.getElementById("suggest-city").classList.add("is-invalid");
				}
				appendAlert("error", translations[currentLang]["fill-all-fields"]);
				return;
			}
			if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
				appendAlert("error", translations[currentLang]["invalid-email"]);
				return;
			}
			suggestEvent.querySelectorAll("input, textarea").forEach((el) => {
				el.value = "";
				el.classList.remove("is-invalid");
			});
			appendAlert("success", translations[currentLang]["done-send-event"]);
		});
	}
	// in about page
	const contactForm = document.getElementById("contact");
	if (contactForm) {
		const submit = document.getElementById("contact-submit");
		submit.addEventListener("click", () => {
			const name = document.getElementById("name").value;
			const email = document.getElementById("email").value;
			const subject = document.getElementById("subject").value;
			const message = document.getElementById("message").value;
			if (name.length === 0 || email.length === 0 || subject.length === 0 || message.length === 0) {
				if (name.length === 0) {
					document.getElementById("name").classList.add("is-invalid");
				}
				if (email.length === 0) {
					document.getElementById("email").classList.add("is-invalid");
				}
				if (subject.length === 0) {
					document.getElementById("subject").classList.add("is-invalid");
				}
				if (message.length === 0) {
					document.getElementById("message").classList.add("is-invalid");
				}
				appendAlert("error", translations[currentLang]["fill-all-fields"]);
				return;
			}
			if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
				appendAlert("error", translations[currentLang]["invalid-email"]);
				return;
			}
			contactForm.querySelectorAll("input, textarea").forEach((el) => {
				el.value = "";
				el.classList.remove("is-invalid");
			});
			appendAlert("success", translations[currentLang]["done-send-message"]);
		});
	}
	
	// button to scroll to top
	const scrollToTopBtn = document.getElementById('scroll-to-top');
	if (scrollToTopBtn) {
		window.addEventListener('scroll', function() {
			if (window.pageYOffset > 20) {
				scrollToTopBtn.style.display = 'flex';
			} else {
				scrollToTopBtn.style.display = 'none';
			}
		});
		
		scrollToTopBtn.addEventListener('click', function() {
			window.scrollTo({
				top: 0,
				behavior: 'smooth'
			});
		});
	}
});
