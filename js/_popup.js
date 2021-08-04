
//add click handler for preset buttons
document.addEventListener('click', e=>{
	//if it was something other than one of the preset buttons
	if (!e.target.classList.contains('preset')) {
		//check if the editor is open, and you clicked outside of the popup, close it
		if (document.body.classList.contains('editorOpen') && !e.target.closest('#threes-container')) 
			document.body.classList.remove('editorOpen'); 

		//stop processing click
		return;
	};

	function loadExampleData(data,guiObj)	{
		console.log('loopidoo')
		for (var k in data) {
			if (typeof data[k] == "object" && data[k] !== null)
				loadExampleData(data[k],guiObj[k],data[k]); 
			else {
				console.log('> setting',k,'to',data[k], guiObj.hasOwnProperty(k)); 
				console.warn('>>',guiObj, guiObj[k]); 
				guiObj[k].setValue(data[k]);
			}
		}
	} 
	


	console.log('loading data', 1,PRESETS['sphere'][0])
	console.log('loading data', 2,PRESETS[e.target.dataset.shape][0])
	console.log('loading data', 3,PRESETS[e.target.dataset.shape][e.target.dataset.id])

	//create data object by combining first preset > first preset of same shape > specified shape preset 
	let data = {};
	console.log(1)
	data = deepMergeObjects(data, PRESETS['sphere'][0]);
	console.log(2)
	data = deepMergeObjects(data, PRESETS[e.target.dataset.shape][0]);
	console.log(3)
	data = deepMergeObjects(data, PRESETS[e.target.dataset.shape][e.target.dataset.id]);
	console.log(4)

	//TODO deep merge is mutating the PRESETS object, naughty naughty

	console.log('loading data', 4,data)

	loadExampleData(data,gui);

	console.warn('>>>>',display.currentShape.material?display.currentShape.material.color:'not defined yet',display.currentShape.material?display.currentShape.material.roughness:'not defined yet'); 

	console.log('done')
	//show renderer
	openEditor();
});

//opens the editor so the user can see it
function openEditor () {
	//make visible
	$('body').classList.add('editorOpen');

	//resize renderer to fit window
	renderer.setSize( container.offsetHeight, container.offsetHeight);
}