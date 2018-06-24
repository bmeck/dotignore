var fs = require('fs');
var path = require('path');
var test = require('tape');
var runner = require('./testRunner');
process.chdir(path.join(process.cwd(), 'test'));

var simpleRules = String(fs.readFileSync('.ignore'));

test('returns expected results for mac file system', function (t) {

  var fileSystem = [
    '.ignore',
    'a/a/notignored',
    'a/ignored',
    'a/notignored',
    'a/notlisted',
    'expected',
    'test.js'
  ];

  var expectedMacResults = JSON.parse(fs.readFileSync('test-expectations.json')).map(item => {
    return {path: item.macPath, ignoreSymbol: item.ignoreSymbol};
  });
  
  var matchedResults = runner.assertTestMatches(fileSystem, expectedMacResults, simpleRules);

  t.equal(fileSystem.length, matchedResults, 'all the file system files should be correctly marked')
  t.end();
});


test('returns expected results for windows file system', function (t) {

  var fileSystem = [
    '.ignore',
    'a\\a\\notignored',
    'a\\ignored',
    'a\\notignored',
    'a\\notlisted',
    'expected',
    'test.js'
  ];

  var expectedWinResults = JSON.parse(fs.readFileSync('test-expectations.json')).map(item => {
    return {path: item.winPath, ignoreSymbol: item.ignoreSymbol};
  });
  
  var matchedResults = runner.assertTestMatches(fileSystem, expectedWinResults, simpleRules);

  t.equal(fileSystem.length, matchedResults, 'all the file system files should be correctly marked')
  t.end();
});

test('should return + for .gitignore comment lines', function (t) {
  var fileSystem = [
    'package.json'
  ];

  var matchedResults = runner.assertTestMatches(fileSystem, [{path: 'package.json', ignoreSymbol: '+'}], simpleRules);

  t.equal(fileSystem.length, matchedResults, 'the commented line with similar words should not cause package.json to be ignored');
  t.end();
});

test('should correctly calculate ignore based on first git example', function(t) {
  var fileSystem = [
    'Documentation/foo.html',
    'Documentation/gitignore.html',
    'file.o',
    'lib.a',
    'src/internal.o'
  ];

  var expectedResults = [
    {
      "path": fileSystem[0],
      "ignoreSymbol": "+"
    },
    {
      "path": fileSystem[1],
      "ignoreSymbol": "-"
    },
    {
      "path": fileSystem[2],
      "ignoreSymbol": "-",
    },
    {
      "path": fileSystem[3],
      "ignoreSymbol": "-"
    },
    {
      "path": fileSystem[4],
      "ignoreSymbol": "-"
    }
  ];

  // Uses the first example from https://git-scm.com/docs/gitignore
  // to assess the accuracy of the algorithm
  var rules = String(fs.readFileSync('.gitignore-example-1'));
  var matchedResults = runner.assertTestMatches(fileSystem, expectedResults, rules);

  t.equal(fileSystem.length, matchedResults);
  t.end();
});

// TODO: This test is currently failing. The issue seems to be that all
// the lines in the gitignore file are rooted, i.e., '/', and the generated 
// regular expression fails for any file path that includes one.
test.skip('should correctly calculate ignore based on third git example', function(t) {
  var fileSystem = [
    'a/foo.html',
    'a/b/foo.html',
    'foo/baz.html',
    'foo/raz/baz.html',
    'foo/bar/baz.html'
  ];

  var expectedResults = [
    {
      path: fileSystem[0],
      ignoreSymbol: '-'
    },
    {
      path: fileSystem[1],
      ignoreSymbol: '-'
    },
    {
      path: fileSystem[2],
      ignoreSymbol: '-'
    },
    {
      path: fileSystem[3],
      ignoreSymbol: '-'
    },
    {
      path: fileSystem[4],
      ignoreSymbol: '+'
    }
  ];

  // Uses the third example from https://git-scm.com/docs/gitignore
  // to assess the accuracy of the algorithm
  var rules = String(fs.readFileSync('.gitignore-example-3'));
  var matchedResults = runner.assertTestMatches(fileSystem, expectedResults, rules);

  t.equal(fileSystem.length, matchedResults);
  t.end();
});