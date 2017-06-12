#!/usr/bin/env node

var program = require('commander'),
    inquander = require('..'),
    inquirer = require('inquirer')
    _ = require('lodash');

function list(val) {
  if(typeof val === "string"){
    return val.split(',');
  } else {
    return val;
  }
}

program
    .version('1.0.0')
    .command('order <size> <delivery>')
    .description('Order A Pizza')
    .option('-c, --cheese [type]', 'What type of cheese would you like? [Mozzarella]', 'Mozzarella')
    .option('-m, --meats <meats>', 'What meats would you like?', list)
    .option('-s, --special_requests <request>', 'Any special requests?')
    .action(function(size, delivery, options) {

        // Print Order
        console.log('You ordered a ' + size + ' pizza for ' + (delivery ? 'delivery' : 'pickup') + ':');

          // Cheese
          console.log(' Cheese: '+options.cheese);

          // Meats
          console.log(' Meats:');
          if(options.meats.length == 0){
            console.log('   None.')
          } else {
            _.each(options.meats, function(meat){
              console.log('  - '+meat);
            })
          }

          // Special Requests
          console.log(' Special Requests:');
          console.log('   '+options.special_requests);


        // Prompt for Payment
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
      .command('pay <creditcard> [notininquirer]')
      .description('Pay for my Order')
      .action(function(creditcard, notininquirer) {
        console.log("Your Credit Card #: " + creditcard);
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
        '--meats': {
          type: 'checkbox',
          name: '--meats',
          message: 'What meats would you like?',
          choices: ['Sausage', 'Pepperoni', 'Meatball']
        },
        '--special_requests': {
          type: 'editor',
          name: '--special_requests',
          message: 'Any special requests?'
        },
        'creditcard': {
            type: 'password',
            message: 'Credit Card #:'
        },
    }
});
