'use strict';
let url    = require('url');
let h      = require('heroku-cli-util');
let redis  = require('redis');

module.exports = {
  topic: 'rediscloud',
  command: 'clear',
  description: 'clears out the data in the redis cloud instance (flushall)',
  help: `clears out the data in the redis cloud instance (flushall)
Example:

  $ heroku rediscloud:clear
  cleared out all keys`,
  needsApp: true,  // This command needs to be associated with an app (passed in the context argument)
  needsAuth: true, // This command needs an auth token to interact with the Heroku API (passed in the context argument)

  // this is the main entry point
  // context is information from the CLI with the current app, auth token, arguments, etc.
  // heroku is an already authenticated heroku-client instance https://www.npmjs.com/package/heroku-client
  run: h.command(function* (context, heroku) {
    // Get the config vars for the app
    let config = yield heroku.apps(context.app).configVars().info();
    if (!config.REDISCLOUD_URL) {
      h.error('App does not have REDISCLOUD_URL');
      process.exit(1);
    }

    // connect to the redis db
    let redisUrl = url.parse(config.REDISCLOUD_URL);
    let conn = redis.createClient(redisUrl.port, redisUrl.hostname, {
      auth_pass: redisUrl.auth.split(':')[1]
    });

    // flush the db (empties all keys)
    conn.flushall(function (err) {
      if (err) { throw err; }
      console.log('cleared out all keys');

      // cleanly close the redis connection
      conn.quit();
    });
  })
};
