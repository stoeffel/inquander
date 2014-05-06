var _ = require('lodash'),
    CommandMapper;

CommandMapper = function(program) {
    this.program = program;
    this.commands = program.commands || [];
};

CommandMapper.prototype.hasNoArguments = function(argv) {
    return argv.length <= 2;
};

CommandMapper.prototype.mapCommands = function() {
    return _(this.commands).map(this.getCommandName, this).value();
};

CommandMapper.prototype.mapArguments = function(commandName) {
    var command = this.getCommand(commandName);
    return _.map(command._args, this.mapArgument) || [];
};

CommandMapper.prototype.mapArgument = function(argument) {
    return {
        name: argument.name,
        required: argument.required
    };
};

CommandMapper.prototype.mapOptions = function(commandName) {
    var command = this.getCommand(commandName);
    return _.map(command.options, this.mapOption) || [];
};

CommandMapper.prototype.mapOption = function(option) {
    return {
        name: option.long,
        description: option.description,
        required: option.required
    };
};

CommandMapper.prototype.getCommandName = function(command) {
    return command._name;
};

CommandMapper.prototype.getCommand = function(commandName) {
    return _.find(this.commands,{
        _name: commandName
    }) || {};
};

module.exports = CommandMapper;
