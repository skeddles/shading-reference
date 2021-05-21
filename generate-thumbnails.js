const fs = require('fs');
const async = require('async');
const puppeteer = require('puppeteer');
const fileUrl = require('file-url');

module.exports = function (done) {

	//make sure build/images/thumbnails folder exists
	fs.mkdir("build/images", function (err) {	if (err && err.code !== "EEXIST") console.log('ERROR CREATING FOLDER',err);   });
	fs.mkdir("build/images/thumbnails", function (err) {	if (err && err.code !== "EEXIST") console.log('ERROR CREATING FOLDER',err);   });

	//load examples data
	const examples = JSON.parse(fs.readFileSync('examples.json'));

	//LOOP through shape types
	async.eachOfLimit(examples, 1, (shapeArray, shape, finishedGeneratingShapeGroup) => {
			console.log('> generating '+shape+'s ['+shapeArray.length+']');

			//LOOP through each preset in shape group and render it
			async.eachOfLimit(shapeArray, 1, (shapeData, index, renderedPreset) => {
					//add object.shape specification if not added
					if (!shapeData.object) shapeData.object = {};
					shapeData.object.shape = shape;

					//generate the thumbnail
					generateThumbnail(shape+'-'+(index+1), shapeData, renderedPreset);
				},

				//done rendering all shapes in shape group
				finishedGeneratingShapeGroup
			);
		},

		//done with every shape type
		(err) => {
			console.log("done rendering all shapes");
			done();
		}
	);
}


async function generateThumbnail (name, data, done) {
	const browser = await puppeteer.launch({args: ['--disable-web-security']});
	const page = await browser.newPage();
	await page.setViewport({ width: 512, height: 512 });

	//convert the data into url parameters
	let urlParameters = generateUrlParametersFromData(data,'');
	if (urlParameters.length < 3) urlParameters = '';
	else urlParameters = '?' + urlParameters.substring(1); //replace first & with ?


	console.log(' ',name,urlParameters);

	//load the page
	let generatedUrl = fileUrl('./build/example-generator.htm')+urlParameters;

	await page.goto(generatedUrl).catch(err=>console.error('invalid url',generatedUrl));

	//wait until the example is fully loaded
	await page.waitForFunction('window.exampleLoaded === true');

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
			if (path) objPath = '&' +path+'.' + objPath;

            urlParameters += objPath +'='+ cleanData(data[k]);
		}
    }
    return urlParameters;
}

//removes unnecessary stuff from data
function cleanData (data) {
	if (typeof data == 'string') return data.replace('#','');
 
	return data;   
}