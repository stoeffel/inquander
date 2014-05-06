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
        me.argv[2] = answer.commandName;
        me.program.parse(me.argv);
    });
};

module.exports = new Inquander();
