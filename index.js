var async         = require('async');
var fs            = require('fs');
var mongoose      = require('mongoose');

var jsonfile      = 'notes.json';
var viewdir       = 'notes';
var relativeviews = '../../views';

/*
 * @brief Renders notes index
 * @params res - http response
 *
 */
exports.blogIndex = function(res) {
  async.waterfall([
    function readData(callback) {
      var list = Array();
      fs.readFile(jsonfile, 'utf8', function(err, data) {
        if (err) { console.log("Error"); throw err; }
        obj = Array(JSON.parse(data));
        obj.forEach(function(entry) {
          entry.forEach(function(inner) {
            for (var key in inner) {
              if (key != 'current') {
                var jsonart = inner[key];
                list[list.length] = jsonart;
              }
            }
          });
        });
        callback(err, list);
      });
    },
    function renderIndex(list, callback) { 
      res.render(viewdir, { title: 'Notes', articles: list});
    }
  ]);
}

/*
 * @brief Renders a specific post
 * @params res - http response
 *         mytitle - post unique title
 *
 */
exports.blogPost = function(res, mytitle) {
  var found = false;
  fs.readFile(jsonfile, 'utf8', function(err, data) {
    if (err) { console.log("Error"); throw err; }
    obj = Array(JSON.parse(data));
    obj.forEach(function(entry) {
      entry.forEach(function(inner) {
        for (var key in inner) {
          if (key == mytitle) {
            var jsonart = inner[key];
            if (jsonart['jade'] != undefined)
            {
              found = true;
              var art = jsonart['jade'] + '.jade';
              var view = [__dirname, relativeviews, viewdir, art].join('/');
              res.render(view, { 
                title: jsonart['title'],
                _title: jsonart['title'],
                _subtitle: jsonart['subtitle'],
                _date: jsonart['date'],
                _id: jsonart['jade'],
                // TODO
                _comments: []
              });
      }
      /*
       * This works with Node 0.10.x
       * It doesn't work with Node 0.6.21
       *
       fs.exists(view, function(exists) {
       if (exists) {
       found = true;
       res.render(view, { title: mytitle });
       }
       });
       */
          }
        }
      });
    });
    if (! found)
    {
      var err404 = [__dirname, relativeviews, '404.jade'].join('/');
      res.render(err404, { title: "404" });
    }
  });
}

exports.blogComment = function(req, res) {
  var _cname = req.body.cname;
  var _ccomment = req.body.ccomment;
  res.send('name = ' + _cname + " comment = " + _ccomment);
}
