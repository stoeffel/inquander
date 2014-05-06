var should = require('should'),
    CommandMapper = require('../lib/commandMapper');

describe('commandMapper', function() {
    var commandMapper, commandMapperNoCommands;
    beforeEach(function() {
        var program = {
            commands: [{
                _name: 'foo',
                _args: [{
                    name: 'title',
                    required: true
                }, {
                    name: 'description',
                    required: false
                }],
                options: [{
                    long: '--option',
                    description: 'desc',
                    required: true
                }]
            }, {
                _name: 'bar',
                _args: []
            }]
        },
            programNoCommands = {
                commands: []
            };
        commandMapperNoCommands = new CommandMapper(programNoCommands);
        commandMapper = new CommandMapper(program);
    });

    describe('#hasNoArguments', function() {
        it('should return true if only node and command given', function() {
            return commandMapper.hasNoArguments(['node', 'command']).should.be.ok;
        });

        it('should return false if any argument is given', function() {
            return commandMapper.hasNoArguments(['node', 'command', '--an', 'argument']).should.be.not.ok;
        });
    });

    describe('#mapCommands', function() {
        it('shoud return a array with the command names', function() {
            commandMapper.mapCommands().should.be.eql(['foo', 'bar']);
        });

        it('should return an empty array if no commands are given', function() {
            commandMapperNoCommands.mapCommands().should.be.eql([]);
        });
    });

    describe('#mapArguments', function() {
        it('should return an array of all arguments of a command', function() {
            commandMapper.mapArguments('foo').should.be.eql([{
                name: 'title',
                required: true
            }, {
                name: 'description',
                required: false
            }]);
        });

        it('should return an empty array if no arguments for the command are given', function() {
            commandMapper.mapArguments('bar').should.be.eql([]);
        });
    });

    describe('#mapOptions', function() {
        it('should return an array of all options, if any are given.', function() {
            commandMapper.mapOptions('foo').should.be.eql([{
                name: '--option',
                description: 'desc',
                required: true
            }]);
        });
    });
});
