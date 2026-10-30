// Sidebar webcam preview. The video is rendered at twice the container width and
// offset so the container shows a zoomed-in crop around the face.
core.directive('blSidebarWebcam', function($rootScope, WebcamFactory, TrackingFactory) {
    return {
        restrict: 'E',
        templateUrl: 'js/sidebar/webcam.html',
        link: function(scope, element) {
            const container = element[0].querySelector('#sidebar-webcam-container');
            const video = element[0].querySelector('#sidebar-webcam');
            const meshCanvas = element[0].querySelector('#sidebar-canvas');
            const overlay = element[0].querySelector('#canvas-overlay');

            const width = Math.round(container.clientWidth || element[0].parentElement.clientWidth || 200);
            const videoWidth = width * 2;
            const videoHeight = Math.round(videoWidth * 0.75);

            container.style.height = Math.round(width * 0.75) + 'px';
            [video, meshCanvas, overlay].forEach((el) => {
                el.width = videoWidth;
                el.height = videoHeight;
                el.style.top = Math.round(width * -0.375) + 'px';
                el.style.left = Math.round(width / -2) + 'px';
            });

            scope.$on('WebcamInitialized', () => TrackingFactory.init(video, meshCanvas, overlay));

            if ($rootScope.browserSupported) {
                WebcamFactory.start(video);
            }
        }
    };
});
