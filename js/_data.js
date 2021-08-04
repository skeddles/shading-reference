
//holds data related to the viewer 
const display = {
	currentShape: null,
	selectedShape: null,
	shapes: {}, 
	cameras: {},
	lights: {},
	currentCamera: null,
	shading: 'smooth',
	toon: {shades: 3},
	materialRoughness: 0.5
};

var gui = {}; 