#!/usr/bin/env node

var program = require('commander'),
    inquander = require('..'),
    inquirer = require('inquirer')
    _ = require('lodash');

program
    .version('1.0.0')
    .command('order <size> <delivery>')
    .description('Order A Pizza')
    .option('-c, --cheese [cheese]', 'Add the specified type of cheese [mozzarella]', 'mozzarella')
    .action(function(size, delivery, options) {
        console.log('You ordered a ' + size + ' pizza for ' + (delivery ? 'delivery' : 'pickup') + ':');

        if(program.usingInquirer){
          inquirer.prompt([{
            type: 'confirm',
            name: 'tip',
            message: 'Would you like to pay for your order now?',
            default: true
          }]).then(function(answers){
            if(answers.tip){
              inquander.runCommand('pay');
            }
          })
        }
    });

  program
      .command('pay [creditcard] [notininquirer]')
      .description('Pay for my Order')
      .action(function(count, pickup, options) {



      });

inquander.parse(program, process.argv, {
    message: 'Welcome to Inquander Pizza Co.  How can I help you?',
    defaultCommand: 'pay',
    hidden: ['notininquirer'],
    overrides: {
        'delivery': {
          type: 'confirm',
          name: 'delivery',
          message: 'Is this order for delivery?',
          default: true
        },
        'size': {
          type: 'list',
          name: 'size',
          message: 'What size would you like?',
          choices: ['small', 'medium', 'large', 'x-large']
        },
        'creditcard': {
            type: 'password'
        },
    }
});
