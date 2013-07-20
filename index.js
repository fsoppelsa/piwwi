var async   = require('async');
var fs      = require('fs');

/*
 * @brief Renders notes index
 * @params res - http response
 *
 */
exports.blogIndex = function(res) {
  async.waterfall([
    function readData(callback) {
      var list = Array();
      fs.readFile('notes.json', 'utf8', function(err, data) {
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
      res.render('notes', { title: 'Notes', articles: list});
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
  fs.readFile('notes.json', 'utf8', function(err, data) {
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
        // Gets home's views
        var view = __dirname + '/../../views/notes/'+jsonart['jade']+'.jade';
        res.render(view, { 
          title: jsonart['title'],
          _title: jsonart['title'],
          _subtitle: jsonart['subtitle'],
          _date: jsonart['date'],
          _id: jsonart['jade'],
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
      res.render(__dirname + '/views/404', { title: "404" });
  });
}
