const express = require('express');
const bodyParser = require('body-parser');

const crudApi = require('./crud-api');

const { swaggerDoc } = require('./crud-swagger');
var swaggerUi = require('swagger-ui-express');

const app = express();

// parse requests
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const swaggerDocument = swaggerDoc('My API', 'Autogenerated API', '1.0');

const { FIELDS:testFields, table:testTable, auth:testAuth } = require('./test-table');
crudApi(app, './api', swaggerDocument, testTable, testFields, testAuth);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// default route
app.get('/', (req, res) => {
    res.json({ "message": "Welcome to ZeptoBook Product app" });
});

// listen on port 3000
app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});
