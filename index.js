exports.topics = [{
  name: 'rediscloud',
  description: 'manages a rediscloud instance'
}];

exports.commands = [
  require('./lib/commands/redis/clear')
];
