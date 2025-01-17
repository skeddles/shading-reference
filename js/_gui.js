
function initGui () {

	//initialize gui
	gui = new dat.GUI();
	gui.domElement.id = 'gui';
	$('#threes-container').appendChild(gui.domElement);


	//OBJECT SETTINGS
	gui.object = gui.addFolder('Object');
	gui.object.open();

		//shape dropdown
		gui.object.shape = gui.object.add(display, 'selectedShape', Object.keys(PRESETS))
			.name('shape')
			.onChange(() => {

				//exit if selected shape is already current shape
				if (display.selectedShape === display.lastSelectedShape) return;
				display.lastSelectedShape = display.selectedShape;

				//remove current
				scene.remove(display.currentShape);

				//load new model
				if (!display.shapes.hasOwnProperty(display.selectedShape)) {
					$('#loading-model').classList.add('visible');

					gltfLoader.load('models/'+display.selectedShape+'.glb', function ( gltf ) {
						
						//save shape, then proceed to update it
						const loadedShape = gltf.scene.children[0];
						loadedShape.castShadow = true;
						display.shapes[display.selectedShape] = loadedShape;
						loadedShape.name = display.selectedShape;
						updateShape(loadedShape);
						
						$('#loading-model').classList.remove('visible');

						console.log('loaded model',loadedShape);

					}, undefined, error => console.error);
				//model already loaded
				} else updateShape(display.shapes[display.selectedShape]);
			});
		
		//roughness
		gui.object.roughness = gui.object.add(display, 'materialRoughness', 0, 1, 0.01).name('roughness')
			.onChange(() => {
				material.roughness = display.materialRoughness;
				updateMaterial();
				console.log('changed roughness',material.roughness);
			});
		let guiMat = material;
		gui.object.color = gui.object.addColor(new ColorGUIHelper(guiMat, 'color'), 'value').name('color')
			.onChange(() => {
				material.color = guiMat.color;
				updateMaterial();
				console.warn('changed material color',display.currentShape.material.color); 
			});
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
			camera_pivot.rotation.z = degreesToRadians(display.cameras.perspective.rotateUp);

	//LIGHT SETTINGS
	gui.light = gui.addFolder('Light');
	gui.light.open();

		gui.light.intensity = gui.light.add(display.lights.main, 'intensity', 0, 20, 0.01);

		//color
		gui.light.color = gui.light.addColor(new ColorGUIHelper(display.lights.main, 'color'), 'value').name('color');

		gui.light.showShadow = gui.light.add(display.base, 'visible').name('shadow');

		
		gui.light.spin = gui.light.add(display.lights.main, 'rotateAround', 0, 360, 1)
			.name('spin')
			.onChange(() => {
				display.lights.main.pivotpoint.rotation.y = degreesToRadians(display.lights.main.rotateAround);
			});

		gui.light.orbit = gui.light.add(display.lights.main, 'rotateUp', 0, 360, 1)
			.name('orbit')
			.onChange(() => {
				display.lights.main.pivotpoint.rotation.z = degreesToRadians(display.lights.main.rotateUp);
			});
			display.lights.main.pivotpoint.rotation.z = degreesToRadians(display.lights.main.rotateUp);

	//SHADING SETTINGS
	gui.shading = gui.addFolder('Shading');
	gui.shading.open();
		
		//shading type
		gui.shading.type = gui.shading.add(display, 'shading', ['smooth','toon']).name('type')
			.onChange(() => { 
				console.log('changing shading type to',display.shading)
				switch (display.shading) {
					case 'toon':
						material = newToonMaterial(3);
						updateMaterial();

						gui.domElement.classList.add('showToonOptions');
						
						break;
						
					case 'smooth': 
						material = new THREE.MeshStandardMaterial({color: display.currentShape.material.color, roughness: display.materialRoughness});
						updateMaterial();

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
			});
			gui.shading.shades.domElement.closest('li').classList.add('subOption','toon');

	//COMPLETE -- the gui has been created an initialized
	Array.from($$('#gui input[type="checkbox"]')).forEach((e,i)=>{
		e.id = 'checkbox-'+i;
		e.insertAdjacentHTML('afterend', '<label for="checkbox-'+i+'"></label>');
	});
}

function updateShape (newShape) {
	let addedShape = scene.add(newShape);

	display.currentShape = newShape;
	updateMaterial();

	window.exampleLoaded = true;
}

function updateMaterial () {
	display.currentShape.material = material;
	console.log('updated material')
}
	
class ColorGUIHelper {
	constructor(object, prop) {
		this.object = object;
		this.prop = prop;
	}
	get value() {
		console.log('getting color');
		return `#${this.object[this.prop].getHexString()}`;
	}
	set value(hexString) {
		console.log('setting color',hexString,this.object,this.prop);
		this.object[this.prop].set(hexString);
	}
}