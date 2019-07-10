# Create express app with CRUD API in seconds

Easy way to create express app with CRUD API &amp; swagger



1. Create model:

    const field = require('./Field');
    FIELDS = [field({name:'a'}),field({name:'b'})];

2. Create initial swaggerDoc

    const swaggerDocument = swaggerDoc('My API', 'Autogenerated API', '1.0');

3. Add api per table

    crudApi(app, './api', swaggerDocument, 'my-table', FIELDS);

4. Use prepared swaggerDocument with swaggerUi

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
