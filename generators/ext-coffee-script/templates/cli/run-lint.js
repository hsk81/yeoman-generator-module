let cp = require('child_process'),
    ps = require('process'),
    fs = require('fs');

function run(cmd, ...args) {
    return new Promise((res, rej) => cp.spawn(cmd, args, {
        shell: true, stdio: 'inherit'
    }).on('exit', (code) =>
        code === 0 ? res(code) : rej(code)
    ));
};
function run_install(flag) {
    if (flag) {
        run('npm', 'install')
            .then(run_lint).catch(ps.exit);
    } else {
        run_lint(0);
    }
}
function run_lint() {
    let lint = (...args) => [
        'coffeelint', '--file', 'coffeelint.json', '--quiet'
    ].concat(
        args, process.argv.slice(2)
    );
    run('npx', ...lint('lib/*.coffee', 'test/*.coffee'))
        .then(ps.exit).catch(ps.exit);
}

fs.access('./node_modules', run_install);
