core.factory('ErrorFactory', function($log, $mdBottomSheet) {
    const display = (message) => $mdBottomSheet.show({
        templateUrl: 'js/common/templates/error-message.html',
        clickOutsideToClose: true,
        locals: { message },
        controller: 'ErrorCtrl'
    }).catch(angular.noop); // dismissing the sheet rejects; that's not an error

    return {
        error(message, cause) {
            $log.warn(message, cause || '');
            return display(message);
        },
        clientError: display,
        browserError() {
            return $mdBottomSheet.show({
                templateUrl: 'js/common/templates/browser-error.html',
                clickOutsideToClose: true,
            }).catch(angular.noop);
        },
    };
});
