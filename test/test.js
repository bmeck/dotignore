var fs = require('fs');
var path = require('path');
var rules = String(fs.readFileSync(path.join(__dirname, '.1\-ignore')));
var matcher = require('../').createMatcher(rules);
var test = require('tape');

var checkDir = function checkDir(dir, paths, output) {
  if (!output) { output = ''; }
  paths.forEach(function (pathArr) {
    var isDir = Array.isArray(pathArr);
    var filename = isDir ? pathArr[0] : pathArr;
    var resolved = path.join(dir, filename);
    if (matcher.shouldIgnore(resolved)) {
      output += ('- ' + resolved + '\n');
    } else if (isDir) {
      output = checkDir(resolved, pathArr[1], output);
    } else {
      output += ('+ ' + resolved + '\n');
    }
  });
  return output;
};

test('expected output', function (t) {
  process.chdir(__dirname);

  var root = [
    '.ignore',
    ['a', [
      ['a', ['notignored']],
      'ignored',
      'notignored',
      'notlisted'
    ]],
    'expected',
    'test.js'
  ];

  var output = checkDir('.', root);

  t.equal(output, String(fs.readFileSync(path.join(__dirname, '1-expected'))));
  t.end();
});

