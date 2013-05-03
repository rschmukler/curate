var Curate = module.exports = function(path, method) {
  var baseString = '/';
  if(Curate.namespace) {
    baseString += Curate.namespace + '/';
  }
  urlString = baseString + path;

  console.log("Adding route to: " + urlString);
  Curate.app.get(urlString, handleMethod(method));
};

Curate.namespace = undefined;
Curate.filterMethod = undefined;
Curate.app = undefined;

function handleMethod(method) {
  return function(req, res, next) {
    method(req.query, function(err, result) {
      if(err)
        next(err);
      else
        res.send(filterResults(result));
    });
  };
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
