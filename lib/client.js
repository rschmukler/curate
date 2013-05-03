var request = require('superagent');

var Curate = module.exports = function(methodString, Model) {
  var apiString = Curate.namespace ? '/' + Curate.namespace + '/' + methodString : '/' + methodString;
  return function(cb) {
    request
      .get(apiString)
      .set('Accept', 'application/json')
      .end(function(err, res) {
        if(err)
          cb(err, null);
        else {
          if(Model) {
            cb(null, Model(res.body));
          }
          else
            cb(null, res.body);
        }
      });
  };
};


Curate.namespace = undefined;
