inquander
=========

Inquirer for commander.
This module takes two awesome modules and connects them.

If no arguments and options are passed to your [commander](https://github.com/visionmedia/commander.js) app, it runs [inquirer](https://github.com/SBoudrias/Inquirer.js). For all commands, arguments and options defined in your commander app.

If you call your module with arguments it acts like a normal commander tool.
![call with arguments](https://raw.githubusercontent.com/stoeffel/inquander/master/example/call_as_commander.png)

But if you call it without any arguments or commands it will parse your definitions and runs it using inquirer.
![call without arguments](https://raw.githubusercontent.com/stoeffel/inquander/master/example/call_as_inquirer.png)

Features
--------

* lists commands
* requests input for arguments
* asks for options
* override inquirer definition of arguments and options 
* custom message
* specifiy default command

Usage
-----

Instead of calling programm.parse you need to call inquander.parse.

```Javascript
var program = require('commander'),
    inquander = require('inquander');

program
    .command('hello [name]')
    .action(function(name) {
        console.log('Hello', name);
    });
program
    .command('pay [creditcard]')
    .action(function(creditcard) {
        console.log('Please come again.');
        console.log(creditcard);
    });

inquander.parse(program, process.argv);
```

You can override the defintion of a argument or a option for inquirer.

```Javascript
inquander.parse(program, process.argv, {
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
```

For more examples take a look into the example folder.
