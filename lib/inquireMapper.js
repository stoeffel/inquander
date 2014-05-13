var _ = require('lodash'),
    _s = require('underscore.string'),
    InquireMapper;

InquireMapper = function(commandMapper) {
    this.commandMapper = commandMapper;
};

InquireMapper.prototype.mapCommands = function() {
    return _.map(this.commandMapper.mapCommands(), this.mapCommand);

};

InquireMapper.prototype.mapCommand = function(command) {
    return {
        name: command.description || command.name,
        value: command.name
    };
};

InquireMapper.prototype.mapArguments = function(args) {
    return _.map(args, this.mapArgument);
};

InquireMapper.prototype.mapArgument = function(argument) {
    return {
        type: 'input',
        message: _s.capitalize(argument.name),
        name: argument.name,
        validate: function(value) {
            if (argument.required) {
                return value !== null && value !== '';
            } else {
                return true;
            }
        }
    };
};

InquireMapper.prototype.mapOptions = function(options) {
    return _.map(options, this.mapOption);
};

InquireMapper.prototype.mapOption = function(option) {
    return {
        type: (option.bool) ? 'confirm' : 'input',
        message: _s.capitalize(option.description.replace('--', '')) + '? (' + option.name + ')',
        name: option.name,
        default: option.default,
        validate: function(value) {
            if (option.required) {
                return value !== null && value !== '';
            } else {
                return true;
            }
        }
    };
};

module.exports = InquireMapper;
