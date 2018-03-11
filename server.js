var mysql = require('mysql');
var readConfig = require('read-config');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var connectionPool = require('./modules/dbconnection');

var React = require('react');
var request = require('request');
var ReactDOMServer = require('react-dom/server');

require('babel-register')({
  presets: [ 'react' ]
});

var dbconfig = readConfig(__dirname + '/resources/config/dbconfig.json');
var secretConfig = readConfig(__dirname + '/resources/config/secret.json');

var pool      =    mysql.createPool({
    connectionLimit : dbconfig.connectionLimit,
    host     : dbconfig.hostname,
    user     : dbconfig.username,
    password : dbconfig.password,
    database : dbconfig.database
});

var listBooksQuery = "SELECT * FROM BOOKS";
var addBookQuery = "INSERT INTO BOOKS SET ?";
var deleteBookQuery = "DELETE FROM BOOKS WHERE ID = ?";


app.set('port', (process.env.PORT || 3000))
.use('/', express.static(path.join(__dirname, 'public')))
.use(bodyParser.json())
.use(bodyParser.urlencoded({extended: true}))
.post ("/api/getbooks",function(req, res){
  authenticate(req);
  connectionPool.handle_get(req, res, listBooksQuery, pool);
})
.post("/api/addBook",function(req, res){
  authenticate(req);
  var book = {NAME: req.body.name, DESCRIPTION: req.body.decription, AUTHOR: req.body.author, CATEGORY: req.body.category};
  connectionPool.handle_execute(req, res, addBookQuery, pool, book);
  res.redirect('/');
})
.post("/api/deleteBook/:id",function(req, res){
  authenticate(req);
  var id = parseInt(req.params.id);
  connectionPool.handle_execute(req, res, deleteBookQuery, pool, id);
})
.get(['/'],function(req, res){
  var ReactRouter = require('react-router');
  var match = ReactRouter.match;
  var RouterContext = React.createFactory(ReactRouter.RouterContext);
  var Provider = React.createFactory(require('react-redux').Provider);
  var routes = require('./public/routes.js').routes
  var store = require('./public/redux-store');

  request.post("http://localhost:3000/api/getbooks", {json: true, body: {"secret" : secretConfig.secret}}, function (err, response, body) {
    if (body) {
      var initialState = {
        listAPIUrl: "/api/getbooks",
        addAPIUrl: "/api/addBook",
        deleteAPIUrl: "/api/deleteBook",
        secret: secretConfig.secret,
        data: body.data,
        pollInterval: 2000
      }
      store = store.configureStore(initialState);
      match({routes: routes, location: req.url}, function(error, redirectLocation, renderProps) {
        if (error) {
          res.status(500).send(error.message)
        } else if (redirectLocation) {
          res.redirect(302, redirectLocation.pathname + redirectLocation.search)
        } else if (renderProps) {
          res.send("<!DOCTYPE html>"+
            ReactDOMServer.renderToString(
              Provider({store: store}, RouterContext(renderProps))
            )
          );
        } else {
          res.status(404).send('Not found')
        }
      })
    };
  });
})
.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});

function authenticate(req) {
  var secretConfig = readConfig(__dirname + '/resources/config/secret.json');
  var secret = req.body.secret;
  if (!secret || secret != secretConfig.secret) {
    res.status(500).send("Unauthorized Access.");
  }
}
