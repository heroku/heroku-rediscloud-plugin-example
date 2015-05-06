exports.topics = [{
  name: 'rediscloud',
  description: 'manages a rediscloud instance'
}];

exports.commands = [
  require('./commands/redis/clear'),
  require('./commands/redis/get'),
  require('./commands/redis/set')
];
