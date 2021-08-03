const THUMBNAILMODE = false;
//!=include lib/three.js 
//!=include lib/dat.gui.js
//=include util/util.js

//=include _data.js
//=include _gui.js
//=include _newToonMaterial.js
//=include _viewer.js
//=include _popup.js
//=include _feedback.js
//=include _loadExampleFromURL.js

const PRESETS = 
//=include ../examples.json
//=include _examples.js

//render
function animate() {
	renderer.render(scene, display.selectedCamera);
	requestAnimationFrame(animate);
}
animate();

initGui();


//attempt to load the data from the url
loadExampleFromURL();


/*global THREE, dat*/