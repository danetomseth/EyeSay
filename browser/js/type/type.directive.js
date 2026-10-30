core.directive('blLetterType', function(TypeFactory, DialogFactory) {
    return {
        restrict: 'E',
        templateUrl: 'js/type/keyboard.html',
        link: function(scope) {
            scope.kb = TypeFactory;

            // Show how to type first; scanning starts when it's dismissed (click or blink).
            DialogFactory.typeInstructions(() => {
                TypeFactory.typeReady = true;
            });
        }
    };
});
