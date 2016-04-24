'use strict'

const co = require('co')
const cli = require('heroku-cli-util')
const Redis = require('ioredis')

// this is the main entry point
// context is information from the CLI with the current app, auth token, arguments, etc.
// heroku is an already authenticated heroku-client instance https://www.npmjs.com/package/heroku-client
function * run (context, heroku) {
  // Get the config vars for the app
  // this uses co to wait for the promise to complete
  let config = yield heroku.apps(context.app).configVars().info()
  if (!config.REDISCLOUD_URL) throw new Error('App does not have REDISCLOUD_URL')

  cli.action.warn('Connecting to redis over the public internet is not secure.')

  // connect to the redis db
  let redis = new Redis(config.REDISCLOUD_URL)

  let key = context.args.key
  let value
  yield cli.action(`getting ${cli.color.green(key)}`, co(function * () {
    // gets the value at the key
    value = yield redis.get(context.args.key)
  }))

  cli.log('the value is: ' + cli.color.magenta(value))

  // cleanly close the redis connection
  redis.quit()
}

module.exports = {
  topic: 'rediscloud',
  command: 'get',
  description: 'gets a value out of the rediscloud db',
  help: '',
  needsApp: true, // This command needs to be associated with an app (passed in the context argument)
  needsAuth: true, // This command needs an auth token to interact with the Heroku API (passed in the context argument)
  args: [{name: 'key'}],

  run: cli.command(co.wrap(run))
}
