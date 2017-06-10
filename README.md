inquander
=========

Inquirer for commander.
This module takes two awesome modules and connects them.

If no arguments and options are passed to your [commander](https://github.com/visionmedia/commander.js) app, it runs [inquirer](https://github.com/SBoudrias/Inquirer.js). For all commands, arguments and options defined in your commander app.

If you call your module with arguments it acts like a normal commander tool.
![call with arguments](https://raw.githubusercontent.com/stoeffel/inquander/master/example/call_as_commander.png)

But if you call it without any arguments or commands it will parse your definitions and runs it using inquirer.
![call without arguments](https://raw.githubusercontent.com/stoeffel/inquander/master/example/call_as_inquirer.png)


Usage
-----

Instead of calling program.parse you need to call inquander.parse.

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

Options
-----

### Message and Default Command
The root message and default command options define the inquirer root behavior:
```Javascript
inquander.parse(program, process.argv, {
    message: 'Little Caesar\'s Pizza Ordering',
    defaultCommand: 'pay'
});
```

#### Type Overrides
The commander api doesn't identify special types (password, list, editor, etc).
So to specify field types specifically for inquirer, use the overrides option:

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

#### Hidden Fields
To hide a field from the interactive view, use the hidden option:
```Javascript
inquander.parse(program, process.argv, {
    hidden: ['notininquirer']
});
```

##### For more examples take a look into the example folder.


Advanced
-----

#### Run Command
`Inquander.runCommand(<COMMAND>)` allows you to manually trigger a generated
command.

#### Detecting Interactive Mode
To enable different behavior for interactive and non-interactive modes,
inquander defines a flag in `program.usingInquirer` which indicates
whether inquander is using inquirer or commander.
