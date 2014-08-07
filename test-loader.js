/* globals requirejs, require */

var moduleName, shouldLoad;

QUnit.config.urlConfig.push({ id: 'nojshint', label: 'Disable JSHint'});

// TODO: load based on params
for (moduleName in requirejs.entries) {
  shouldLoad = false;

  if (moduleName.match(/[-_]test$/)) { shouldLoad = true; }
  if (!QUnit.urlParams.nojshint && moduleName.match(/\.jshint$/)) { shouldLoad = true; }

  if (shouldLoad) { require(moduleName); }
}

if (QUnit.notifications) {
  QUnit.notifications({
    icons: {
      passed: '/assets/passed.png',
      failed: '/assets/failed.png'
    }
  });
}

$(window).on('load', function() {
  var toolbar              = Ember.$('#qunit-testrunner-toolbar')[0];
  var hideTestingContainer = document.createElement( "input" );

  hideTestingContainer.type = "checkbox";
  hideTestingContainer.id   = "hide-testing-container";

  if (QUnit.urlParams.hideTestingContainer === 'true') {
    hideTestingContainer.checked = true;
    toggleTestingContainer();
  }

  hideTestingContainer.addEventListener('click', function(event) {
    toggleTestingContainer();
    updateQueryParams(event.target);
    updateQUnitUrlParams(event.target);
  });

  toolbar.appendChild(hideTestingContainer);

  var label       = document.createElement('label');
  label.innerHTML = "Hide Testing Container";
  label.setAttribute( "for", "hide-testing-container" );
  label.setAttribute( "title", "Hide Testing Container" );
  toolbar.appendChild(label);

  function toggleTestingContainer() {
    var container = Ember.$('#ember-testing-container');

    if (container.css('display') === 'block') {
      container.css('display', 'none');
    } else {
      container.css('display', 'block');
    }
  };

  function updateQueryParams(target) {
    var search = window.location.search
      .replace(/^\?/, '').split('&')
      .reduce(function(obj, param) {
        if (param.length > 0) {
          param = param.split('=');
          obj[param[0]] = param[1];
        }
        return obj;
      }, {});

    if (target.checked) {
      search['hideTestingContainer'] = true;
    } else {
      delete search.hideTestingContainer;
    }

    var newSearch = Object.keys(search).map(function(key) {
      return "" + key + "=" + search[key];
    }).join('&');

    if (newSearch.length > 0) {
      newSearch = "?" + newSearch;
    }

    window.history.replaceState({}, '', window.location.pathname + newSearch);
  };

  function updateQUnitUrlParams(target) {
    if (target.checked) {
      QUnit.urlParams.hideTestingContainer = true;
    } else {
      delete QUnit.urlParams['hideTestingContainer'];
    }
  };
});
