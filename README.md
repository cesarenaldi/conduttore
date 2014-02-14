# Conduttore [![Build Status](https://travis-ci.org/cesarenaldi/conduttore.png?branch=delimiter-agnostic)](https://travis-ci.org/cesarenaldi/conduttore)

## Features

* Fast, very fast!!
* Multipurpose
	* Environment agnostic - isomorphic implementation
	* Purpose agnostic (i.e. not just for URLs routing)
* Automatic route parameters retrieval and type coercion

## Installation

Using NPM with:
`npm install git://github.com/cesarenaldi/conduttore.git`

Using bower.js:
`bower install git://github.com/cesarenaldi/conduttore.git`

## Example

```javascript
var conduttore = require('conduttore')

function handler (controller, action, type)

var router = conduttore({
	aliases: {
		':controller': ':text',
		':action': ':text'
	},

	params: {
		':type': ['topolino', 'pluto']
	},

	routes: [
		{ '/:controller/:action/:type': handler},
		{ '*': defaultHandler }
	]
})

// retrieve the route value (a function in this case)
router.resolve('/users/edit/topolino')

// or invoke the route handler
router
	.dispatch('/users/edit/topolino')
	.then(function (handlerResult) {
		// your post processing logic goes here
	})

```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_

## License
Copyright (c) 2014 Cesare Naldi  
Licensed under the MIT license.
