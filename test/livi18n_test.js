'use strict';

var parser = require('../lib/parser.js');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports['translate'] = {
  setUp: function(done) {
    //setup
    done();
  },
  'no args': function(test) {
    test.expect(1);
    // tests here
    test.equal(parser.translate({test: ':name tested with successfully!'}, 'test', {name: 'translate'}), 'translate tested with successfully!', 'should be equal to translate tested with successfully!.');
    test.done();
  },
};

exports['pluralize'] = {
  setUp: function(done) {
    //setup
    done();
  },
  'no args': function(test) {
    test.expect(1);
    // tests here
    test.equal(parser.pluralize({test: ':name have :&: iPhone||:name have :&: iPhones'}, 'test', {name: 'pluralize'}, 10), 'pluralize have 10 iPhones', 'should be equal to pluralize have 10 iPhones.');
    test.done();
  },
};
