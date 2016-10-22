core.factory('ErrorFactory', function($log, $mdBottomSheet) {
    let service = {};

    function displayError(exception) {
        return $mdBottomSheet.show({
            templateUrl: 'js/common/templates/error-message.html',
            clickOutsideToClose: true,
            locals: {
            	message: exception
            },
            controller: 'ErrorCtrl'
        })
    }



    service.error = (exception, cause) => {
        $log.warn(exception, cause);
    	return displayError(exception);
    }

    service.invalid = (exception, cause) => {
        $log.warn(exception, cause);
    }

    service.invalidLogin = (exemption, cause) => {
        $log.warn(exception, cause);
    }

    return service;

});