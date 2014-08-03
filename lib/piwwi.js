var async         = require('async')
  , fs            = require('fs')
  , mongoose      = ''
  , Schema        = ''
  , mongoenabled  = ''
  , CommentSchema = ''
  , Comment       = '';

// The file containing posts data
var jsonfile      = 'notes.json';

// So that jade views are loaded from:
// __dirname + /relativeviews + /notes
var viewdir       = 'notes';
var relativeviews = '../../../views';

// Mongodb connection parameters
var mongoconf      = 'mongodb://127.0.0.1/Comments';

/*
 * @brief Connects to mongo
 * @args env Connection string i.e. mongoconf
 *
 */
exports.mongod = function(env, start) {
  if (start == 'no') {
    mongoenabled = false;
    return;
  }

  var mongoose      = require('mongoose')
    , Schema        = mongoose.Schema
    , mongoenabled  = true
    , CommentSchema = new Schema({
        post_id   : {type: String, require: true},
        username  : {type: String, require: true},
        comment   : {type: String, require: true},
        insertdate: {type: Date, require: true}
    })
    , Comment       = mongoose.model('Comment', CommentSchema);

  mongoose.connect(env);
  mongoose.connection.on('open', function() {
    console.log('Mongodb connected');
  });
}

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
              var id = jsonart['jade'];
              // Pack comments
              if (mongoenabled) 
              {
                mongoose.model('Comment', Comment);
                async.waterfall([
                  function readComments(callback) {
                    var comments = Array();
                    Comment.find({post_id : id}).sort({insertdate: 'desc'}).
                      execFind(function(err,docs) {
                      if (err)
                        comments = [];
                      else
                        comments = docs;
                    callback(err, comments);
                    });
                  },
                function renderPost(comments, callback) {
                  res.render(view, { 
                    title: jsonart['title'],
                    _title: jsonart['title'],
                    _subtitle: jsonart['subtitle'],
                    _date: jsonart['date'],
                    _id: id,
                    _url: jsonart['url'],
                    _comments: comments
                  });
                }
                ]);
              }
              else {
                res.render(view, { 
                  title: jsonart['title'],
                  _title: jsonart['title'],
                  _subtitle: jsonart['subtitle'],
                  _date: jsonart['date'],
                  _id: id,
                  _url: jsonart['url'],
                  _comments: null
                });
              }
            }
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

/*
 * Adds a comment via POST
 *
 */
exports.blogAddComment = function(req, res) {
  var comment = {
    username    : req.body.cname,
    comment     : req.body.ccomment,
    post_id     : req.body.post_id,
    insertdate  : new Date()
  };

  _url = req.body.post_url;

  mongoose.model('Comment', Comment);
  var commentObj = new Comment(comment);

  commentObj.save(function(err, data) {
    if (err) 
      console.log('Error save' + req.body.ccomment);
    else 
      // TODO thanks flash
      res.redirect([viewdir, _url].join('/'));
  });
}
