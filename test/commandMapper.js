var should = require('should'),
    CommandMapper = require('../lib/commandMapper');

describe('commandMapper', function() {
    var commandMapper, commandMapperNoCommands, commandMapperFiltered;
    beforeEach(function() {
        var program = {
            commands: [{
                _name: 'foo',
                _description: 'desc',
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
                _description: 'desc',
                _args: []
            }]
        },
            programNoCommands = {
                commands: []
            };
        commandMapperNoCommands = new CommandMapper(programNoCommands);
        commandMapper = new CommandMapper(program);
        commandMapperFiltered = new CommandMapper(program, {
            commandFilter: function(command) {
                return command === 'bar';
            }
        });
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
            commandMapper.mapCommands().should.be.eql([{
                name: 'foo',
                description: 'desc'
            }, {
                name: 'bar',
                description: 'desc'
            }]);
        });

        it('should return an empty array if no commands are given', function() {
            commandMapperNoCommands.mapCommands().should.be.eql([]);
        });

        it('should filter commands if a commandFilter function is given', function() {
            commandMapperFiltered.mapCommands().should.be.eql([{
                name: 'bar',
                description: 'desc'
            }]);
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
                bool: false,
                name: '--option',
                description: 'desc',
                required: true,
                default: undefined
            }]);
        });
    });
});
