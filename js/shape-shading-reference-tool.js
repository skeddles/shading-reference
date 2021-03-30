//!=include lib/three.js 
//=include lib/dat.gui.js
//=include util/util.js

//=include _data.js
//=include _gui.js
//=include _newToonMaterial.js




const PRESETS = 
//=include ../examples.json
const container = $('#threes-container'); // I know your IDE says there's an error here, it's just because of the included presets line above. ignore it.
 
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
	for (var i = 0; i < PRESETS[c].length; i++) {

		let example = document.createElement('div');
		exampleholder.appendChild(example);

		let presetData = PRESETS[c][i];
		

		let formattedPresetData = JSON.stringify(presetData)

		console.log(i, c, presetData, formattedPresetData)

		exampleholder.innerHTML += '<img class="preset" data-preset=\''+formattedPresetData+'\' src="/images/thumbnails/'+c+'-'+(i+1)+'.png" />';

	} 
});

$('.examples').insertAdjacentHTML('beforeend', html);

//add click handler for preset buttons
document.addEventListener('click', e=>{
	//if it was something other than one of the preset buttons
	if (!e.target.classList.contains('preset')) {
		//check if the editor is open, and you clicked outside of the popup, close it
		if (document.body.classList.contains('editorOpen') && !e.target.closest('#threes-container')) 
			document.body.classList.remove('editorOpen'); 

		//stop processing click
		return;
	};

	console.log(e.target, e.target.dataset.preset)
	let data = JSON.parse(e.target.dataset.preset);

	console.log('preset',data)
	//loop through preset data values and apply them to model
	/*for (const [key, value] of Object.entries(data)) {
		console.log(`${key}: ${value}`);
	}*/
	function loadExampleData(data,guiObj,data)	{
		for (var k in data) {
			if (typeof data[k] == "object" && data[k] !== null)
				loadExampleData(data[k],guiObj[k],data[k]); 
			else {
				console.log('> setting',guiObj[k].domElement,'to',data[k]);
				guiObj[k].setValue(data[k]);
			}
		}
	} loadExampleData(data,gui,data);

	//show renderer (and make sure to resize it)
	$('body').classList.add('editorOpen');
	renderer.setSize( container.offsetHeight, container.offsetHeight);
});

//render
function animate() {
	renderer.render(scene, display.selectedCamera);
	requestAnimationFrame(animate);
}
animate();

initGui();




/*global THREE, dat*/