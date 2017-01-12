## Ember CLI Test Loader

Defines a `TestLoader` object that reviews all of the modules in
`requirejs.entries` and loads those identified as tests.

`TestLoader.prototype.shouldLoadModule` can be overridden in order to customize
the criteria for identifying test modules.

### Usage

Within tests/test-helper.js:

```javascript
  import TestLoader from 'ember-cli-test-loader/test-support';

  // optionally override TestLoader.prototype.shouldLoadModule

  TestLoader.load();
```
