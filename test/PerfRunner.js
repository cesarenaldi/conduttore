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
		'conduct': './dist/conduct',

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
		{ name: 'when', location: 'bower_components/when', main: 'when' },
		// { name: 'conduct', location: './lib', main: 'conduct' }
	],

	deps: ['benchmark', 'jquery'],

	// start test run, once Require.js is done
	callback: function (global, karma, Benchmark, jquery) {

		var currentSuite,
			suites = [],
			suiteSize = 0;

		global.jQuery = jquery

		global.benchmark = function (groupName, queueBenchmarks) {
			currentSuite = new Benchmark.Suite()

			suites.push(currentSuite)

			currentSuite.groupName = groupName
			currentSuite.benchmarks = []

			currentSuite
				.on('add', function(event) {
					
					var bench = event.target

					this.benchmarks.push(bench)

				}).on('cycle', function (event) {

					var perf = event.target

				}).on('complete', function () {
					
					var message = [],
						fastest = Benchmark.filter(this.benchmarks, 'fastest'),
						result;

					fastest = fastest[0]

					this
						.filter(function (test) {
							return test.id !== fastest.id
						})
						.forEach(function (test) {

							var timesFaster = (fastest.hz / test.hz);

							message.push([
								fastest.name,
								'is',
								Benchmark.formatNumber(timesFaster.toFixed(2))+'x',
								'than',
								test.name
							].join(' '))
						})


					result = {
						id: this.groupName,
						description: message.join('\n'),
						suite: [this.groupName],
						success: true,
						skipped: false,
						time: 0,
						log: []
					}

					karma.result(result)


					// console.log(this.filter('fastest'))
					console.log('Fastest is ' + this.filter('fastest').pluck('name'))
					
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
			var bench = currentSuite.add(scenarioName, benchmark)
			currentSuite.benchmarks.push(bench)
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