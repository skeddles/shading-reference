
const MOUSE_DRAG_SPEED = 0.5;

const MOUSE_CONTROL = {
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
	MOUSE_CONTROL.down = true;
	MOUSE_CONTROL.start.x = e.clientX;
	MOUSE_CONTROL.start.y = e.clientY;
	MOUSE_CONTROL.startValues.orbit = gui.camera.orbit.getValue();
	MOUSE_CONTROL.startValues.spin = gui.camera.spin.getValue();

	document.querySelector('body').classList.add('dragging');
});  

document.addEventListener('mouseup', e=>{
	MOUSE_CONTROL.down = false;

	document.querySelector('body').classList.remove('dragging');

	gui.camera.spin.setValue(MOUSE_CONTROL.newValues.spin);
	gui.camera.orbit.setValue(MOUSE_CONTROL.newValues.orbit);

	console.log('mouse tools mouse up');
});

document.addEventListener('mousemove', e=>{
	if (!MOUSE_CONTROL.down) return;

	let xDistance = (e.clientX - MOUSE_CONTROL.start.x) * MOUSE_DRAG_SPEED;
	let yDistance = (e.clientY - MOUSE_CONTROL.start.y) * MOUSE_DRAG_SPEED;

	MOUSE_CONTROL.newValues.orbit = wrapDegrees(MOUSE_CONTROL.startValues.orbit + yDistance);
	MOUSE_CONTROL.newValues.spin = wrapDegrees(MOUSE_CONTROL.startValues.spin - xDistance);

	gui.camera.spin.setValue(MOUSE_CONTROL.newValues.spin);
	gui.camera.orbit.setValue(MOUSE_CONTROL.newValues.orbit);
	
	console.log('x',xDistance,'y',yDistance);
});

function wrapDegrees(value) {
	return (value + 360) % 360;
}