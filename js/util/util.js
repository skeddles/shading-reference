const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

function degreesToRadians(degrees) {
  	var pi = Math.PI;
  	return degrees * (pi / 180);
}

// https://gist.github.com/ahtcx/0cd94e62691f539160b32ecda18af3d6
function deepMergeObjects(target, source) {
	// Iterate through `source` properties and if an `Object` set property to merge of `target` and `source` properties
	for (const key of Object.keys(source)) {
		if (source[key] instanceof Object)
			Object.assign(source[key], deepMergeObjects(target[key], source[key]));
	}

	// Join `target` and modified `source`
	Object.assign(target || {}, source);
	return target;
}
