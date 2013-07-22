piwwi
=====

A JSON-based blog and Mongod-based comments, developed to run on Node.js Express (I use it on OpenShift).

It's very primitive now.


Getting started
===============

Include it in your `server.js` or whatsoever entry point of your app:

        var piwwi   = require('piwwi');

Then define a sample `notes.json` like the following and put into the Express root:

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


The posts list is a view named `views/notes.jade` looking like:

        extends layout

        block content
          h1 My blog

          each article in articles
            if (article['published'] == 'yes')
              li #{article['title'] - #{article['subtitle']}

Post views are organized in the `views/notes/` directory.
Each post is a `jade` named as `xxxx.jade` and can have a *default layout* to be extended with
a comments logic iteration like:

        extends layout

        block content
          h1= _title
          h2= _subtitle
          h3= _date

          block note

          if (_comments.length > 0)
              hr
              h3 Comments
              each comment in _comments
                h4 #{comment.username} on #{comment.insertdate} wrote
                p= comment.comment


TODO
====

* Comments
