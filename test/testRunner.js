exports.assertTestMatches = function (fileSystem, testExpectations, rules) {
    var matcher = require('../').createMatcher(rules);
    var matchedResults = 0;
    fileSystem.forEach(filePath => {
      var matchedExpectation = testExpectations.filter(n => n.path === filePath);
  
      if (matchedExpectation.length === 1) {
  
        var ignoreSymbol = matcher.shouldIgnore(filePath) ? '-' : '+';
  
        matchedResults += matchedExpectation[0].ignoreSymbol === ignoreSymbol ? 1 : 0;
      }
    });
  
    return matchedResults;
};