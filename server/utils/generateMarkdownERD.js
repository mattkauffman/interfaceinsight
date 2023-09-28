const THEME_FILE_INCLUDE = '!include ./themes/puml-theme-carbon-grey.puml\n';

const generateMarkdownERD = (openapiData) => {
    let uml = `@startuml\n${THEME_FILE_INCLUDE}`;
    let relationships = '';

    uml += 'package "API Endpoints" {\n';
    for (const path in openapiData.paths) {
        for (const method in openapiData.paths[path]) {
            const endpointData = openapiData.paths[path][method];
            const className = `${method.toUpperCase()} ${path}`;
            uml += `class "${className}" {\n`;

            if (endpointData.description) {
                uml += `  Description: ${endpointData.description}\n`;
            }

            if (endpointData.responses) {
                for (const statusCode in endpointData.responses) {
                    const response = endpointData.responses[statusCode];
                    const schemaRef = response.content && response.content['application/json'] && response.content['application/json'].schema && response.content['application/json'].schema['$ref'] ? response.content['application/json'].schema['$ref'].split('/').pop() : null;
                    if (schemaRef) {
                        uml += `  Response: ${statusCode} - ${schemaRef}\n`;
                        relationships += `  "${className}" --> "${schemaRef}" : Returns\n`;
                    }
                }
            }
            uml += "}\n";
        }
    }
    uml += '}\n';
    uml += 'package "API Schemas" {\n';
    if (openapiData.components && openapiData.components.schemas) {
        for (const entity in openapiData.components.schemas) {
            const schema = openapiData.components.schemas[entity];
            if (schema.type === 'object' && schema.properties) {
                uml += `class "${entity}" {\n`;
                for (const property in schema.properties) {
                    const propDetails = schema.properties[property];
                    const type = propDetails.type || 'any';
                    uml += `  ${property} : ${type}\n`;
                    if (propDetails['$ref']) {
                        const relatedEntity = propDetails['$ref'].split('/').pop();
                        relationships += `  "${entity}" --> "${relatedEntity}" : ${property}\n`;
                    }
                }
                uml += "}\n";
            }
        }
    }
    uml += '}\n';
    uml += relationships;
    uml += '@enduml\n';
    return uml;
};

module.exports = generateMarkdownERD;
