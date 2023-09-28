const yargs = require('yargs');
const fs = require('fs').promises;
const path = require('path');
const processFile = require('./processor');

const API_BASE_URL = 'http://localhost:3001';

yargs.command({
    command: 'upload',
    describe: 'Upload a file',
    builder: {
        file: {
            describe: 'Path to the file to upload',
            demandOption: true,
            type: 'string'
        },
        generateERD: {
            describe: 'Whether to generate ERD',
            type: 'boolean',
            default: false
        },
        sortMethods: {
            describe: 'Sort methods in the file',
            type: 'boolean',
            default: false
        },
        sortSchemas: {
            describe: 'Sort schemas in the file',
            type: 'boolean',
            default: false
        }
    },
    handler: async (argv) => {
        try {
            const fileContent = await fs.readFile(argv.file, 'utf-8');
            const originalFileName = path.parse(argv.file).name;

            const result = await processFile(fileContent, originalFileName, argv);

            console.log(`File processed successfully! Filename: ${result.filename}, Sorted Filename: ${result.sortedFileName}`);
        } catch (error) {
            console.error('Error processing file:', error.message);
        }
    }
});

yargs.parse();
