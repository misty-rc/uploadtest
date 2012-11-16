
/*
 * GET home page.
 */

var _ = require('underscore'),
    mongoose = require('mongoose'),
    fs = require('fs'),
    easyimg = require('easyimage'),
    path = require('path');

var db = mongoose.createConnection('localhost', 'uploadfiles');

var FileSchema = new mongoose.Schema({
  type: String,    // image/png
  orgname: String, // hoge.png
  tmpname: String, // x125ad.png
  createdAt: Date
});

var UpFile = db.model('Files', FileSchema);

// image ope

var convert = function() {
};


//
// obsolute
exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.view = function(req, res) {
  
  UpFile.find({}, function(err, files) {
    if(err) return;
    res.render('index', {title: 'Viewer', files: files ? files : []});
  });
};

exports.upload = function(req, res) {
  console.log(req.body);
  console.log(req.files);
  
  var upfile = req.files.upfile;
  if(upfile) {
    // type image/png
    var type = upfile.type; //mimetype

    // name chromium_dev.PNG
    var name = upfile.name.toLowerCase(); //original name
    var orgdir = "uploads/org";    // org dir
    var thumbdir = "uploads/thumbnail"; // thumb dir
    var basename = path.basename(upfile.path);
    var ext = path.extname(name);         //ext

    // path public/uploads/org/89825ff9379d95250db303e30d2cd70c
    var tmpname = path.basename(upfile.path) + ext;
    
    console.log(__dirname);
    console.log(path.join("../public/" + orgdir, basename));
    console.log(path.join("../public/" + orgdir, tmpname));
    
    // need path.resolve -> uploads
    fs.rename(path.join(__dirname + "../public/" + orgdir, basename), path.join(__dirname + "../public/" + orgdir, tmpname), function(err) {
      if(err) throw err;
});

    easyimg.thumbnail(
      {
        src: path.join(orgdir, tmpname),
        dst: path.join(thumbdir, tmpname),
        width: 64,
        height: 64
      }, function(err, image) {
        if(err) throw err;
      }
    );
    
    var file = new UpFile();
    file = _.extend(file, {
      type: type,
      orgname: name,
      tmpname: tmpname,
      createdAt: new Date()
    });

    file.save(function(err) {
      res.redirect('/');
    });
  }
};