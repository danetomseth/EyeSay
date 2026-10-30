core.factory('DialogFactory', function($mdDialog, $rootScope) {
    const parent = () => angular.element(document.querySelector('#main-content'));

    const simple = (templateUrl, onClose) => $mdDialog.show({
        parent: parent(),
        templateUrl,
        controller: function($scope) {
            $scope.closeDialog = () => {
                $mdDialog.hide();
                if (onClose) onClose();
            };
        },
    }).catch(angular.noop);

    // Dialogs the person using the app (not just a caregiver) needs to get past
    // can be dismissed with a blink as well as a click.
    const blinkDismissable = (options, onClose) => {
        let closed = false;
        const close = () => {
            if (closed) return;
            closed = true;
            $mdDialog.hide();
            if (onClose) onClose();
        };
        // Ignore blinks for a moment so the blink that opened it doesn't close it.
        let armed = false;
        const armTimer = setTimeout(() => { armed = true; }, 1200);
        const off = $rootScope.$on('singleBlink', () => { if (armed) close(); });
        return $mdDialog.show(angular.extend({
            parent: parent(),
            onRemoving: () => { off(); clearTimeout(armTimer); closed = true; },
        }, options, {
            controller: function($scope) {
                $scope.closeDialog = close;
                $scope.blinkToClose = true;
                if (options.locals) angular.extend($scope, options.locals);
            },
        })).catch(angular.noop);
    };

    return {
        hide: () => $mdDialog.hide(),
        hint: () => simple('js/common/templates/hint.html'),
        checkTracking: () => simple('js/common/templates/check-tracking.html'),
        noConvergance: () => simple('js/common/templates/check-tracking.html'),
        openInstructions: (onClose) => simple('js/common/templates/open-instructions.html', onClose),
        closedInstructions: (onClose) => simple('js/common/templates/closed-instructions.html', onClose),
        webcamFail: (message, retry) => $mdDialog.show({
            parent: parent(),
            templateUrl: 'js/common/templates/webcam-fail.html',
            locals: { message },
            controller: function($scope, message) {
                $scope.message = message;
                $scope.closeDialog = () => $mdDialog.hide();
                $scope.retry = () => {
                    $mdDialog.hide();
                    if (retry) retry();
                };
            },
        }).catch(angular.noop),
        // text: { title, listContent: [] }
        promptMessage: (text, action) => blinkDismissable({
            templateUrl: 'js/common/templates/custom-message.html',
            locals: { title: text.title, list: text.listContent },
        }, action),
        typeInstructions: (onClose) => blinkDismissable({ templateUrl: 'js/type/dialog.html' }, onClose),
    };
});
