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
		$scope.footer = '<p>Created by:<br><a target="_blank" href="https://www.linkedin.com/in/tzook">Tzook</a> &amp; <a target="_blank" href="https://www.linkedin.com/pub/noam-elboim/a6/372/a">Noam</a><br><a target="_blank" href="https://github.com/Tzook/CodeCompareNinja">Source</a></p>';
		$scope.showExample = false;
		$scope.examples = [DATE, CACHE, TIMEOUT, ARRAY, FOR];

		$scope.compare = compare;
		$scope.resetErr = resetErr;
		$scope.setExample = setExample;
		setExample(FOR);

		function compare () {
			$scope.loading = true;
			$timeout(function() {
				try {
					var func1 = getFunc($scope.userFunction1, 1),
						func2 = getFunc($scope.userFunction2, 2);
					$scope.timer1 = parseFloat((runFunc(func1, 1) / 1000).toFixed(5));
					$scope.timer2 = parseFloat((runFunc(func2, 2) / 1000).toFixed(5));
				} catch(err) {
					$scope.timer1 = $scope.timer2 = undefined;
					return;
				} finally {
					$scope.loading = false;
					$scope.func1wins = $scope.timer1 < $scope.timer2;
				}				
			}, 30);
		}
		function getFunc(func, caller) {
			try {
				return eval("(function a () {" + func + "})");
			} catch (err) {
				$scope.err = "Error in function " + caller + "'s syntax: " + err;
				throw(err);
			}
		}

		function runFunc(func, caller) {
			try {
				var timer = Date.now();
				for (var i = 0; i < $scope.howMany; i++)
					func();
				return Date.now() - timer;
			} catch (err) {
				$scope.err = "Error in function " + caller + "'s runtime: " + err;
				throw(err);
			}
		}

		function resetErr () {
			$scope.err = undefined;
		}

		function setExample (example) {
			switch (example) {
				case DATE: initFunctionValues('+new Date();', 'Date.now();', 100000);
					break;
				case CACHE: initFunctionValues('var body = $("body");\n\nfor (var i = 0; i < 10000; i++) {\n\tbody.css("color", "black");\n}',
											   'for (var i = 0; i < 10000; i++) {\n\t$("body").css("color", "black");\n}', 1);
					break;
				case TIMEOUT: initFunctionValues('var temp = 0,\n\ttimeout = $injector.get("$timeout");\n\ntimeout(function() {\n\ttemp++;\n}, 0);',
												 'var temp = 0,\n\ttimeout = $injector.get("$timeout");\n\nsetTimeout(function() {\n\ttemp++;\n}, 0);', 10000);
					break;
				case ARRAY: initFunctionValues('var arr = new Array(1000000);\n\nfor (var i = 0; i < 1000000; i++) {\n\tarr[i] = i;}',
											 'var arr = [];\n\nfor (var i = 0; i < 1000000; i++) {\n\tarr[i] = i;}', 1);
					break;
				case FOR: initFunctionValues('var arr = [];\n\nfor (var i = 0; i < 100000; i++) {\n\tarr[i] = i;\n}\n\nfor (var t in arr) {\n\tarr[t]+=t;\n}',
											 'var arr = [];\n\nfor (var i = 0; i < 100000; i++) {\n\tarr[i] = i;\n}\n\nfor (var t = 0; t < arr.length; t++) {\n\tarr[t]+=t;\n}', 1);
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