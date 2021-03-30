const fs = require('fs');
const async = require('async');
const puppeteer = require('puppeteer');

//load examples data
const examples = JSON.parse(fs.readFileSync('examples.json'));

fs.mkdir("build/images", function (err) {	if (err && err.code !== "EEXIST") console.log('ERROR CREATING FOLDER',err);   });
fs.mkdir("build/images/thumbnails", function (err) {	if (err && err.code !== "EEXIST") console.log('ERROR CREATING FOLDER',err);   });

module.exports = function (done) {

	//LOOP through shape types
	async.eachOfLimit(examples, 1, (shapeArray, shape, finishedGeneratingShapeGroup) => {
			console.log('> generating '+shape+'s ['+shapeArray.length+']');

			//LOOP through each preset in shape group and render it
			async.eachOfLimit(shapeArray, 1, (shapeData, index, renderedPreset) => {
					console.log(' ', shapeData);
					generate(shape+'-'+(index+1), shapeData, renderedPreset);
				},

				//done rendering all shapes in shape group
				(err) => {
					console.log("done");
					finishedGeneratingShapeGroup(err);
				}
			);
		},

		//done with every shape type
		(err) => {
			console.log("done rendering all shapes");
			done();
		}
	);
		return
	//loop through all shapes in examples
	for (shape in examples) {
		async.eachOfLimit(
			examples[shape],
			1,
			(i, k, c) => {
				console.log(">", k, i);
				c();
			},
			(err) => {
				console.log("done");
				done();
			}
		);

		//loop through examples in shape and generate each
		//examples[shape].forEach((data,i) => generate(shape+'-'+(i+1), data));
	}

	console.log('finished generating examples');
	
	//success
	done();
}


async function generate (name, data, done) {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.setViewport({ width: 512, height: 512 });

	//convert the data into url parameters
	let urlParameters = generateUrlParametersFromData(data,'');
	if (urlParameters.length < 3) urlParameters = '';


	console.log('generating',name,'example-generator.htm'+urlParameters);

	//load the page
	let generatedUrl = 'file:///Y:/Projects/Websites/shading-reference/build/example-generator.htm'+urlParameters;
	await page.goto(generatedUrl).catch(err=>console.error('invalid url',generatedUrl));

	//screenshot the page
	await page.screenshot({
		path: 'build/images/thumbnails/'+name+'.png',
		omitBackground: true,
	});

	//success
	await browser.close();
	done();
}

//recursive function which goes through an object and adds the properties to a url parameter string
function generateUrlParametersFromData(data, path)   {
    let urlParameters = '';
    for (var k in data) {
        if (typeof data[k] == "object" && data[k] !== null)
            urlParameters += generateUrlParametersFromData(data[k], (path?(path+'.'):'') +k);
        else {
			//console.log('adding to param',urlParameters,path,path.length, k);
			let objPath = k;
			if (path) objPath = (urlParameters?'&':'?') +path+'.' + objPath;

            urlParameters += objPath +'='+ cleanData(data[k]);
		}
    }
    return urlParameters;
}

//removes unnecessary stuff from data
function cleanData (data) {
	return data.replace('#','');
}