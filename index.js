var StreamSplitter = require('json-stream-splitter');

function RemnantError(remnant) {
  this.name = 'RemnantError'
  this.message = 'There was data remaining on a JSON stream.'
  this.remnant = remnant;
}
RemnantError.prototype = new Error();
RemnantError.prototype.constructor = RemnantError;

function NonObjectError(nonObject) {
  this.name = 'NonObjectError'
  this.message = 'Tried to send something other than an object.'
  this.nonObject = nonObject;
}
RemnantError.prototype = new Error();
RemnantError.prototype.constructor = RemnantError;


// req can be an http
exports.recieveStream = function(req, cbEach, cbDone) {
  var splitStream = StreamSplitter.splitStream(req);
  splitStream.on('object', cbEach);

  var errs = [];
  splitStream.on('error', errs.push);

  splitStream.on('end', function() {
    cbDone(errs.length === 0 ? undefined :errs);
  });
}

exports.createSendStream = function(req) {
  req.headers['content-type'] = 'application/jsonstream';
  return {
    sendObject: function(object) {
      if (!(object && object instanceof Object)) throw new NonObjectError(object);
      req.write(JSON.stringify(object) + '\n');
    }
  };
}