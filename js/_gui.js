
function initGui () {

	//initialize gui
	gui = new dat.GUI();
	gui.domElement.id = 'gui';
	$('#threes-container').appendChild(gui.domElement);

	//OBJECT SETTINGS
	gui.object = gui.addFolder('Object');
	gui.object.open();

		//shape dropdown
		gui.object.shape = gui.object.add(display, 'selectedShape', Object.keys(display.shapes))
			.name('shape')
			.onChange(() => {
				scene.remove(display.currentShape);
				display.currentShape = display.shapes[display.selectedShape];
				scene.add(display.currentShape);
				display.currentShape.position.y = 0.5;
				updateMaterial();
			});

		//color
		gui.object.color = gui.object.addColor(new ColorGUIHelper(sun, 'color'), 'value').name('color');

	//CAMERA
	gui.camera = gui.addFolder('Camera');
	gui.camera.open();

		gui.camera.spin = gui.camera.add(display.cameras.perspective, 'rotateAround', 0, 360, 1)
			.name('spin')
			.onChange(() => {
				camera_pivot.rotation.y = degreesToRadians(display.cameras.perspective.rotateAround);
			});

		gui.camera.orbit = gui.camera.add(display.cameras.perspective, 'rotateUp', 0, 360, 1)
			.name('orbit')
			.onChange(() => {
				camera_pivot.rotation.z = degreesToRadians(display.cameras.perspective.rotateUp);
			});

	//LIGHT SETTINGS
	gui.light = gui.addFolder('Light');
	gui.light.open();

		gui.light.intensity = gui.light.add(sun, 'intensity', 0, 20, 0.01);

	//SHADING SETTINGS
	gui.shading = gui.addFolder('Shading');
	gui.shading.open();
		
		//shading type
		gui.shading.type = gui.shading.add(display, 'shading', ['smooth','toon'])
			.onChange(() => {
				console.log('changine to',display.shading)
				switch (display.shading) {
					case 'toon':
						material = newToonMaterial(3);
						gui.domElement.classList.add('showToonOptions');
						
						break;
						
					case 'smooth': 
						material = new THREE.MeshPhongMaterial({color: 0x726672});

						//display.gui.toonShadingOptions.forEach(o=>{console.log('w',o)});
						gui.domElement.classList.remove('showToonOptions');

						break;
				}
				updateMaterial();
			});
		
		//number of shades
		gui.shading.shades = gui.shading.add(display.toon, 'shades', 1, 8, 1)
			.onChange(() => {
				material = newToonMaterial(display.toon.shades);
				updateMaterial();
				})
			.domElement.closest('li').classList.add('subOption','toon');
}

function updateMaterial () {
	display.currentShape.material = material;
}
	
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