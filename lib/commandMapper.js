var _ = require('lodash'),
    CommandMapper;

CommandMapper = function(program, config) {
    config = config || {};
    this.program = program;
    this.commands = program.commands || [];
    this.commandFilter = config.commandFilter;
};

CommandMapper.prototype.hasNoArguments = function(argv) {
    return argv.length <= 2;
};

CommandMapper.prototype.mapCommands = function() {
    var commands = _(this.commands).map(this.getCommandName, this).value();
    if (this.commandFilter) {
        commands = _.filter(commands, this.commandFilter);
    }
    return commands;
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
    return _.map(command.options, this.mapOption, this) || [];
};

CommandMapper.prototype.mapOption = function(option) {
    return {
        name: option.long,
        bool: this.isBool(option),
        description: option.description,
        required: !!option.required,
        default: this.getDefault(option)
    };
};

CommandMapper.prototype.isBool = function(option) {
    return (option.bool && !option.required && !option.optional) || option.long.indexOf('-no-') >= 0;
};

CommandMapper.prototype.getDefault = function(option) {
    if (option.long.indexOf('-no-') >= 0) {
        return false;
    }
    return undefined;
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
