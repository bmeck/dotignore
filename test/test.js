var fs = require('fs');
var path = require('path');
var rules = fs.readFileSync(path.join(__dirname, '.ignore'))+'';
var matcher = require('../').createMatcher(rules);
var assert = require('assert');
process.chdir(__dirname);
var output = '';
function checkDir(dir) {
   fs.readdirSync(dir).forEach(function (filename) {
      var resolved = path.join(dir, filename);
      if (matcher.shouldIgnore(resolved)) {
         output += ('- '+resolved+'\n');
      }
      else {
         if (fs.statSync(resolved).isDirectory()) {
            checkDir(resolved);
         }
         else {
            output += ('+ '+resolved+'\n');
         }
      }
   })
}
checkDir('.');

assert.equal(output, fs.readFileSync(path.join(__dirname, 'expected'))+'');