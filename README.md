# Curate

Curate makes it easy to quickly expose database queries to an express-api. It
also features a client component that makes it easy to consume those API
methods.


It works especially well with [modella](http://github.com/modella/modella) and
[chino](http://github.com/rschmukler/chino).

## Example


### configuration

`app.js`
    var app = express(),
        curate = require('curate');

    curate.app = app;
    curate.namespace = 'api/v1'


### exposing server methods

`user-model/server.js`

      var curate = require('curate'),
          db = require('mong')('localhost/db');

      var User = module.exports = function(attrs) {
        this.username = attrs.username;
        this.password = attrs.password;
        this.email = attrs.email;
      }

      User.allUsers = function(cb) {
        db.get('users').find({}, cb);
      }

      curate('users/all', User.allUsers);

You can now visit `http://localhost/api/v1/users/all` and get JSON of the users
returned by the `User.allUsers` query.

### consuming the API

Curate also provides easy consumption of the generated API.

`user-model/client.js`

    var curate = require('curate');

    var User = module.exports = function() {
    }

    User.allUsers = curate('users/all', User);


This maps the client-side User.allUsers to hit `/api/v1/users/all` and use the
resulting JSON in a callback. The resulting function has the same fingerprint as
the server-side function. It expects a `cb(err, results)` for its argument.

The second argument passes the JSON returned into a constructor. ie. Instead of
passing just JSON in, it will pass the JSON to the constructor to make
full-fledged objects.


### Filtering results

Sometimes you don't want the raw-db exposed to the client. For this, you can
specify the filter method in the `app.js`

For example:

    var app = express(),
        curate = require('curate');

    curate.app = app;
    curate.filterMethod = 'filter';

Now, if an instance has a method named `filter` it will call it and only pass
the results of that method into the exposed API.
