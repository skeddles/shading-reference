const THUMBNAILMODE = true;

//!=include lib/three.js 
//!=include lib/dat.gui.js
//=include util/util.js

//=include _data.js
//=include _gui.js
//=include _newToonMaterial.js
//=include _viewer.js


var stats = new Stats(false);
$('#stats').appendChild(stats.domElement);


const dataaa = new URLSearchParams(window.location.search);
var zoom = dataaa.get('multiplier');
zoom = parseInt( zoom || 1);


//change shape
scene.remove(display.currentShape);
display.currentShape = new THREE.Mesh( new THREE.SphereBufferGeometry(0.5, 16*zoom, 16*zoom), material);
scene.add(display.currentShape);
display.currentShape.position.y = 0.5;
updateMaterial();


//start render loop
function animate() {
	stats.begin();

	display.currentShape.rotation.z += 0.1;
	renderer.render(scene, display.selectedCamera);
	
	stats.end();
	requestAnimationFrame(animate);
}
animate();

$('#faces').innerHTML = 'Segment Multiplier: <strong>'+zoom+'</strong> | Triangles: <strong>'+ renderer.info.render.triangles + '</strong> | <a href="/fps-test.htm?multiplier='+(zoom+1)+'">Next Zoom Level</a>'

//load the gui (then hide it by default)
initGui();
$('#gui').style.display = 'none';


//fix light position
display.lights.main.pivotpoint.rotation.y = degreesToRadians(135);
display.lights.main.pivotpoint.rotation.z = degreesToRadians(135);

/*global THREE*/ 