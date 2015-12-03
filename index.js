var es = require('event-stream');
var spawn = require('child_process').spawn;
var path = require('path');

module.exports = function(opts) {
  return es.map(function(script, next) {
    var compil = path.resolve(path.join(__dirname, 'inno/ISCC.exe'));
    var signToolPath = path.resolve(path.join(__dirname, 'inno/signtool.exe'));
    var script_path = path.resolve(script.path);

    var args, run;
    if (process.platform !== 'win32') {
      args = [compil, '/S"signtool=Z:' + signToolPath + ' $p"', 'Z:' + script_path];
      if (opts && opts.args){
        args = args.concat(opts.args);
      }
      run = spawn('wine', args);
    } else {
      args = ['/S"signtool=' + signToolPath + ' $p"', script_path];
      if (opts && opts.args){
        args = args.concat(opts.args);
      }
      run = spawn(compil, args);
    }
    run.stdout.on('data', function(data) {
      console.log('stdout: ' + data);
    });
    run.stderr.on('data', function(data) {
      console.log('stderr: ' + data);
    });
    run.on('close', function(code) {
      console.log('child process exited with code ' + code);
      return next(null);
    });
  });
};
