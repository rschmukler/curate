var request = require('superagent');

var Curate = module.exports = function(methodString, Model) {
  var apiString = Curate.namespace ? '/' + Curate.namespace + '/' + methodString : '/' + methodString;
  var matches = apiString.match(/(:\w+)/g);
  return function(args, cb) {
    var qs = apiString.slice(0);
    for(var i = 0; i < matches.length; ++i) {
      var match = matches[i];
      qs = qs.replace(match, args[match.slice(1)]);
    }
    request
      .get(qs)
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
