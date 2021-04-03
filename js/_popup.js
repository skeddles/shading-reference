
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

	console.log(e.target, e.target.dataset.preset)
	let data = JSON.parse(e.target.dataset.preset);

	console.log('preset',data)
	//loop through preset data values and apply them to model
	/*for (const [key, value] of Object.entries(data)) {
		console.log(`${key}: ${value}`);
	}*/
	function loadExampleData(data,guiObj,data)	{
		for (var k in data) {
			if (typeof data[k] == "object" && data[k] !== null)
				loadExampleData(data[k],guiObj[k],data[k]); 
			else {

				console.log('> setting',guiObj,k,'to'); 
				//console.log('> setting',guiObj[k].domElement,'to',data[k]);
				guiObj[k].setValue(data[k]);
			}
		}
	} loadExampleData(data,gui,data);

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