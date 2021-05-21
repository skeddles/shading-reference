
//generate preview images
let html='';
let presetCats = Object.keys(PRESETS);
console.log('aaa',presetCats)
presetCats.forEach(c => {

	let catholder = document.createElement('div');
	$('.examples').appendChild(catholder);

	let heading = document.createElement('h2');
	heading.innerHTML = c;
	catholder.appendChild(heading);

	let exampleholder = document.createElement('div');
	exampleholder.className = 'example-holder';
	catholder.appendChild(exampleholder);

console.log(PRESETS[c])

	//loop through all presets in category
	for (var i = 0; i < PRESETS[c].length; i++) {

		let example = document.createElement('div');
		exampleholder.innerHTML += '<img class="preset" data-shape="'+c+'" data-id="'+i+'" src="/images/thumbnails/'+c+'-'+(i+1)+'.png" />';
		exampleholder.appendChild(example);

	} 
});

$('.examples').insertAdjacentHTML('beforeend', html);