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


	return {
		message: () => {
			showDialog();
			// $timeout(function() {
			// 	console.log('closing');
			// 	$mdDialog.hide();
			// }, 1500)
		},
		hide: () => {
			$mdDialog.hide();
		}
	}



});