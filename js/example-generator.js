//!=include lib/three.js 
//=include lib/dat.gui.js
//=include util/util.js

//=include _data.js
//=include _gui.js
//=include _newToonMaterial.js


const container = $('#threes-container');


//create scene
const scene = new THREE.Scene();
display.cameras.perspective = new THREE.PerspectiveCamera( 75, 1, 0.1, 1000 ); //fov, aspect, clip near/far

const camera_pivot = new THREE.Object3D();
display.cameras.perspective.position.set(2, 0, 0);
camera_pivot.position.set(0, 0.5, 0);
display.cameras.perspective.lookAt(camera_pivot.position);

display.cameras.perspective.rotateAround = 45;
display.cameras.perspective.rotateUp = 45;
camera_pivot.add(display.cameras.perspective);
scene.add( camera_pivot );


camera_pivot.rotation.z = degreesToRadians(display.cameras.perspective.rotateUp);





//create renderer
var renderer = new THREE.WebGLRenderer({alpha: true, antialias: true,physicallyCorrectLights: true});
renderer.setClearColor( 0x000000, 0 ); //make transparent
renderer.setSize( 512, 512);
container.appendChild( renderer.domElement ); 
renderer.physicallyCorrectLights = true;
//generic material
var material = new THREE.MeshPhongMaterial({color: 0x726672});
//material.shininess = 150;

//create shapes
display.shapes.cube = new THREE.Mesh(new THREE.BoxGeometry(), material);
display.shapes.cylinder = new THREE.Mesh( new THREE.CylinderBufferGeometry(1, 1, 1, 32), material);
display.shapes.sphere = new THREE.Mesh( new THREE.SphereBufferGeometry(0.5, 16, 16), material);
display.shapes.cone = new THREE.Mesh(new THREE.ConeBufferGeometry(1, 1, 32), material);
display.shapes.tetra = new THREE.Mesh(new THREE.TetrahedronBufferGeometry(1), material);
display.shapes.doughnut = new THREE.Mesh(new THREE.TorusBufferGeometry(0.5, 0.3, 16, 32), material);





//add light
const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.2);
scene.add(ambientLight);

const sun = new THREE.DirectionalLight(0xFFFFFF, 5);
sun.position.set(1, 2, 1);
sun.target.position.set(0, 0.5, 0);
sun.target.updateMatrixWorld();
scene.add(sun);
scene.add(sun.target);

//set defaults
display.selectedCamera = display.cameras.perspective;
display.selectedShape = 'sphere';
display.currentShape = display.shapes[display.selectedShape];
display.currentShape.position.y = 0.5;
scene.add(display.currentShape);






//render
renderer.render(scene, display.selectedCamera);


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