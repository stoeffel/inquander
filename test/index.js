var should = require('should'),
    inquander = require('../lib/index');

describe('inquander', function() {
    describe('#hasNoArguments', function() {
        it('should return true if only node and command given', function() {
            return inquander.hasNoArguments(['node', 'command']).should.be.ok;
        });

        it('should return false if any argument is given', function() {
            return inquander.hasNoArguments(['node', 'command', '--an', 'argument']).should.be.not.ok;
        });
    });

    describe('#mapCommands', function() {
        it.skip('', function() {});
    });

    describe('#mapArguments', function() {
        it.skip('', function() {});
    });

    describe('#mapOptions', function() {
        it.skip('', function() {});
    });

    describe('#parse', function() {
        it.skip('', function() {});
    });
});
