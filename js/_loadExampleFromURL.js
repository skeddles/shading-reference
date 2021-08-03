//parses the url paramters specified and tries to apply them to the viewer
function loadExampleFromURL () {

	//check if there are actually any url parameters
	if (!window.location.search.includes('?')) return console.log('no url parameters were found')
		else console.log('loading preset from url parameters', window.location.search);
		
	//load data from url
	const urlParams = new URLSearchParams(window.location.search);
		console.log('all',urlParams.entries());

	let selectedShape = urlParams.get('object.shape');
		console.log('shape:',selectedShape);
	
	//make sure shape is valid
	if (!selectedShape) selectedShape = 'sphere';	
	else if (!PRESETS.hasOwnProperty(selectedShape)) return console.error('SHAPE TYPE IS INVALID:', selectedShape);

	//get the baseshape of the preset (to load in their default values)
	let baseShape = PRESETS[selectedShape][0] || {};

	deepMergeObjects(baseShape, PRESETS['sphere'][0]);
	deepMergeObjects(baseShape, PRESETS[selectedShape][0]);
		console.log('defaulting with',selectedShape+'[0]',baseShape);
		
	//load the preset of the base shape first
	loadPresetFromJSON(baseShape, gui, 'gui');

	//loop through url parameters and apply them to the object
	nextEntry: 
	for(var pair of urlParams.entries()) {
		let key = pair[0];
		let value = pair[1];
			console.log(key+ ', '+ value);

		//split the value into an array of sub objects that we need to loop through
		let splitValue = key.split('.');
			console.log('key',splitValue);

		//attempt to get the correct gui object child reference
		let guiObj = gui;

		do {
			let currentLevel = splitValue.shift(); //separates the first value of the array
			
			if (guiObj.hasOwnProperty(currentLevel)) {
				//go to the next sublevel of the gui object
				guiObj = guiObj[currentLevel];
				console.log('gui',currentLevel)
			} else {
				console.error('The preset key "'+key+'" is invalid.');
				continue nextEntry;
			}
		} while(splitValue.length>0);

		//format value
		if (key.split('.').pop() == 'color') value = '#'+value;

		//success - set the value on the guiObject
		guiObj.setValue(value);
	}

	//show the editor (if on the live site and not the example generator, where this function doesn't exist)
	if (typeof openEditor == 'function')
		openEditor(); 

		
}

//load the initial preset for this shape
function loadPresetFromJSON(obj,guiObject, path)	{
	for (var k in obj)	{

		let newPath = path + '.' + k;

		//if this child is also an object, start traversing the child
		if (typeof obj[k] == "object" && obj[k] !== null)
		loadPresetFromJSON(obj[k],guiObject[k],newPath);
		//if the child is not an object, we've reached the end (time to set the value)
		else {
			console.log('setting',newPath,'=',obj[k]);
			guiObject[k].setValue(obj[k]);
		}
	}
}