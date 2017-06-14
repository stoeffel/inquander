var inquirer = require('inquirer'),
    _ = require('lodash'),
    _s = require('underscore.string'),
    Promise = require('bluebird'),
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
    this.overrides = config.overrides || {};
    this.hidden = config.hidden || {};
    this.commandMapper = new CommandMapper(program, config);

    if (this.commandMapper.hasNoArguments(this.argv)) {
        program.usingInquirer = true;
        this.inquireMapper = new InquireMapper(this.commandMapper, config);
        this.askForCommand();
    } else {
        program.usingInquirer = false;
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
    }]).then(function(answer){
      me.runCommand(answer.commandName);
    });
};

Inquander.prototype.runCommand = function(commandName){
  this.command = this.commandMapper.getCommand(commandName);
  this.args = this.commandMapper.mapArguments(commandName);
  this.options = this.commandMapper.mapOptions(commandName);
  this.argv = this.argv.slice(0,2);
  this.argv[2] = commandName;
  if (this.hasArgs()) {
      this.askForArgs();
  } else {
      this.program.parse(this.argv);
  }
}

Inquander.prototype.hasArgs = function() {
    return this.args.length > 0 || this.options.length > 0;
};

Inquander.prototype.askForArgs = function() {
    var questions = _.union(this.inquireMapper.mapArguments(this.args), this.inquireMapper.mapOptions(this.options)),
        me = this;
    this.overrideQuestions(questions)
        .then(function(questions_res){
          return inquirer.prompt(questions_res);
        })
        .then(function(answers) {
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
                      if (_.isArray(value)) {
                          value = value.join(',');
                      }
                      return value;
                  }
              }).flatten().compact().value();
        me.argv = _.union(me.argv, answers);
        me.program.parse(me.argv);
    });
};

Inquander.prototype.overrideQuestions = function(questions) {
    var me = this;

    return Promise.map(questions, function(question) {
        var override = me.overrides[question.name];

        // Check if Undefined
        if(typeof override === "undefined"){
            return null;
        }

        // Check if Hidden
        else if (_.includes(me.hidden, question.name)) {
            return null;
        }

        // Resolve Promises
        return Promise.props(override)
                       .then(function(override_res){
                         return _.merge(question, override_res);
                       });
    })
    .then(function(res){
      return _.compact(res);
    });
};

module.exports = new Inquander();
