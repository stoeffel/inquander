var inquirer = require('inquirer'),
    _ = require('lodash'),
    _s = require('underscore.string'),
    CommandMapper = require('./lib/commandMapper'),
    Inquander;

Inquander = function() {};

Inquander.prototype.parse = function(program, argv, config) {
    config = config || {};
    this.program = program;
    this.argv = argv;
    this.message = config.message;
    this.commandMapper = new CommandMapper(program, config);
    if (this.commandMapper.hasNoArguments(this.argv)) {
        this.askForCommand();
    } else {
        program.parse(argv);
    }
};

Inquander.prototype.askForCommand = function() {
    var me = this;
    inquirer.prompt([{
        type: 'list',
        message: me.message || 'What would you like me to do?',
        name: 'commandName',
        default: 'create',
        choices: me.commandMapper.mapCommands()
    }], function(answer) {
        me.command = me.commandMapper.getCommand(answer.commandName);
        me.args = me.commandMapper.mapArguments(answer.commandName);
        me.options = me.commandMapper.mapOptions(answer.commandName);
        me.argv[2] = answer.commandName;
        if (me.hasArgs()) {
            me.askForArgs();
        } else {
            me.program.parse(me.argv);
        }
    });
};

Inquander.prototype.hasArgs = function() {
    return this.args.length > 0 || this.options.length > 0;
};

Inquander.prototype.askForArgs = function() {
    var questions = _.union(this.mapArgs(), this.mapOptions()),
        me = this;
    questions = _.compact(questions);
    inquirer.prompt(questions, function(answers) {
        answers = _(answers).map(function(value, key) {
            if (_s.startsWith(key, '--')) {
                if (_.isBoolean(value)) {
                    if (value) {
                        return key;
                    }
                } else {
                    return [key, value];
                }
            } else {
                return value;
            }
        }).flatten().compact().value();
        me.argv = _.union(me.argv, answers);
        me.program.parse(me.argv);
    });
};

Inquander.prototype.mapArgs = function() {
    return _.map(this.args, function(arg) {
        return {
            type: 'input',
            message: _s.capitalize(arg.name),
            name: arg.name,
            validate: function(value) {
                if (arg.required) {
                    return value !== null && value !== '';
                } else {
                    return true;
                }
            }
        };
    });
};

Inquander.prototype.mapOptions = function() {
    return _.map(this.options, function(option) {
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
    });
};

module.exports = new Inquander();
