const fs = require('fs').promises;
const crypto = require('crypto');
const yaml = require('js-yaml');
const path = require('path');

const generateMarkdownERD = require('./utils/generateMarkdownERD');
const sortYAML = require('./utils/sortYAML');
const { generate } = require('node-plantuml');

const UPLOADS_DIR = './uploads';

function isTrue(value) {
    return value === true || value == 'true'; 
}

const processFile = async (fileContent, originalFileName, { generateERD, sortMethods, sortSchemas }) => {
    try {
        const randomFileName = `${originalFileName}_${crypto.randomBytes(4).toString('hex')}`;
        const sortedFilePath = `sorted_${randomFileName}`;
        let openapiData = yaml.load(fileContent);

        openapiData = sortYAML(openapiData, sortMethods, sortSchemas);

 
        if (isTrue(sortMethods) || isTrue(sortSchemas)) {
            await fs.writeFile(`${UPLOADS_DIR}/${sortedFilePath}.yaml`, yaml.dump(openapiData), 'utf-8');
        }

        if (isTrue(generateERD)) {
            const umlString = generateMarkdownERD(openapiData);
            await fs.writeFile(`${UPLOADS_DIR}/${randomFileName}.uml`, umlString);
        }

        return {
            filename: randomFileName,
            sortedFileName: `${sortedFilePath}.yaml`
        };
    } catch (error) {
        throw error;
    }
};

module.exports = processFile;
