'use strict';
let url    = require('url');
let redis  = require('redis');
let h      = require('heroku-cli-util');

module.exports = {
  topic: 'rediscloud',
  command: 'set',
  description: '',
  help: '',
  needsApp: true,  // This command needs to be associated with an app (passed in the context argument)
  needsAuth: true, // This command needs an auth token to interact with the Heroku API (passed in the context argument)
  args: [{name: 'key'}, {name: 'value'}],

  // this is the main entry point
  // context is information from the CLI with the current app, auth token, arguments, etc.
  // heroku is an already authenticated heroku-client instance https://www.npmjs.com/package/heroku-client
  run: h.command(function* (context, heroku) {
    // Get the config vars for the app
    let config = yield heroku.apps(context.app).configVars().info();
    if (!config.REDISCLOUD_URL) {
      console.error('App does not have REDISCLOUD_URL');
      process.exit(1);
    }

    // connect to the redis db
    let redisUrl = url.parse(config.REDISCLOUD_URL);
    let conn = redis.createClient(redisUrl.port, redisUrl.hostname, {
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
  })
};
