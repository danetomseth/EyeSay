core.factory('DialogFactory', function($http, $mdDialog) {
    // let container = angular.element(document.querySelector('#dialog'))[0];


    let showDialog = () => {
        var parentEl = angular.element(document.querySelector('#main-content'));
        $mdDialog.show({
            parent: parentEl,
            controller: 'TutorialCtrl',
            scope: '=',
            title: "Hello",
            templateUrl: 'js/common/templates/dialog.html'
        });
    }

    let showHint = (scope) => {
        var parentEl = angular.element(document.querySelector('#main-content'));
        $mdDialog.show({
            parent: parentEl,
            controller: ($scope) => {
                $scope.closeDialog = () => {
                    $mdDialog.hide();
                }
            },
            title: "Hello",
            templateUrl: 'js/common/templates/hint.html'
        });
    }

    let checkTracking = () => {
        var parentEl = angular.element(document.querySelector('#main-content'));
        $mdDialog.show({
            parent: parentEl,
            controller: ($scope) => {
                $scope.closeDialog = () => {
                    $mdDialog.hide();
                }
            },
            templateUrl: 'js/common/templates/check-tracking.html'
        });
    }

    let noConvergance = () => {
        var parentEl = angular.element(document.querySelector('#main-content'));
        $mdDialog.show({
            parent: parentEl,
            focusOnOpen: true,
            controller: ($scope, TypeFactory) => {
                $scope.closeDialog = () => {
                    $mdDialog.hide();
                }
            },
            templateUrl: 'js/common/templates/check-tracking.html'
        });
    }
    let closedInstructions = () => {
        var parentEl = angular.element(document.querySelector('#main-content'));
        $mdDialog.show({
            parent: parentEl,
            controller: ($scope, CalibrateFactory) => {
                $scope.closeDialog = () => {
                    $mdDialog.hide();
                    CalibrateFactory.runClosedCalibration();
                }
            },
            templateUrl: 'js/common/templates/closed-instructions.html'
        });
    }

    let webcamFail = () => {
         var parentEl = angular.element(document.querySelector('#main-content'));
        $mdDialog.show({
            parent: parentEl,
            controller: ($scope) => {
                $scope.closeDialog = () => {
                    $mdDialog.hide();
                }
            },
            templateUrl: 'js/common/templates/webcam-fail.html'
        });
    }



    let openInstructions = () => {
        var parentEl = angular.element(document.querySelector('#main-content'));
        $mdDialog.show({
            parent: parentEl,
            controller: ($scope, CalibrateFactory) => {
                $scope.closeDialog = () => {
                    $mdDialog.hide();
                    CalibrateFactory.runOpenCalibration();
                }
            },
            templateUrl: 'js/common/templates/open-instructions.html'
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
                templateUrl: 'js/common/templates/custom-message.html'
            });
        },
        checkTracking: () => {
            checkTracking();
        },
        openInstructions: () => {
            openInstructions();
        },
        closedInstructions: () => {
            closedInstructions();
        },
        noConvergance: () => {
            noConvergance();
        },
        webcamFail: webcamFail

    }



});


