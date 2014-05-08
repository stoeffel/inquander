var should = require('should'),
    InquireMapper = require('../lib/inquireMapper');

describe('inquireMapper', function() {
    var inquireMapper;
    beforeEach(function() {
        var commandMapperFake = {
            mapCommands : function() {
                return [{
                    name: 'foo',
                    description: 'bar'
                }];
            }
        };
        inquireMapper = new InquireMapper(commandMapperFake);
    });

    describe('#mapCommands', function() {
        it('should return an array off choices', function() {
            return inquireMapper.mapCommands().should.be.eql([{
                value: 'foo',
                name: 'bar'
            }]);
        });
    });
});
