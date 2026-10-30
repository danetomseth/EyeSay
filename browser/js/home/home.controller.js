core.controller('HomeCtrl', function($scope, Session) {
    $scope.loggedIn = !!Session.user;
    $scope.calibrateTip = false;
    $scope.accountTip = false;
});
