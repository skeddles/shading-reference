var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {

	res.render('shape-shading-reference-tool', {
		title: 'Shape Shading Reference Tool',
		javascript: 'shape-shading-reference-tool',
		style: 'shape-shading-reference-tool',
	});
});

module.exports = router;
/*global siteData, Handlebars, ContentTypes, FormFields*/