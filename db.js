const Datastore = require('nedb');
const path = require('path');

const PATH_PREFIX = 'data'
const _db = {};

module.exports = (table) => {
    if(!_db[table]) {
        _db[table] = new Datastore({ filename: path.resolve(PATH_PREFIX, `${table}.nedb`), autoload: true });
    }
    return _db[table];
}
