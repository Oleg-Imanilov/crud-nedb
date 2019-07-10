const field = require('./Field');
const ALLOW = require('./CrudAuth').allow({
    canDelete: (req) => { return req.user && req.user.roles.indexOf('admin') >= 0 }
});

module.exports = {
    FIELDS: [
        field({
            name: 'date',
            label: 'Date',
            type: 'number',
            mandatory: true,
            s2o: (s) => { return Date(s) },
            o2s: (d) => { return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}` }
        }),
        field({ name: 'description', label: 'Description', defval: 'N/A' }),
        field({
            name: 'amount',
            label: 'Amount',
            type: 'number',
            s2o: (s) => { return parseFloat(s) },
            o2s: (n) => { return n.toString(10) }
        })
    ],
    table: 'test',
    auth: ALLOW
}
