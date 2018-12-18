const {startServer} = require('./server');
const args = require('yargs')
    .option('target', {
        alias: 't',
        required: true
    })
    .option('port', {
        alias: 'p',
        required: true
    })
    .argv;

startServer(args.target, args.port);
