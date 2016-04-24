'use strict'
/* globals describe it */

require('chai').should()
var index = require('../index')

describe('rediscloud', function () {
  it('has a clear command', function () {
    index.commands[0].command.should.equal('clear')
  })

// TODO: add real tests
})
