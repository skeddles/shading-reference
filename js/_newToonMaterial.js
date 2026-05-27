function newToonMaterial(shades) {

	// Three.js MeshToonMaterial samples the gradient map using
	//   coord = dot(normal, lightDir) * 0.5 + 0.5
	// so coord [0, 0.5] is the unlit hemisphere and [0.5, 1] is the lit hemisphere.
	// To match real Lambertian lighting (like the smooth shader): the entire
	// unlit half must be the darkest shade. Bands on the lit half are spaced
	// evenly in dotNL, which makes them narrower near the highlight and wider
	// near the terminator -- a much closer match to how light actually falls off.

	// examples.json / URL params can hand us shades as a string ("5"), which
	// would turn `shades + c` into string concatenation below ("5"+0 = "50")
	// and silently write to out-of-bounds indices of the Uint8Array, leaving
	// the lit hemisphere all zeros (solid black). Coerce up front.
	shades = Number(shades);

	const size = shades * 2;
	const colors = new Uint8Array(size);

	// unlit hemisphere: every texel is the darkest shade
	for (let c = 0; c < shades; c++) {
		colors[c] = 0;
	}
	// lit hemisphere: shades distinct values from dark (at terminator) to full bright
	for (let c = 0; c < shades; c++) {
		colors[shades + c] = shades === 1
			? 255
			: Math.round((c / (shades - 1)) * 255);
	}

	const gradientMap = new THREE.DataTexture(colors, size, 1, THREE.LuminanceFormat);
	gradientMap.minFilter = THREE.NearestFilter;
	gradientMap.magFilter = THREE.NearestFilter;
	gradientMap.generateMipmaps = false;
	gradientMap.needsUpdate = true;

	return new THREE.MeshToonMaterial({color: display.currentShape.material.color, gradientMap: gradientMap});
}
