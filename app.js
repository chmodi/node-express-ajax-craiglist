
/**
 * Module dependencies.
 */

var express = require('express');
var request = require('request');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

//app.get('/', routes.index);

//app.get('/', function(req, res) {res.render('index')});

app.get('/searching', function(req, res){
	// input value from search
 var val = req.query.search;
 
var url = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20craigslist.search" +
"%20where%20location%3D%22sfbay%22%20and%20type%3D%22jjj%22%20and%20query%3D%22" + val + "%22&format=" +
"json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";

request(url, function(err, resp, body) {
 body = JSON.parse(body);
 // logic used to compare search results with the input from user
  if (!body.query.results.RDF.item) {
   craig = "No results found. Try again.";
 } else {
  craig = body.query.results.RDF.item[0]['about'];
 }
 // pass back the results to client side
 res.send(craig);
});

});

app.get('/', function(req, res) {res.render('index')});

app.listen(3001, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
