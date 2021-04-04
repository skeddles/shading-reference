const gltfLoader = new THREE.GLTFLoader();
const container = $('#threes-container'); // I know your IDE says there's an error here, it's just because of the included presets line above. ignore it.

//create scene
const scene = new THREE.Scene();

//create camera
display.cameras.perspective = new THREE.PerspectiveCamera( 75, 1, 0.1, 1000 ); //fov, aspect, clip near/far
display.cameras.perspective.position.set(2, 0, 0);
display.cameras.perspective.rotateAround = 45;
display.cameras.perspective.rotateUp = 45;

const camera_pivot = new THREE.Object3D();
camera_pivot.position.set(0, 0.5, 0);
camera_pivot.add(display.cameras.perspective);
camera_pivot.rotation.set(0,degreesToRadians(display.cameras.perspective.rotateUp),0);
display.cameras.perspective.lookAt(camera_pivot.position);
scene.add( camera_pivot );

//add grid
var gridHelper = new THREE.GridHelper(9,9,'#202632','#202632');
if (THUMBNAILMODE) gridHelper.visible = false;
scene.add( gridHelper );


//create renderer
var renderer = new THREE.WebGLRenderer({alpha: true, antialias: true,physicallyCorrectLights: true});
renderer.setClearColor( 0x000000, 0 ); //make transparent
renderer.physicallyCorrectLights = true;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
if (THUMBNAILMODE) renderer.setSize( 512, 512); //if in thumbnail mode, use static 512x512 sized renderer
container.appendChild( renderer.domElement );

//generic material
var material = new THREE.MeshStandardMaterial({color: 0x726672, roughness: 0});
//material.shininess = 150;

//create shapes
display.shapes.cube = new THREE.Mesh(new THREE.BoxGeometry(), material);
display.shapes.cylinder = new THREE.Mesh( new THREE.CylinderBufferGeometry(1, 1, 1, 32), material);
display.shapes.sphere = new THREE.Mesh( new THREE.SphereBufferGeometry(0.5, 16, 16), material);
display.shapes.cone = new THREE.Mesh(new THREE.ConeBufferGeometry(1, 1, 32), material);
display.shapes.tetra = new THREE.Mesh(new THREE.TetrahedronBufferGeometry(1), material);
display.shapes.doughnut = new THREE.Mesh(new THREE.TorusBufferGeometry(0.5, 0.3, 16, 32), material);

gltfLoader.load( 'models/cube.glb', function ( gltf ) {

	const loadedShape = gltf.scene.children[0]

	//scene.add(loadedShape);
	console.log('cub',loadedShape)

	loadedShape.material.roughness = 0.9;

	//gltf.scene.children[0].material.color.setHex(0xff0000);
}, undefined, function ( error ) {

	console.error( error );

} );

for (shape in display.shapes) {
	display.shapes[shape].castShadow = true;
}


//a base plane to catch shadows
const baseMaterial = new THREE.ShadowMaterial();
baseMaterial.opacity = 0.5;
display.base = new THREE.Mesh(new THREE.PlaneGeometry(9,9), baseMaterial);
display.base.receiveShadow = true;
display.base.rotation.set(degreesToRadians(-90),0,0)
if (THUMBNAILMODE) display.base.visible = false;
scene.add(display.base);


//add light

display.lights.main = new THREE.DirectionalLight(0xFFFFFF, 5);
display.lights.main.pivotpoint = new THREE.Object3D();
display.lights.main.pivotpoint.position.set(0, 0.5, 0);
display.lights.main.position.set(0, -2, 0);
display.lights.main.target.position.set(0, 0.5, 0);
display.lights.main.target.updateMatrixWorld();
display.lights.main.castShadow = true;
display.lights.main.rotateAround = 0;
display.lights.main.rotateUp = 0;
scene.add(display.lights.main.pivotpoint);
display.lights.main.pivotpoint.add(display.lights.main);


//add light direction indicator
const helper = new THREE.DirectionalLightHelper(display.lights.main, 0.1);
if (THUMBNAILMODE) helper.visible = false;
scene.add(helper);

//add ambient light
display.lights.ambient = new THREE.AmbientLight(0xFFFFFF, 0.2);
scene.add(display.lights.ambient);

//set defaults
display.selectedCamera = display.cameras.perspective;
display.selectedShape = 'sphere';
display.currentShape = display.shapes[display.selectedShape];
display.currentShape.position.y = 0.5;
scene.add(display.currentShape);