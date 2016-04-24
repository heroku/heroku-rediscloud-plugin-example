'use strict'

const co = require('co')
const cli = require('heroku-cli-util')
const Redis = require('ioredis')

// this is the main entry point
// context is information from the CLI with the current app, auth token, arguments, etc.
// heroku is an already authenticated heroku-client instance https://www.npmjs.com/package/heroku-client
function * run (context, heroku) {
  let app = context.app
  let msg = `Clearing all keys on ${cli.color.configVar('REDISCLOUD_URL')} of ${cli.color.app(app)}`
  // displays msg and spinner
  yield cli.action(msg, co(function * () {
    // Get the config vars for the app
    let config = yield heroku.get(`/apps/${app}/config-vars`)
    if (!config.REDISCLOUD_URL) throw new Error('App does not have REDISCLOUD_URL')

    cli.action.warn('Connecting to redis over the public internet is not secure.')

    // connect to the redis db
    let redis = new Redis(config.REDISCLOUD_URL)

    yield redis.flushall()

    // cleanly close the redis connection
    redis.quit()
  }))
}

module.exports = {
  topic: 'rediscloud',
  command: 'clear',
  description: 'clears out the data in the redis cloud instance (flushall)',
  help: `clears out the data in the redis cloud instance (flushall)
  Example:

  $ heroku rediscloud:clear
  cleared out all keys`,
  needsApp: true, // This command needs to be associated with an app (passed in the context argument)
  needsAuth: true, // This command needs an auth token to interact with the Heroku API (passed in the context argument)

  run: cli.command(co.wrap(run))
}
