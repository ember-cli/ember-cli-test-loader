/* globals requirejs, require */
(function() {
define("ember-cli/test-loader",
  [],
  function() {
    "use strict";

    var TestLoader = function() {
      this._didLogMissingUnsee = false;
    };

    TestLoader.prototype = {
      shouldLoadModule: function(moduleName) {
        return (moduleName.match(/[-_]test$/));
      },

      loadModules: function() {
        var moduleName;

        for (moduleName in requirejs.entries) {
          if (this.shouldLoadModule(moduleName)) {
            this.require(moduleName);
            this.unsee(moduleName);
          }
        }
      }
    };

    TestLoader.prototype.require = function(moduleName) {
      try {
        require(moduleName);
      } catch(e) {
        this.moduleLoadFailure(moduleName, e);
      }
    };

   TestLoader.prototype.unsee = function(moduleName) {
     if (typeof require.unsee === 'function') {
       require.unsee(moduleName);
     } else if (!this._didLogMissingUnsee) {
      this._didLogMissingUnsee = true;
      if (typeof console !== 'undefined') {
        console.warn('unable to require.unsee, please upgrade loader.js to >= v3.3.0');
      }
     }
    };

    TestLoader.prototype.moduleLoadFailure = function(moduleName, error) {
      console.error('Error loading: ' + moduleName, error.stack);
    };

    TestLoader.load = function() {
      new TestLoader().loadModules();
    };

    return {
      'default': TestLoader
    }
  }
);
})();
