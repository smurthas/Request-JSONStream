var express = require('express');
var expressStream = require('express-jsonstream');
var request = require('request');

var stream = require('./index');

// add express-jsonstream middleware
var app = express.createServer(expressStream());

// listen for POSTs, handle
app.post('/stream-post', function(req, res) {
  req.jsonStream()
  .on('object', console.log)
  .on('response', function(response) {
    if(response.statusCode !== 200) console.error('got non 200 response', response);
  })
  .on('error', console.error).on('end', function() {
    res.send('ok');
    process.exit(0);
  });
});

app.listen(12345);

var objs = [
  {small:'world'},
  {after:'all'}
]
// POST some JSON back to the streaming endpoint
var sendStream = stream.createSendStream(request.post('http://localhost:12345/stream-post'));
for(var i in objs) {
  sendStream.sendObject(objs[i]);
}