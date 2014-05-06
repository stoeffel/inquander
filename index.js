var inquirer = require('inquirer'),
    _ = require('lodash'),
    CommandMapper = require('./lib/commandMapper'),
    Inquander;

Inquander = function() {
};

Inquander.prototype.parse = function(program, argv) {
    this.program = program;
    this.argv = argv;
    this.commandMapper = new CommandMapper(program);
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
        message: 'What would you like me to do?',
        name: 'commandName',
        default: 'create',
        choices: me.commandMapper.mapCommands()
    }], function(answer) {
        me.command = me.commandMapper.getCommand(answer.commandName);
        me.args = me.commandMapper.mapArguments(answer.commandName);
        me.options = me.commandMapper.mapOptions(answer.commandName);
        me.argv[2] = answer.commandName;
        if (me.args.length > 0 || me.options.length > 0) {
            this.askForArgs();
        } else {
            me.program.parse(me.argv);
        }
    });
};

Inquander.prototype.askForArgs = function() {
};

module.exports = new Inquander();
