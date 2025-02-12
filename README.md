# Heroku RedisCloud Plugin Example 

**NOTE:** This plugin has been archived and is no longer maintained.

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
