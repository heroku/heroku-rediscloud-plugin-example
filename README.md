[![Build Status](https://travis-ci.org/dickeyxxx/heroku-redis-cloud-plugin-example?branch=master)](https://travis-ci.org/dickeyxxx/heroku-redis-cloud-plugin-example)
[![npm version](https://badge.fury.io/js/heroku-redis-cloud-plugin-example.svg)](http://badge.fury.io/js/heroku-redis-cloud-plugin-example)

Example Redis Plugin Structure
==============================

Toolbelt 4.0 plugins are simple node modules that export a single JavaScript object `topics`. A basic plugin exporting the command `heroku apps:status` would have a basic `package.json` file such as the following:

```json
{
  "name": "heroku-production-check",
  "version": "0.0.2",
  "description": "Heroku plugin to check to see if a Heroku app is production ready",
  "main": "index.js",
  "author": "Jeff Dickey @dickeyxxx",
  "repository": {
    "type": "git",
    "url": "https://github.com/dickeyxxx/heroku-production-check"
  },
  "bugs": {
    "url": "https://github.com/dickeyxxx/heroku-production-check/issues"
  },
  "keywords": [
    "heroku-plugin"
  ],
  "license": "ISC",
  "scripts": {
    "test": "node test.js"
  },
  "dependencies": {
    "colors": "^1.0.3",
    "request": "^2.48.0"
  },
  "devDependencies": {
    "netrc": "^0.1.3"
  }
}
```

Including the keyword `heroku-plugin` will later help us find all plugins in the wild.

The `main` property specifies the file that should export the `topics` object. Here is an example of a simple `index.js` main entry point:

```javascript
var api = require('request').defaults({
  json: true,
  headers: { 'Accept': 'application/vnd.heroku+json; version=edge' }
})
var colors = require('colors')

exports.topics = [
  {
    name: 'apps',
    commands: [
      {
        name: 'status',
        shortHelp: 'get status of a production app',
        needsApp: true,
        needsAuth: true,
        help: "\
Get the status of a production app.\n\
\n\
Examples:\n\
  $ heroku heroku-production-check\n\
  Status: green",

        // Called with heroku heroku-production-check
        //   context: The Heroku context object which would be something like this:
        //            {
        //              "app": "shielded-chamber-4849",
        //              "auth": { "user": "username", "password": "theapitoken"},
        //              "args": {} // arguments passed
        //            }
        run: function (context) {
          api = api.defaults({auth: context.auth})
          api.get({
            uri: 'https://production-check-api.herokuapp.com/production-checks/'+context.app,
            auth: {user: "", password: context.auth.password},
            json: true
          }, function (err, _, checks) {
            if (err) { throw err }
            if (checks.message) { return console.error(checks.message) }
            Object.keys(checks).forEach(function (key) {
              printStatusCheck(checks[key])
            })
          })
        }
      }
    ]
  }
]

function printStatusCheck(check) {
  var color = colors.white
  switch (check.status) {
    case 'passed':
      color = colors.green
      icon = 'âœ“'
      break
    case 'failed':
      color = colors.red
      icon = 'âœ—'
      break
    case 'warning':
      color = colors.yellow
      icon = 'âš '
      break
    case 'skipped':
      color = colors.gray
      icon = 'â€¦'
      break
  }
  console.log('%s %s', check.title.yellow, color(icon))
  console.log('  %s\n', check.devCenterURL.underline)

  if (check.message) {
    console.log(color('  ' + check.message))
  }
  console.log()
}
```

Running Plugins
===============

When the CLI loads, it will run all the plugins in `~/.heroku/node_modules` checking for this `topics` object. For each one it will add the command to the existing command set.

    $ heroku apps:status
