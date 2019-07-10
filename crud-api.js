const { addTable } = require('./crud-swagger');
const crud = require('./crud-router');
const ALLOW = require('./CrudAuth').allow();

module.exports = (app, prefix, swaggerDocument, table, FIELDS, crudAuth = ALLOW) => {
    addTable(swaggerDocument, prefix, table, FIELDS);
    const router = crud(table, FIELDS, crudAuth );
    app.use(`${prefix}/${table}`, router);
}

