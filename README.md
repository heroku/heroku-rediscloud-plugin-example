[![Build Status](https://travis-ci.org/heroku/heroku-rediscloud-plugin-example.svg?branch=master)](https://travis-ci.org/heroku/heroku-rediscloud-plugin-example)
[![npm version](https://badge.fury.io/js/heroku-rediscloud-plugin-example.svg)](http://badge.fury.io/js/heroku-rediscloud-plugin-example)

Heroku RedisCloud Plugin Example
================================

This is an example plugin to demonstrate how to build Heroku Toolbelt 4.0 plugins. For a simpler example, check out [heroku-hello-world](https://github.com/heroku/heroku-hello-world).

You can test this plugin by installing it:

```sh
$ heroku plugins:install heroku-rediscloud-plugin-example
$ heroku help rediscloud
```

Structure
=========

This plugin has a basic `index.js` that exports `topics` and `commands`:

```javascript
exports.topics = [{
  name: 'rediscloud',
  description: 'manages a rediscloud instance'
}];

exports.commands = [
  require('./lib/commands/redis/clear')
];
```

We then use node's require to pull in the clear command from `./lib/commands/redis/clear`:

```javascript
var url    = require('url');
var Heroku = require('heroku-client');
var redis  = require('redis');

module.exports = {
  topic: 'rediscloud',
  command: 'clear',
  description: 'clears out the data in the redis cloud instance (flushall)',
  help: "clears out the data in the redis cloud instance (flushall) \n\
Example:\n\n\
  $ heroku rediscloud:clear\n\
  cleared out all keys",
  needsApp: true,  // This command needs to be associated with an app (passed in the context argument)
  needsAuth: true, // This command needs an auth token to interact with the Heroku API (passed in the context argument)
  run: function (context) {

    // Get an authenticated API object
    var heroku = new Heroku({token: context.auth.password});

    // Get the config vars for the app
    heroku.apps(context.app).configVars().info(function (err, config) {
      if (err) { throw err; }
      if (!config.REDISCLOUD_URL) {
        console.error('App does not have REDISCLOUD_URL');
        process.exit(1);
      }

      // connect to the redis db
      var redisUrl = url.parse(config.REDISCLOUD_URL);
      var conn = redis.createClient(redisUrl.port, redisUrl.hostname, {
        auth_pass: redisUrl.auth.split(':')[1]
      });

      // flush the db (empties all keys)
      conn.flushall(function (err) {
        if (err) { throw err; }
        console.log('cleared out all keys');

        // cleanly close the redis connection
        conn.quit();
      });
    });
  },
};
```
