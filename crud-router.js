var express = require('express')
const db = require('./db');
const crudCheck = require('./CrudAuth').check;

/**
 * Returns express.router for a table
 * 
 * - POST /table/     - insert
 * - PUT  /table/:id  - update by id
 * - GET  /table/     - get all. // TODO: Paginated query: [ord, dir, page, sz] defaults: ord = _id, dir = desc, page = 0, sz = (page||ord||dir) ? 10 : infinity 
 * - GET  /table/:id  - get one doc by id
 * - DELETE  /table/:id  - delete one doc by id
 * 
 * @param {string} table - table name used in file system, don't use spatial chars
 * @param {array} fields - Array of Field
 * @param {object} crudAuth - CrudAuth object (use allow or deny with custom functions )
 */
module.exports = (table, fields, crudAuth) => {
    if(!crudAuth || !crudCheck(crudAuth)) {
        throw 'Bad crudAuth object';
    }
    const router = express.Router()
    const f2f = {};
    fields.forEach((f) => {
        if(f2f[f.name] !== undefined) {
            throw `Duplicate field name ${f}`;
        }
        f2f[f.name] = f;
    })

    router.post('/', (req, res) => {
        if(!crudAuth.canCreate(req)) {
            return res.status(403).send({
                message: `Insert into table:${table} - forbiden`
            });
        }
        if (!req.body) {
            return res.status(400).send({
                message: "Object content can not be empty"
            });
        }
        const newObj = {};
        for (let i = 0; i < fields.length; i++) {
            const f = fields[i];
            if (req.body[f.name]) {
                newObj[f.name] = f.s2o ? f.s2o(req.body[f.name]) : req.body[f.name];
            } else if (f.defval !== undefined) {
                newObj[f.name] = f.s2o ? f.s2o(f.defval) : f.defval;
            } else if (f.mandatory) {
                res.status(500).send({
                    message: "Missing field " + f.name
                });
                return;
            }
        }

        db(table).insert(newObj, (err, docs) => {
            if (!err) {
                res.send(docs);
            } else {
                res.status(500).send({
                    message: err.message || "Something wrong while creating object."
                });
            }
        });

    });

    router.get('/', (req, res) => {
        if(!crudAuth.canFindAll(req)) {
            return res.status(403).send({
                message: "Forbiden to query objects"
            });
        }
        db(table).find({}, (err, docs) => {
            if (!err) {
                res.send(docs);
            } else {
                res.status(500).send({
                    message: err.message || "Something wrong while retrieving objects."
                });
            }
        });
    });

    router.get('/:id', (req, res) => {
        if(!crudAuth.canFindOne(req)) {
            return res.status(403).send({
                message: "Forbiden to query objects"
            });
        }
        const _id = req.params.id;
        db(table).find({ _id }, (err, docs) => {
            if (!err) {
                if (!docs || docs.length === 0) {
                    return res.status(404).send({
                        message: "Object not found with id " + _id
                    });
                }
                res.send(docs[0]);
            } else {
                return res.status(500).send({
                    message: "Something wrong retrieving object with id " + _id
                });
            }
        });
    });

    router.put('/:id', (req, res) => {
        if(!crudAuth.canUpdate(req)) {
            return res.status(403).send({
                message: "Forbiden to update objects"
            });
        }
        // Validate Request
        if (!req.body) {
            return res.status(400).send({
                message: "Product content can not be empty"
            });
        }
        const _id = req.params.id;

        const newObj = {};

        Object.keys(req.body).forEach((f) => {
            if (f2f[f]) {
                newObj[f] = f2f[f].s2o ? f2f[f].s2o(req.body[f]) : req.body[f];
            }
        });

        db(table).update({ _id }, { $set: newObj }, { multi: false, returnUpdatedDocs: true }, (err, numAffected, doc) => {
            if (!err) {
                if (numAffected === 1) {
                    res.send(doc);
                } else {
                    return res.status(404).send({
                        message: "Object not found with id " + _id
                    });
                }
            } else {
                return res.status(500).send({
                    message: "Something wrong updating object with id " + _id
                });
            }
        });
    });

    router.delete('/:id', (req, res) => {
        if(!crudAuth.canDelete(req)) {
            return res.status(403).send({
                message: "Forbiden to delete objects"
            });
        }
        const _id = req.params.id;
        db(table).remove({ _id }, {}, (err, numRemoved) => {
            if (!err) {
                if (numRemoved === 1) {
                    res.send({});
                } else {
                    return res.status(404).send({
                        message: "Object not found with id " + _id
                    });
                }
            } else {
                return res.status(500).send({
                    message: "Something wrong deleting object with id " + _id
                });
            }
        });
    });

    return router;
}
