var tests = []
for (var file in window.__karma__.files) {
  if (window.__karma__.files.hasOwnProperty(file)) {
	if (/\.perf\.js$/.test(file) && !/node_modules|bower_components/.test(file)) {
	  tests.push(file)
	}
  }
}

requirejs.config({
	// Karma serves files from '/base'
	baseUrl: '/base',

	paths: {
		'jquery': './bower_components/jquery/jquery',
		'underscore': './bower_components/underscore-amd/underscore',

		'sammy': './bower_components/sammy/lib/min/sammy-latest.min',
		'director': './bower_components/director/build/director.min',
		'conduttore': './dist/conduttore',

		'benchmark': './bower_components/benchmark/benchmark'
	},

	shim: {
		'underscore': {
			exports: '_'
		},
		'director': {
			exports: 'Router'
		}
	},

	packages: [
		{ name: 'when', location: 'bower_components/when', main: 'when' }
	],

	deps: ['benchmark', 'jquery'],

	// start test run, once Require.js is done
	callback: function (global, karma, Benchmark, jquery) {

		var currentSuite,
			suites = [],
			suiteSize = 0;

		// set globals for Sammy.js
		global.jQuery = jquery

		/**
		 * Create a new benchmarks suite.
		 * 
		 * @param  {String} groupName - name of the benchmark suite
		 * @param  {Function} queueBenchmarks - callback that will contains benchmark calls
		 */
		global.benchmark = function (groupName, queueBenchmarks) {
			currentSuite = new Benchmark.Suite(groupName)

			suites.push(currentSuite)

			currentSuite
				// .on('add', function(event) {
					
				// 	var bench = event.target

				// 	this.benchmarks.push(bench)

				// })
				.on('cycle', function (event) {

					var perf = event.target

				})
				.on('complete', function () {
					
					var message = [],
						fastest = Benchmark.filter(this, 'fastest'),
						result;

					function not (bench) {
						return function (test) {
							return test.id !== bench.id
						}
					}
					fastest = fastest[0]

					message.push(Benchmark.pluck(this, 'name').join('\t| '))
debugger
					this
						// .filter(not(fastest))
						.forEach(function (current) {

							Benchmark
								.filter(this, not(current))
								.forEach(function (test) {

									var timesFaster = (current.hz / test.hz);

									message.push([
										fastest.name,
										'is',
										Benchmark.formatNumber(timesFaster.toFixed(2))+'x',
										'than',
										test.name
									].join(' '))
								})
						})


					result = {
						id: this.name,
						description: message.join('\n\t\t'),
						suite: [this.name],
						success: true,
						skipped: false,
						time: 0,
						log: []
					}

					karma.result(result)


					// console.log(this.filter('fastest'))
					// console.log('Fastest is ' + this.filter('fastest').pluck('name'))
					
					karma.complete({
						coverage: global.__coverage__
					})

				})

			queueBenchmarks()

			karma.info({
				total: ++suiteSize
			})
		}

		global.when = function (scenarioName, benchmark) {
			currentSuite.add(scenarioName, benchmark)
		}

		require(tests, function () {
			if (! suites.length) {
				karma.complete({
					coverage: global.__coverage__
				})
			} else {
				Benchmark.invoke(suites, 'run', { async: false })
			}
		})
	}.bind(window, window, window.__karma__)
})