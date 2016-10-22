core.config(function($stateProvider) {
    $stateProvider.state('webcam', {
        url: '/webcam',
        controller: 'WebcamCtrl',
        templateUrl: 'js/webcam/webcam.html',
        onEnter: (ConstantsFactory, Session) => {
            // ConstantsFactory.setUser(Session.user);
        },
        onExit: (TrackingFactory, WebcamFactory) => {
        	// TrackingFactory.startSidebar();
        }
    });
});


core.controller('WebcamCtrl', function($scope, WebcamFactory, TrackingFactory) {
    let video = document.getElementById('webcam');
    let canvas = document.getElementById('large-canvas');

    // WebcamFactory.startWebcam(video);

    $scope.$watch('$viewContentLoaded', function() {
        // TrackingFactory.startTracking(canvas, video);
    });


    
});