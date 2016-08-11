core.config(function($stateProvider) {
    $stateProvider.state('settings', {
        url: '/settings',
        controller: 'SettingsCtrl',
        templateUrl: 'js/settings/settings.html',
        onEnter: (ConstantsFactory, Session) => {
        	ConstantsFactory.setUser(Session.user);
        }
    });
});
