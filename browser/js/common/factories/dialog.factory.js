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

    let checkTracking = () => {
        var parentEl = angular.element(document.body);
        $mdDialog.show({
            parent: parentEl,
            controller: ($scope) => {
                $scope.closeDialog = () => {
                    $mdDialog.hide();
                }
            },
            templateUrl: 'js/calibrate/dialog.html'
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
        promptMessage: (text, func) => {
            let parentEl = angular.element(document.querySelector('#main-content'));
            $mdDialog.show({
                parent: parentEl,
                locals: {
                    dialogTitle: text.title,
                    dialogList: text.listContent,
                    action: func
                },
                controller: ($scope, dialogList, dialogTitle, action) => {
                    $scope.title = dialogTitle;
                    $scope.list = dialogList;
                    $scope.closeDialog = () => {
                        if(action) {
                            action();
                        };
                        $mdDialog.hide();
                    }
                },
                templateUrl: 'js/common/factories/custom-message.html'
            });
        },
        checkTracking: () => {
            checkTracking();
        }

    }



});


