module.exports = (opt) => {
    const {name, label, defval, mandatory, s2o, o2s, type } = opt;
    if(!name) {
        throw "name is mandatory"
    }
    return {
        name,
        label: label || name,
        defval,
        mandatory: !!mandatory,
        s2o,
        o2s,
        type: type || 'string'
    }
}
