
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
				console.log('> setting',k,'to',data[k]); 
				guiObj[k].setValue(data[k]);
			}
		}
	} 
	
	//create data object by combining first preset > first preset of same shape > specified shape preset 
	let data = {};
	deepMergeObjects(data, PRESETS['sphere'][0]);
	deepMergeObjects(data, PRESETS[e.target.dataset.shape][0]);
	deepMergeObjects(data, PRESETS[e.target.dataset.shape][e.target.dataset.id]);

	console.log('loading data', data)

	loadExampleData(data,gui);


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