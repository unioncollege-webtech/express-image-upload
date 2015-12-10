var express = require('express');
var bodyparser = require('body-parser');
var fs = require('fs');
var multer = require('multer');

// Create new express application
var app = express();

// Use Handlebars for templates
app.set('view engine', 'hbs');

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Enable basic parsing of <form> post bodies
app.use(bodyparser.urlencoded({
  extended: false
}));

// Store site-wide information for templates
app.locals.sitename = 'Express Image Upload';
app.locals.source_url = 'https://github.com/unioncollege-webtech/express-image-upload';

// Pre-populate the image list and make it available to the templates
var images = require('./images.json');
app.locals.images = images;


// Set up the file storage using multer
var storage = multer.diskStorage({
  // Store uploaded images in the public directory
  destination: 'public/uploads',
  filename: function(req, file, cb) {
    // Use the original name for the filename
    cb(null, file.originalname);
  }
});

// TODO: Files should ideally be verified to prevent malicious uploads.
var upload = multer({
  storage: storage
});


//
// Register application routes
//

// Respond to the base path
app.get('/', function(req, res) {
  res.render('index', {
    title: 'Welcome!'
  });
});

// Handle POST requests with an image upload.
app.post('/', upload.single('upload'), function(req, res) {

  if (req.file) {

    images.push({
      filename: req.file.filename,
      caption: req.body.caption || ''
    });

    saveImageList(images);
    res.redirect('/');
  }
  else {
    res.redirect('/');
  }

});

// Save the images list into a file
function saveImageList(images) {
  fs.writeFile(__dirname + '/images.json', JSON.stringify(images), 'utf-8');
}

// Start the server
var port = process.env.PORT || 3000;
var address = process.env.IP || '127.0.0.1'
app.listen(port, address, function() {
  console.log('%s listening at http://%s:%s',
    app.locals.sitename, address, port);
});