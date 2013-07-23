piwwi
=====

A JSON-based blogposts and Mongod-based comments, developed to run on
Node.js Express (I use it on OpenShift).


Getting started
===============

Include it in your `server.js` or whatsoever entry point of your app:

    var piwwi   = require('piwwi');

Then connect to your Mongod instance with a string like:

    piwwi.mongod('mongodb://user:pass@127.0.0.1/Comments');

Define a sample `notes.json` like the following and put into the
Express root:

    [
      { "current" : "0002" },
      { "why-node-js" : 
        {
          "jade": "0001",
          "url": "why-node-js",
          "title": "Who uses Node.js and why",
          "subtitle": "Revolutioning your perception of www",
          "date": "2013-06-19",
          "keys": "node, javascript, www",
          "published": "yes"
        }
      },
      { "" : 
        {
          "jade": "",
          "url": "",
          "title": "",
          "subtitle": "",
          "date": "4",
          "keys": "",
          "published": ""
        }
      }
    ]

Add the blog functions to your routes, for instance the posts list:

    app.get('/blog', function(req, res) {
        piwwi.blogIndex(res);
    }

And the post:

    app.get('/blog/:title', function(req, res) {
        piwwi.blogPost(res, req.params.title.toString());
    });


The posts list is an example view you can find in
`views/blog_index_example.jade`, while each post is a `jade` named as
`xxxx.jade` (example in `views/blog_post_example.jade`).  Post views
are organized by default in the `views/notes/` application directory.

You can configure in the header of `lib/piwwi.js`:

The file containing the posts list:

	var jsonfile      = 'blog.json';

Your blog posts locations (so it's /views/blog/ in the example):

	var viewdir       = 'blog';
	var relativeviews = '../../../views';

The mongodb connection string:

	var mongoconf      = 'mongodb://127.0.0.1/Comments';



TODO
====

* RSS
* Flash messages
* Play with Socket.IO
