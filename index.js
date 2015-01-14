exports.topics = [{
  name: 'rediscloud',
  description: 'manages a rediscloud instance'
}];

exports.commands = [
  require('./lib/commands/redis/clear'),
  require('./lib/commands/redis/get'),
  require('./lib/commands/redis/set')
];
