/*===========================================================================
** Controller
*===========================================================================*/
(function(){
	'use strict';
	var DATE = 'Date',
		CACHE = 'Caching',
		TIMEOUT = 'Timeout',
		ARRAY = 'Array',
		FOR = 'For';

	angular
		.module('app.module')
		.controller('Compare', Compare);

	Compare.$inject = ['$scope', '$timeout', '$injector'];

	function Compare ($scope, $timeout, $injector) {
		$scope.footer = '<p>Created by:<br><a target="_blank" href="https://www.linkedin.com/in/tzook">Tzook</a> &amp; <a target="_blank" href="https://www.linkedin.com/pub/noam-elboim/a6/372/a">Noam</a><br><a target="_blank" href="https://github.com/Tzook/CodeCompare.ninja">Source</a></p>';
		$scope.showExample = false;
		$scope.examples = [DATE, CACHE, TIMEOUT, ARRAY, FOR];

		$scope.compare = compare;
		$scope.resetErr = resetErr;
		$scope.setExample = setExample;
		setExample(FOR);
// var img = $("img");
// for (var i = 0; i < 100000; i++) {
// 	img.css("transform", "rotateY(180deg)");
// }
		function compare () {
			$scope.loading = true;
			$timeout(function() {
				try {
					$scope.timer1 = parseFloat((runFunc($scope.userFunction1, 1) / 1000).toFixed(5));
					$scope.timer2 = parseFloat((runFunc($scope.userFunction2, 2) / 1000).toFixed(5));
				} catch(err) {
					$scope.timer1 = $scope.timer2 = undefined;
					return;
				} finally {
					$scope.loading = false;
					$scope.func1wins = $scope.timer1 < $scope.timer2;
				}				
			}, 30);
		}

		function runFunc(func, caller) {
			try {
				var result = eval("(function a () {" + func + "})"),
					timer = Date.now();
				for (var i = 0; i < $scope.howMany; i++)
					result();
				return Date.now() - timer;
			} catch (err) {
				$scope.err = "Error in function " + caller + ": " + err;
				throw(err);
			}
		}

		function resetErr () {
			$scope.err = undefined;
		}

		function setExample (example) {
			switch (example) {
				case DATE: initFunctionValues('+new Date();', 'Date.now();', 1000000);
					break;
				case CACHE: initFunctionValues('var body = $("body");\n\nfor (var i = 0; i < 100000; i++) {\n\tbody.css("color", "black");\n}',
											   'for (var i = 0; i < 100000; i++) {\n\t$("body").css("color", "black");\n}', 1);
					break;
				case TIMEOUT: initFunctionValues('var temp = 0,\n\ttimeout = $injector.get("$timeout");\n\ntimeout(function() {\n\ttemp++;\n}, 0);',
												 'var temp = 0,\n\ttimeout = $injector.get("$timeout");\n\nsetTimeout(function() {\n\ttemp++;\n}, 0);', 100000);
					break;
				case ARRAY: initFunctionValues('var arr = new Array(10000000);\n\nfor (var i = 0; i < 10000000; i++) {\n\tarr[i] = i;}',
											 'var arr = [];\n\nfor (var i = 0; i < 10000000; i++) {\n\tarr[i] = i;}', 1);
					break;
				case FOR: initFunctionValues('var arr = [];\n\nfor (var i = 0; i < 1000000; i++) {\n\tarr[i] = i;\n}\n\nfor (var t in arr) {\n\tarr[t]+=t;\n}',
											 'var arr = [];\n\nfor (var i = 0; i < 1000000; i++) {\n\tarr[i] = i;\n}\n\nfor (var t = 0; t < arr.length; t++) {\n\tarr[t]+=t;\n}', 1);
			}
			compare();
		}
		function initFunctionValues (func1, func2, loops) {
			$scope.userFunction1 = func1;
			$scope.userFunction2 = func2;
			$scope.howMany = loops;
		}
	}
})();