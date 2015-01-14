var url    = require('url');
var Heroku = require('heroku-client');
var redis  = require('redis');

module.exports = {
  topic: 'rediscloud',
  command: 'set',
  description: '',
  help: '',
  needsApp: true,  // This command needs to be associated with an app (passed in the context argument)
  needsAuth: true, // This command needs an auth token to interact with the Heroku API (passed in the context argument)
  args: [{name: 'key'}, {name: 'value'}],
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

      console.log('setting key "' + context.args.key + '" ...');
      // sets the value
      conn.set(context.args.key, context.args.value, function (err) {
        if (err) { throw err; }
        console.log('set to value "' + context.args.value + '"');

        // cleanly close the redis connection
        conn.quit();
      });
    });
  },
};
