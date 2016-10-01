core.directive('blLetterType', function(TypeFactory, SpeechFactory, $mdDialog, $rootScope) {
    return {
        restrict: 'E',
        templateUrl: 'js/type/keyboard.html',
        link: function(scope) {
            scope.wordInput = '';
            scope.selected = [null, null];
            scope.speaking = false;


            //makes sure first element is highlighted on page load
            scope.keyboard = TypeFactory.alphabet;

            scope.$watch(function() {
                return TypeFactory.selectedLetter;
            }, function(newVal) {
                if (typeof newVal !== 'undefined') {
                    if (TypeFactory.selectedLetter) {
                        scope.selected = TypeFactory.selectedLetter;
                    } else scope.selected = [null, null];
                }
            });

            
           

            scope.$watch(function() {
                return TypeFactory.word
            }, function(newVal) {
                if (typeof newVal !== 'undefined') {
                    scope.wordInput = TypeFactory.word;
                }
            });

            scope.scopeValue = TypeFactory.scopeValue;

            function togglePlay() {
                scope.speaking = !scope.speaking;
            }

            scope.say = () => SpeechFactory.say(scope.wordInput, "UK English Male", {
                onstart: togglePlay,
                onend: togglePlay
            });

             let showDialog = () => {
                var parentEl = angular.element(document.body);
                $mdDialog.show({
                    parent: parentEl,
                    controller: ($scope, TypeFactory) => {
                        $scope.closeDialog = () => {
                            $mdDialog.hide();
                            TypeFactory.typeReady = true;
                        }
                    },
                    templateUrl: 'js/type/dialog.html'
                });
            }
            showDialog();
        }

    }
});