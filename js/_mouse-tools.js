
const MOUSE_DRAG_SPEED = 0.5;

const MOUSE = {
	start: {
		x: 0,
		y: 0
	},
	startValues: {
		orbit: 0,
		spin: 0,
	},
	newValues: {
		orbit: 0,
		spin: 0,
	},
	down: false
};

document.querySelector('#threes-container').addEventListener('mousedown', e=>{
	MOUSE.down = true;
	MOUSE.start.x = e.clientX;
	MOUSE.start.y = e.clientY;
	MOUSE.startValues.orbit = gui.camera.orbit.getValue();
	MOUSE.startValues.spin = gui.camera.spin.getValue();

	document.querySelector('body').classList.add('dragging');
});  

document.addEventListener('mouseup', e=>{
	MOUSE.down = false;

	document.querySelector('body').classList.remove('dragging');

	gui.camera.spin.setValue(MOUSE.newValues.spin);
	gui.camera.orbit.setValue(MOUSE.newValues.orbit);
});

document.addEventListener('mousemove', e=>{
	if (!MOUSE.down) return;

	let xDistance = (e.clientX - MOUSE.start.x) * MOUSE_DRAG_SPEED;
	let yDistance = (e.clientY - MOUSE.start.y) * MOUSE_DRAG_SPEED;

	MOUSE.newValues.orbit = wrapDegrees(MOUSE.startValues.orbit + yDistance);
	MOUSE.newValues.spin = wrapDegrees(MOUSE.startValues.spin - xDistance);

	gui.camera.spin.setValue(MOUSE.newValues.spin);
	gui.camera.orbit.setValue(MOUSE.newValues.orbit);
	
	console.log('x',xDistance,'y',yDistance);
});

function wrapDegrees(value) {
	return (value + 360) % 360;
}