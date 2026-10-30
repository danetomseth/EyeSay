core.controller('TypeCtrl', function($scope, TypeFactory) {
    // Clear the message and start scanning from the top again.
    $scope.restart = () => TypeFactory.clearInput();
});
