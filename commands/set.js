'use strict'

const cli = require('heroku-cli-util')
const Redis = require('ioredis')
const co = require('co')

// this is the main entry point
// context is information from the CLI with the current app, auth token, arguments, etc.
// heroku is an already authenticated heroku-client instance https://www.npmjs.com/package/heroku-client
function * run (context, heroku) {
  // Get the config vars for the app
  let config = yield heroku.apps(context.app).configVars().info()
  if (!config.REDISCLOUD_URL) {
    cli.error('App does not have REDISCLOUD_URL')
    process.exit(1)
  }

  cli.action.warn('Connecting to redis over the public internet is not secure.')

  // connect to the redis db
  let redis = new Redis(config.REDISCLOUD_URL)

  let key = context.args.key
  let value = context.args.value

  yield cli.action(`setting key ${cli.color.green(key)} to ${cli.color.magenta(value)}`, co(function * () {
    // sets the value
    yield redis.set(key, value)
  }))
  redis.quit()
}

module.exports = {
  topic: 'rediscloud',
  command: 'set',
  description: '',
  help: '',
  needsApp: true, // This command needs to be associated with an app (passed in the context argument)
  needsAuth: true, // This command needs an auth token to interact with the Heroku API (passed in the context argument)
  args: [{name: 'key'}, {name: 'value'}],
  run: cli.command(co.wrap(run))
}
