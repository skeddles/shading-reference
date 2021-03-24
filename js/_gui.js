
function initGui () {

	//initialize gui
	const gui = new dat.GUI();
	gui.domElement.id = 'gui';
	$('#threes-container').appendChild(gui.domElement);

	//OBJECT SETTINGS
	gui.object = gui.addFolder('Object');
	gui.object.open();

		//shape dropdown
		var shapeChoice = gui.object.add(display, 'selectedShape', Object.keys(display.shapes));
		shapeChoice.onChange(() => {
			scene.remove(display.currentShape);
			display.currentShape = display.shapes[display.selectedShape];
			scene.add(display.currentShape);
			display.currentShape.position.y = 0.5;
		});

		gui.object.addColor(new ColorGUIHelper(sun, 'color'), 'value').name('color');

	//CAMERA
	gui.camera = gui.addFolder('Camera');
	gui.camera.open();

		gui.camera.add(display.cameras.perspective.position, 'x', 0, 2, 0.01);

	//LIGHT SETTINGS
	gui.light = gui.addFolder('Light');
	gui.light.open();

		gui.light.add(sun, 'intensity', 0, 2, 0.01);
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