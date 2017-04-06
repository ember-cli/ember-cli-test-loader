/* globals requirejs, require */
"use strict";

var moduleIncludeMatchers = [];
var moduleExcludeMatchers = [];

export function addModuleIncludeMatcher(fn) {
  moduleIncludeMatchers.push(fn);
};

export function addModuleExcludeMatcher(fn) {
  moduleExcludeMatchers.push(fn);
};

function checkMatchers(matchers, moduleName) {
  return matchers.some(matcher => matcher(moduleName));
}

export default class TestLoader {
  constructor() {
    this._didLogMissingUnsee = false;
  }

  shouldLoadModule(moduleName) {
    return (moduleName.match(/[-_]test$/));
  }

  listModules() {
    return Object.keys(requirejs.entries);
  }

  listTestModules() {
    var moduleNames = this.listModules();
    var testModules = [];
    var moduleName;

    for (var i = 0; i < moduleNames.length; i++) {
      moduleName = moduleNames[i];

      if (checkMatchers(moduleExcludeMatchers, moduleName)) {
        continue;
      }

      if (checkMatchers(moduleIncludeMatchers, moduleName) || this.shouldLoadModule(moduleName)) {
        testModules.push(moduleName);
      }
    }

    return testModules;
  }

  loadModules() {
    var testModules = this.listTestModules();
    var testModule;

    for (var i = 0; i < testModules.length; i++) {
      testModule = testModules[i];
      this.require(testModule);
      this.unsee(testModule);
    }
  }

  require(moduleName) {
    try {
      require(moduleName);
    } catch(e) {
      this.moduleLoadFailure(moduleName, e);
    }
  }

  unsee(moduleName) {
    if (typeof require.unsee === 'function') {
      require.unsee(moduleName);
    } else if (!this._didLogMissingUnsee) {
      this._didLogMissingUnsee = true;
      if (typeof console !== 'undefined') {
        console.warn('unable to require.unsee, please upgrade loader.js to >= v3.3.0');
      }
    }
  }

  moduleLoadFailure(moduleName, error) {
    console.error('Error loading: ' + moduleName, error.stack);
  }

  static load() {
    new TestLoader().loadModules();
  }
};
