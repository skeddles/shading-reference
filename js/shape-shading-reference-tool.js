//=include lib/three.js 
//=include lib/dat.gui.js
//=include util/util.js


const container = $('#threes-container');
 
$('.testtesttest').addEventListener('click', e => {
	e.preventDefault();
	container.classList.add('visible');
});

//holds data related to the viewer 
var display = {
	currentShape: null,
	selectedShape: null,
	shapes: {},
	cameras: {},
	currentCamera: null,
};


//create scene
var scene = new THREE.Scene();
display.cameras.perspective = new THREE.PerspectiveCamera( 75, 1, 0.1, 1000 ); //fov, aspect, clip near/far
display.cameras.perspective.position.z = 3;
display.cameras.perspective.position.y = 3;
//display.camera.perspective.position.x = 1.25; //offsets camera for when controls are open


var camera_pivot = new THREE.Object3D()
display.cameras.perspective.lookAt( camera_pivot.position );

var gridHelper = new THREE.GridHelper(10,10);
scene.add( gridHelper );


//create renderer
var renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
renderer.setClearColor( 0x000000, 0 ); //make transparent
renderer.setSize( container.offsetWidth, window.innerHeight);
container.appendChild( renderer.domElement );

//generic material
var material = new THREE.MeshPhongMaterial({color: 0x726672});


//create shapes
display.shapes.cube = new THREE.Mesh(new THREE.BoxGeometry(), material);
display.shapes.cylinder = new THREE.Mesh( new THREE.CylinderBufferGeometry(1, 1, 1, 32), material);
display.shapes.sphere = new THREE.Mesh( new THREE.SphereBufferGeometry(1, 16, 16), material);
display.shapes.cone = new THREE.Mesh(new THREE.ConeBufferGeometry(1, 1, 32), material);
display.shapes.tetra = new THREE.Mesh(new THREE.TetrahedronBufferGeometry(1), material);
display.shapes.doughnut = new THREE.Mesh(new THREE.TorusBufferGeometry(0.5, 0.3, 8, 16), material);





//add light
const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.2);
scene.add(ambientLight);

const sun = new THREE.DirectionalLight(0xFFFFFF, 1);
sun.position.set(1, 2, 1);
sun.target.position.set(0, 0.5, 0);
sun.target.updateMatrixWorld();
scene.add(sun);
scene.add(sun.target);

const helper = new THREE.DirectionalLightHelper(sun, 0.1);
scene.add(helper);



//set defaults
display.selectedCamera = display.cameras.perspective;
display.selectedShape = 'cube';
display.currentShape = display.shapes[display.selectedShape];
display.currentShape.position.y = 0.5;
scene.add(display.currentShape);


//render
function animate() {
	renderer.render(scene, display.selectedCamera);
	requestAnimationFrame(animate);
}
animate();



/*global THREE, dat*/


class ColorGUIHelper {
	constructor(object, prop) {
		this.object = object;
		this.prop = prop;
	}
	get value() {
		return `#${this.object[this.prop].getHexString()}`;
	}
	set value(hexString) {
		this.object[this.prop].set(hexString);
	}
}


const gui = new dat.GUI();
gui.domElement.id = 'gui';
container.appendChild(gui.domElement);
gui.addColor(new ColorGUIHelper(sun, 'color'), 'value').name('color');
gui.add(sun, 'intensity', 0, 2, 0.01);


//shape dropdown
var shapeChoice = gui.add(display, 'selectedShape', Object.keys(display.shapes));

shapeChoice.onChange(() => {
	scene.remove(display.currentShape);
	display.currentShape = display.shapes[display.selectedShape];
	scene.add(display.currentShape);
	display.currentShape.position.y = 0.5;
});