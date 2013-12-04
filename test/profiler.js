requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: '../dist',
    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    paths: {
        'underscore': '../bower_components/underscore-amd/underscore'
    }
})

require(['conduct'], function (conduct) {
    var router,
        noop = function () {}

    for (var i = 0; i < 10000; i++) {
        router = conduct()
        router.connect('/user/:number', noop)
    }
})