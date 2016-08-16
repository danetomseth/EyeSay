core.config(function ($stateProvider) {
    $stateProvider.state('type', {
        url: '/type',
        controller: 'TypeCtrl',
        templateUrl: 'templates/type.html',
        onEnter: function(TypeFactory) {
            TypeFactory.setSpecialFunction({
                text: "STOP",
                function: () =>{
                    //console.log("inside specialfunc")
                    //Stop typing
                }
            })
        },
        onExit: (TypeFactory) => {
            TypeFactory.reset();
        }
    });
});