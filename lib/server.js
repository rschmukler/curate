var Curate = module.exports = function() {
  var args = Array.prototype.slice.call(arguments),
      path = args.shift(),
      method = args.pop(),
      obj;

  if(typeof args[0] == 'object')
    obj = args.shift();


  var baseString = '/';
  if(Curate.namespace) {
    baseString += Curate.namespace + '/';
  }
  urlString = baseString + path;

  args.unshift(urlString);
  args.push(handleMethod(method, obj));
  if(Curate.app)
    Curate.app.get.apply(Curate.app, args);
};

Curate.namespace = undefined;
Curate.filterMethod = undefined;
Curate.app = undefined;

function handleMethod(method, obj) {
  return function(req, res, next) {
    var params = makeObj(req, res, obj);
    method(params, function(err, result) {
      if(err)
        next(err);
      else
        res.send(filterResults(result));
    });
  };
}

function makeObj(req, res, obj) {
  var results = {};
  for(var key in req.params) {
    results[key] = req.params[key];
  }
  for(key in obj) {
    if(/req\.\w+$/.test(obj[key]))
      results[key] = req[obj[key].slice(4)];
    else if(/res\.\w+$/.test(obj[key]))
      results[key] = res[obj[key].slice(4)];
    else
      results[key] = obj[key];
  }
  return results;
}

function filterResults(results) {
  if(Curate.filterMethod) {
    if(Array.isArray(results)) {
      return results.map(filterObject);
    } else {
      return filterObject(results);
    }
  }

  function filterObject(obj) {
    return obj[Curate.filterMethod] ? obj[Curate.filterMethod]() : obj;
  }
}
