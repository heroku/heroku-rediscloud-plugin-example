exports.topic = {
  name: 'rediscloud',
  description: 'manages a rediscloud instance'
}

exports.commands = [
  require('./commands/clear'),
  require('./commands/get'),
  require('./commands/set')
]
