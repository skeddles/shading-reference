//=include lib/three.js 
//=include lib/dat.gui.js
//=include util/util.js

//=include _data.js
//=include _gui.js
//=include _newToonMaterial.js

const container = $('#threes-container');
 
$('.testtesttest').addEventListener('click', e => {
	e.preventDefault();
	container.classList.add('visible');
});


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


//add grid
var gridHelper = new THREE.GridHelper(9,9,'#202632','#202632');
scene.add( gridHelper );



//create renderer
var renderer = new THREE.WebGLRenderer({alpha: true, antialias: true,physicallyCorrectLights: true});
renderer.setClearColor( 0x000000, 0 ); //make transparent
renderer.setSize( container.offsetHeight, container.offsetHeight);
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

const helper = new THREE.DirectionalLightHelper(sun, 0.1);
scene.add(helper);


//set defaults
display.selectedCamera = display.cameras.perspective;
display.selectedShape = 'sphere';
display.currentShape = display.shapes[display.selectedShape];
display.currentShape.position.y = 0.5;
scene.add(display.currentShape);



//generate preview images
let html='';
let presetCats = Object.keys(PRESETS);
console.log('aaa',presetCats)
presetCats.forEach(c => {

	let catholder = document.createElement('div');
	$('.examples').appendChild(catholder);

	let heading = document.createElement('h2');
	heading.innerHTML = c;
	catholder.appendChild(heading);

	let exampleholder = document.createElement('div');
	exampleholder.className = 'example-holder';
	catholder.appendChild(exampleholder);

console.log(PRESETS[c])

	//loop through all presets in category
	PRESETS[c].forEach(p=>{
		console.log('rendering preset',c,p)

		let example = document.createElement('div');
		exampleholder.appendChild(example);

		//scene
		let examplescene = new THREE.Scene();

		//shape
		let exampleshape = new THREE.Mesh( new THREE.SphereBufferGeometry(0.5, 16, 16), material);
		examplescene.add(exampleshape);

		//light
		let examplelight = new THREE.DirectionalLight(0xFFFFFF, 1);
		examplelight.position.set(1, 2, 1);
		examplelight.target.position.set(0, 0.5, 0);
		examplelight.target.updateMatrixWorld();
		examplescene.add(examplelight);

		var examplerenderer = new THREE.WebGLRenderer({alpha: true, antialias: true,physicallyCorrectLights: true});
		examplerenderer.setClearColor( 0x000000, 0 ); //make transparent
		examplerenderer.setSize(200, 200);
		exampleholder.appendChild( examplerenderer.domElement );
		examplerenderer.physicallyCorrectLights = true;
	});
});

$('.examples').insertAdjacentHTML('beforeend', html);



//render
function animate() {
	renderer.render(scene, display.selectedCamera);
	requestAnimationFrame(animate);
}
animate();

initGui();




/*global THREE, dat*/