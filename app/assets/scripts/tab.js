//////////////////////////////////////////
/////////////|=============|//////////////
// 				DIRECTIVE 				//
/////////////|=============|//////////////
//////////////////////////////////////////
(function(){
	'use strict';

	angular
		.module('app.module')
		.directive('focusTab', focusTab);

	function focusTab () {
		return {
			restrict: 'A',
			link: catchTab
		};
	}
	
	function catchTab (scope, elem) {
		elem.on('keydown', function(event) { catchTabEvent(event, elem); });
	}

	function catchTabEvent(event, elem) {
		if (event.keyCode == 9) { 
			event.preventDefault();
			if (elem.val() === "") // empty -> just insert tab
				elem.val("\t");
			else {
				var placeToInsert = elem[0].selectionStart,		 // place tab was clicked
					start = elem.val().substr(0, placeToInsert), // string from start to here
					end = elem.val().substr(placeToInsert);		 // string from here to end
				
				elem.val(start + "\t" + end); // insert tab in current location
				elem.triggerHandler('input'); // update the ng-model
				elem[0].setSelectionRange(placeToInsert + 1, placeToInsert + 1); // bring the keyboard to after tab
			}
		}
	}
})();