module.exports = {
    swaggerDoc: (title, description, version) => {
        return {
            "swagger": "2.0",
            "info": { title, description, version },
            "definitions": {},
            "produces": ["application/json"],
            "paths": {}
        };
    },
    addTable: (doc, apiPrefix, table, fields) => {
        doc.definitions[table] = {}
        const required = fields.filter((f) => { return f.mandatory });
        if (required.length > 0) {
            doc.definitions[table].required = required.map(f => f.name);
        }
        doc.definitions[table].properties = {
            _id: { 'type': 'string' }
        };
        fields.forEach((f) => {
            doc.definitions[table].properties[f.name] = { type: f.type || 'string' }; // TODO: add type to field
        });

        const opt = {
            tags: [table],
            parameters: [],
            responses: {}
        }

      
        const insertParams = fields.map((f) => { 
            return {
                'name': f.name,
                'in': 'formData',
                'required': !!f.mandatory,
                'description': f.label,
                'type': f.type || 'string'
            }
        });


        doc.paths[`${apiPrefix}/${table}`] = {
            post: Object.assign({}, opt, { parameters: insertParams, responses: { 200: { 'description': `New inserted ${table}`, 'schema': { '$ref': `#/definitions/${table}` } } } }),
            get: Object.assign({}, opt, {
                responses: {
                    200: {
                        'description': `All ${table}s`, 'schema': {
                            'type': 'array',
                            items: { '$ref': `#/definitions/${table}` }
                        }
                    }
                }
            })
        }

        const parameters = [{
            'name': 'id',
            'in': 'path',
            'required': true,
            'description': 'Id',
            'type': 'string'
        }]

        const updateParams = parameters.concat(fields.map((f) => { 
            return {
                'name': f.name,
                'in': 'formData',
                'required': false,
                'description': f.label,
                'type': f.type || 'string'
            }
        }));

        doc.paths[`${apiPrefix}/${table}/{id}`] = {
            put: Object.assign({}, opt, { parameters: updateParams, responses: { 200: { 'description': `Updated ${table}`, 'schema': { '$ref': `#/definitions/${table}` } } } }),
            get: Object.assign({}, opt, { parameters, responses: { 200: { 'description': `The ${table} with Id`, 'schema': { '$ref': `#/definitions/${table}` } } } }),
            delete: Object.assign({}, opt, { parameters, responses: { 200: { 'description': 'Empty object', 'schema': {} } } })
        }
    }
}

