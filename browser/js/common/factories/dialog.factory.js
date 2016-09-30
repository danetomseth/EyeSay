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

    let sharedScope = () => {
        let parentEl = angular.element(document.querySelector('#main-content'));
        $mdDialog.show({
            parent: parentEl,
            controller: ($scope) => {
                $scope.closeDialog = () => {
                    $mdDialog.hide();
                }
            },
            templateUrl: 'js/common/factories/sharedScope.html'
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
        },
        promptMessage: (text) => {
            let parentEl = angular.element(document.querySelector('#main-content'));
            console.log("text passed", text);
            $mdDialog.show({
                parent: parentEl,
                locals: {
                    dialogTitle: text.title,
                    dialogList: text.listContent
                },
                controller: ($scope, dialogList, dialogTitle) => {
                    $scope.title = dialogTitle;
                    $scope.list = dialogList;
                    $scope.closeDialog = () => {
                        $mdDialog.hide();
                    }
                },
                templateUrl: 'js/common/factories/custom-message.html'
            });
        },
        sharedScope: () => {
            sharedScope();
        }
    }



});


// core.controller("DialogCtrl", ($scope, $mdDialog) => {
// 	$scope.closeDialog = () => {
// 		$mdDialog.hide();
// 	}
// });