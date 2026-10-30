core.controller('ErrorCtrl', function($scope, $mdBottomSheet, $timeout, message) {
    $scope.message = message;
    $timeout(() => $mdBottomSheet.hide(), 3000);
});
