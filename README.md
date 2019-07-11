# Create express app with CRUD API in seconds

Easy way to create express app with CRUD API &amp; swagger


1. Create model:
```javascript
    const field = require('./Field');
    FIELDS = [field({name:'a'}),field({name:'b'})];
```
2. Create initial swaggerDoc
```javascript
    const swaggerDocument = swaggerDoc('My API', 'Autogenerated API', '1.0');
```
3. Add api per table
```javascript
    crudApi(app, './api', swaggerDocument, 'my-table', FIELDS);
```
4. Use prepared swaggerDocument with swaggerUi
```javascript
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
```

This module uses
* swagger-ui-express - to show API docs
* [https://www.npmjs.com/package/nedb|nedb] - for data layer 
* express - to create express router
