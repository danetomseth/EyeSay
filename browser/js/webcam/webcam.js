core.config(function($stateProvider) {
    $stateProvider.state('webcam', {
        url: '/webcam',
        controller: 'WebcamCtrl',
        templateUrl: 'js/webcam/webcam.html',
        onEnter: (ConstantsFactory, Session) => {
        },
        onExit: (TrackingFactory, WebcamFactory) => {
        }
    });
});


core.controller('WebcamCtrl', function($scope, WebcamFactory, TrackingFactory) {
  


    
});