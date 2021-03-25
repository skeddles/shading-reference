function newToonMaterial(shades) {
	
	//generate an array of the shades needed
	const colors = new Uint8Array( shades);
	for ( let c = 0; c <= colors.length; c ++ ) {
		colors[ c ] = ( c / colors.length ) * 256;
	}

	//create gradient map from colors
	const gradientMap = new THREE.DataTexture( colors, colors.length, 1, THREE.LuminanceFormat );
	gradientMap.minFilter = THREE.NearestFilter;
	gradientMap.magFilter = THREE.NearestFilter;
	gradientMap.generateMipmaps = false;

	//done
	return new THREE.MeshToonMaterial({color: 0x726672,gradientMap: gradientMap});
}