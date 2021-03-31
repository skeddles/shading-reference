const THUMBNAILMODE = true;

//!=include lib/three.js 
//!=include lib/dat.gui.js
//=include util/util.js

//=include _data.js
//=include _gui.js
//=include _newToonMaterial.js
//=include _viewer.js
//=include _popup.js


//render
function animate() {
	renderer.render(scene, display.selectedCamera);
	requestAnimationFrame(animate);
}
animate();



initGui();
$('#gui').style.display = 'none';

//load data from url
const urlParams = new URLSearchParams(window.location.search);
	console.log('all',urlParams.entries());

//loop through url parameters and apply them to the object
nextEntry: 
for(var pair of urlParams.entries()) {
	let key = pair[0];
	let value = pair[1];
		console.log(key+ ', '+ value);

	//split the value into an array of sub objects that we need to loop through
	let splitValue = key.split('.');
		console.log('key',splitValue);

	//attempt to get the correct gui object child reference
	let guiObj = gui;

	do {
		let currentLevel = splitValue.shift(); //separates the first value of the array
		
		if (guiObj.hasOwnProperty(currentLevel)) {
			//go to the next sublevel of the gui object
			guiObj = guiObj[currentLevel];
			console.log('gui',currentLevel)
		} else {
			console.error('The preset key "'+key+'" is invalid.');
			continue nextEntry;
		}
	} while(splitValue.length>0);

	//format value
	if (key.split('.').pop() == 'color') value = '#'+value;

	//success - set the value on the guiObject
	guiObj.setValue(value);
}

/*global THREE*/ 