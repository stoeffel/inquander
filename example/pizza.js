#!/usr/bin/env node

var program = require('commander'),
    inquander = require('..'),
    _ = require('lodash');

program
    .version('0.0.1')
    .command('order [count] [pickup]')
    .description('Order a pizza.')
    .option('-p, --peppers', 'Add peppers')
    .option('-P, --pineapple', 'Add pineapple')
    .option('-b, --bbq', 'Add bbq sauce')
    .option('-c, --cheese [type]', 'Add the specified type of cheese [marble]', 'marble')
    .option('-C, --no-cheese', 'You do not want any cheese')
    .action(function(count, pickup, options) {
        console.log('You ordered', count, ' pizzas, with:');
        console.log(pickup);
        if (options.peppers) {
            console.log('Peppers');
        }
        if (options.pineapple) {
            console.log('Pineapple');
        }
        if (options.bbq) {
            console.log('Bbq');
        }
        if (_.isString(options.cheese)) {
            console.log('Cheese', options.cheese);
        }
        if (options.noCheese) {
            console.log('No-cheese');
        }
    });
program
    .command('pay [creditcard]')
    .action(function(creditcard) {
        console.log('Please come again.');
        console.log(creditcard);
    });
program
    .command('hello [name]')
    .action(function(name) {
        console.log('Hello', name);
    });

inquander.parse(program, process.argv, {
    message: 'Pizza pizza',
    defaultCommand: 'pay',
    overrides: {
        'creditcard': {
            type: 'password'
        },
        'pickup': {
            type: 'checkbox',
            choices: ['one', 'two']
        }
    }
});
