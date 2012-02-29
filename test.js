var express = require('express');
var expressStream = require('express-jsonstream');
var request = require('request');

var stream = require('./index');

// add express-jsonstream middleware
var app = express.createServer(expressStream());

// listen for GETs, write out some objects
app.get('/stream-get', function(req, res) {
  res.jsonStream({small:'world'});
  res.jsonStream({after:'all'});
  res.end();
});

// listen for POSTs, handle
app.post('/stream-post', function(req, res) {
  req.jsonStream(function(object) {
    console.error("got object from post", object);
    // put it in the database
  }, function(errs) {
    if (errs) console.error("post errs", errs);
    res.send('ok');
  });
});

app.listen(12345);

// GET some JSON out of the streaming endpoint
stream.recieveStream(request('http://localhost:12345/stream-get'), function(object) {
  console.error("got object", object);
}, function(errs) {
  if (errs) console.error("get errs", errs);
});

// POST some JSON back to the streaming endpoint
stream.createSendStream(request.post('http://localhost:12345/stream-post')).sendObject({hello:'world'});