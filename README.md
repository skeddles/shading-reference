
# BUILD STATUS: [![Netlify Status](https://api.netlify.com/api/v1/badges/f3c6e7b9-f4a6-4fa9-8c5c-c91bb4ec8254/deploy-status)](https://app.netlify.com/sites/dreamy-shockley-6804ba/deploys)


### How To Run

`npm run build` or `gulp` - compile and move all required code, images and models into the /build folder

`npm run serve` - start a local web server for the project

`npm run watch` - automatically rebuild updated assets while editing

`gulp js` - rebuild all javascript files

`gulp css` - rebuild all css files

`gulp html` - rebuild all html files

`gulp favicon` - copy favicon file to build

`gulp models` - copy all model files to build

`gulp image` - minify all image files (except thumbnails)

`gulp thumbnails` - recreate all thumbnail files (takes a little while)

### More Info

This is a static site which automatically gets rebuilt and distributed via netlify every time the master branch is updated. 

Thumbnails are generated once when built then stored. This is done using puppetteer, which opens example-generator.htm, and passes the settings via the URL. 

Models stored as `.glb` files, exported from blender.


### Adding Models

1. Open the .blend file in the `/models` folder
2. Import your object
3. Hide all objects aside from the bounding box
4. Resize the object so it fits well within the bounding box (some outside is okay)
5. If the object has sharp edges, manually add some slight bevel to them. 
6. Make sure the object is selected in the scene collection
7. File > Export > glTF
8. Set the format to `glTF binary (.glb)`
9. Under include, make sure `selected objects` is selected
10. Export the model 
11. Add an entry for the model in the `examples.json` file
