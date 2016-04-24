# Heroku RedisCloud Plugin Example [![Circle CI](https://circleci.com/gh/heroku/heroku-rediscloud-plugin-example/tree/master.svg?style=svg)](https://circleci.com/gh/heroku/heroku-rediscloud-plugin-example/tree/master)

[![Code Climate](https://codeclimate.com/github/heroku/heroku-rediscloud-plugin-example/badges/gpa.svg)](https://codeclimate.com/github/heroku/heroku-rediscloud-plugin-example)
[![Test Coverage](https://codeclimate.com/github/heroku/heroku-rediscloud-plugin-example/badges/coverage.svg)](https://codeclimate.com/github/heroku/heroku-rediscloud-plugin-example/coverage)
[![npm version](https://badge.fury.io/js/heroku-rediscloud-plugin-example.svg)](http://badge.fury.io/js/heroku-rediscloud-plugin-example)
[![License](https://img.shields.io/github/license/heroku/heroku-rediscloud-plugin-example.svg)](https://github.com/heroku/heroku-rediscloud-plugin-example/blob/master/LICENSE)

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

This is an example plugin to demonstrate how to build Heroku CLI plugins. For a simpler example, check out [heroku-hello-world](https://github.com/heroku/heroku-hello-world).

You can test this plugin by installing it:

```sh
$ heroku plugins:install heroku-rediscloud-plugin-example
$ heroku help rediscloud
```

Structure
=========

This plugin has a basic `index.js` that exports `topics` and `commands`:

```javascript
exports.topics = {
  name: 'rediscloud',
  description: 'manages a rediscloud instance'
}

exports.commands = [
  require('./commands/clear'),
  require('./commands/get'),
  require('./commands/set')
]
```

We then use node's require to pull in the commands in [./commands](./commands). Each command outputs some metadata like help text, arguments, etc. Check the files out inside this repo to see more details.

Also check out the attributes set in [package.json](./package.json).
