#!/usr/bin/env node

var program = require('commander'),
    inquander = require('..'),
    _ = require('lodash');

program
    .version('0.0.1')
    .command('order [count]')
    .description('How many pizzas would you like to order?')
    .option('-p, --peppers', 'Add peppers')
    .option('-P, --pineapple', 'Add pineapple')
    .option('-b, --bbq', 'Add bbq sauce')
    .option('-c, --cheese [type]', 'Add the specified type of cheese [marble]', 'marble')
    .option('-C, --no-cheese', 'You do not want any cheese')
    .action(function(count, options) {
        console.log('You ordered', count, ' pizzas, with:');
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
    .command('pay')
    .action(function() {
        console.log('Please come again.');
    });

inquander.parse(program, process.argv, {
    message: 'Pizza pizza'
});
