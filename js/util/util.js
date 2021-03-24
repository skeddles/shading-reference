const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

function degrees_to_radians(degrees) {
  	var pi = Math.PI;
  	return degrees * (pi / 180);
}