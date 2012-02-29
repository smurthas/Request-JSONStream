var StreamSplitter = require('json-stream-splitter');

function NonObjectError(nonObject) {
  this.name = 'NonObjectError'
  this.message = 'Tried to send something other than an object.'
  this.nonObject = nonObject;
}
NonObjectError.prototype = new Error();
NonObjectError.prototype.constructor = NonObjectError;


exports.createSendStream = function(req) {
  req.setHeader('content-type', 'application/jsonstream');
  return {
    sendObject: function(object) {
      if (!(object && object instanceof Object)) throw new NonObjectError(object);
      req.write(JSON.stringify(object) + '\n');
    }
  };
}