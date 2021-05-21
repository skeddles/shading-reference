const THUMBNAILMODE = true;

//!=include lib/three.js 
//!=include lib/dat.gui.js
//=include util/util.js

//=include _data.js
//=include _gui.js
//=include _newToonMaterial.js
//=include _viewer.js

//=include _loadExampleFromURL.js


 
const PRESETS = 
//=include ../examples.json 

//start render loop
function animate() {
	renderer.render(scene, display.selectedCamera);
	requestAnimationFrame(animate);
}
animate();



//load the gui (then hide it by default)
initGui();
$('#gui').style.display = 'none';



//attempt to load the data from the url
loadExampleFromURL();



/*global THREE*/ 