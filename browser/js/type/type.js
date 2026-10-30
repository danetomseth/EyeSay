core.config(function ($stateProvider) {
    $stateProvider.state('type', {
        url: '/type',
        controller: 'TypeCtrl',
        templateUrl: 'js/type/type.html',
        onExit: (TypeFactory) => {
            TypeFactory.reset();
        }
    });
});
