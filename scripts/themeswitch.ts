const ts = document.getElementById("themeswitch");

if (localStorage.getItem("lightTheme") === "on") {
	document.body.classList.add("lighttheme");
}

ts.addEventListener("click", () => {
	if (localStorage.getItem("lightTheme") !== "on") {
		document.body.classList.add("lighttheme");
		localStorage.setItem("lightTheme", "on");
	} else {
		document.body.classList.remove("lighttheme");
		localStorage.setItem("lightTheme", "null");
	}
});

