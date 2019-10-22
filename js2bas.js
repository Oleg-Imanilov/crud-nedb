function onInpChange() {
    const lines = document.getElementById('inp').value.split('\n');
    let ret = '';
    const funcs = {};
    const consts = {};
    const outLines = lines.map((l, i) => {
        const ix = i * 10 + 10;
        l = l.trim().toUpperCase();
        if (l.substr(0, 1) === '~') {
            let p = l.substr(1).split(/\s+/);
            const params = p.splice(1).map(t => t.trim());
            funcs[p[0]] = { addr: ix, params };
            return [ix, `REM ${p[0]}(${params.join(',')})`];
        } else if (l.substr(0, 1) === '@') {
            let p = l.substr(1).split(/\s+/);
            const params = p.splice(1);
            return [ix, { func: p[0], params }];
        } else if (l.substr(0, 1) === '#') { // const
            let p = l.split(/\s+/);
            consts[p[0]] = p[1];
            return [ix, `REM ${p[0].substr(1)} = ${p[1]}`];
        } else if (l === '') {
            return [ix, 'REM'];
        }
        return [ix, l];
    });

    const constKeys = Object.keys(consts);

    outLines.forEach((l) => {
        if (l[1].func) {
            if (!funcs[l[1].func]) {
                l[1] = `ERROR! NO FUNCTION "${l[1].func}"`
            } else {
                const { addr, params } = funcs[l[1].func];
                let s = '';
                params.forEach((p, j) => {
                    let pp = l[1].params[j];
                    if (pp !== undefined && pp !== '_') {
                        s += `${p} = ${pp}:`
                    }
                });
                s += `GOSUB ${addr}: REM ${l[1].func}`;
                l[1] = s;
            }
        }
        constKeys.forEach((k) => {
            const r = new RegExp(k, 'g');
            l[1] = l[1].replace(r, consts[k]);
        });
    });
    let outText = outLines.map(l => l.join(' ')).join('\n');
    document.getElementById('out').innerHTML = outText;
}

function selectText(node) {
    node = document.getElementById(node);

    if (document.body.createTextRange) {
        const range = document.body.createTextRange();
        range.moveToElementText(node);
        range.select();
    } else if (window.getSelection) {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(node);
        selection.removeAllRanges();
        selection.addRange(range);
    } else {
        console.warn("Could not select text in node: Unsupported browser.");
    }
}
