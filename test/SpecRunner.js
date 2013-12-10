var tests = [];
for (var file in window.__karma__.files) {
  if (window.__karma__.files.hasOwnProperty(file)) {
    if (/\.spec\.js$/.test(file) && !/node_modules|bower_components/.test(file)) {
      tests.push(file);
    }
  }
}

requirejs.config({
    // Karma serves files from '/base'
    baseUrl: '/base/lib',

    paths: {

    	'chai': '../test/libs/chai',
    	'sinon': '../test/libs/sinon',
    	'sinon-chai': '../test/libs/sinon-chai',

        'fixtures': '../test/fixtures',

        'underscore': '../bower_components/underscore-amd/underscore'
    },

    shim: {
        'sinon': {
            exports: 'sinon'
        },
        'underscore': {
            exports: '_'
        }
    },

    packages: [
        { name: 'when', location: '../bower_components/when', main: 'when' }
    ],

    hbs: {
        disableI18n: true
    },

    // ask Require.js to load these files (all our tests)
    deps: ['chai', 'sinon', 'sinon-chai'],

    // start test run, once Require.js is done
    callback: function(chai, sinon, sinonChai) {

		chai.use(sinonChai)
        window.chai = chai
    	window.expect = chai.expect;
    	window.sinon = sinon;

        require(tests, window.__karma__.start)
    }
});