core.factory('DialogFactory', function($http, $mdDialog) { 
	let showDialog = () => {
		var parentEl = angular.element(document.querySelector('#tutorialContainer'));
       $mdDialog.show({
         parent: parentEl,
         controller: 'TutorialCtrl',
         scope: '=',
         title: "Hello",
         templateUrl: 'js/common/factories/dialog.html'
      });
	}

	let showHint = (scope) => {
		var parentEl = angular.element(document.querySelector('#tutorialContainer'));
       $mdDialog.show({
         parent: parentEl,
         controller: ($scope) => {
                $scope.closeDialog = () => {
                    $mdDialog.hide();
                }
            },
         title: "Hello",
         templateUrl: 'js/common/factories/hint.html'
      });
	}


	return {
		message: () => {
			showDialog();
		},
		hint: () => {
			showHint();
		},
		hide: () => {
			$mdDialog.hide();
		}
	}



});


// core.controller("DialogCtrl", ($scope, $mdDialog) => {
// 	$scope.closeDialog = () => {
// 		$mdDialog.hide();
// 	}
// });