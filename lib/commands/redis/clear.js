var url    = require('url');
var Heroku = require('heroku-client');
var redis  = require('redis');

module.exports = {
  topic: 'rediscloud',
  command: 'clear',
  shortHelp: 'clears out the data in the redis cloud instance (flushall)',
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
