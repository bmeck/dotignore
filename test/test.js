var fs = require('fs');
var path = require('path');
var rules = fs.readFileSync(path.join(__dirname, '.ignore'))+'';
var matcher = require('../').createMatcher(rules);
var test = require('tape');

test('expected output', function (t) {
  process.chdir(__dirname);
  var output = '';

  var checkDir = function checkDir(dir) {
    fs.readdirSync(dir).forEach(function (filename) {
      var resolved = path.join(dir, filename);
      if (matcher.shouldIgnore(resolved)) {
        output += ('- ' + resolved + '\n');
      } else {
        if (fs.statSync(resolved).isDirectory()) {
          checkDir(resolved);
        } else {
          output += ('+ ' + resolved + '\n');
        }
      }
    })
  };
  checkDir('.');

  t.equal(output, fs.readFileSync(path.join(__dirname, 'expected')) + '');
  t.end();
});

