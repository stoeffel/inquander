var inquirer = require('inquirer'),
    _ = require('lodash'),
    _s = require('underscore.string'),
    CommandMapper = require('./lib/commandMapper'),
    InquireMapper = require('./lib/inquireMapper'),
    Inquander;

Inquander = function() {};

Inquander.prototype.parse = function(program, argv, config) {
    config = config || {};
    this.program = program;
    this.argv = argv;
    this.message = config.message;
    this.defaultCommand = config.defaultCommand;
    this.commandMapper = new CommandMapper(program, config);

    if (this.commandMapper.hasNoArguments(this.argv)) {
        this.inquireMapper = new InquireMapper(this.commandMapper, config);
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
        default: this.defaultCommand,
        choices: this.inquireMapper.mapCommands()
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
    var questions = _.union(this.inquireMapper.mapArguments(this.args), this.inquireMapper.mapOptions(this.options)),
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


module.exports = new Inquander();
