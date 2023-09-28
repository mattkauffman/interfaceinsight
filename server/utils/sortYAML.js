const sortObject = (obj, preferOrder) => {
    return Object.fromEntries(
        Object.entries(obj).sort((a, b) => {
            const [aKey, bKey] = [a[0], b[0]];
            if (preferOrder.includes(aKey) && preferOrder.includes(bKey)) {
                return preferOrder.indexOf(aKey) - preferOrder.indexOf(bKey);
            } else if (preferOrder.includes(aKey)) {
                return -1;
            } else if (preferOrder.includes(bKey)) {
                return 1;
            } else {
                return aKey.localeCompare(bKey);
            }
        })
    );
};

const sortYAML = (data, sortMethods, sortSchemas) => {
    const preferOrder = ['title', 'type', 'description'];
    if (sortMethods) {
        for (const path in data.paths) {
            data.paths[path] = sortObject(data.paths[path], []);
        }
    }

    if (sortSchemas) {
        if (data.components && data.components.schemas) {
            data.components.schemas = sortObject(data.components.schemas, []);
            for (const schema in data.components.schemas) {
                if (data.components.schemas[schema].properties) {
                    data.components.schemas[schema].properties = sortObject(data.components.schemas[schema].properties, []);
                    for (const property in data.components.schemas[schema].properties) {
                        if (typeof data.components.schemas[schema].properties[property] === 'object' && data.components.schemas[schema].properties[property] !== null) {
                            data.components.schemas[schema].properties[property] = sortObject(data.components.schemas[schema].properties[property], preferOrder);
                        }
                    }
                }
            }
        }
    }

    return data;
};

module.exports = sortYAML;
