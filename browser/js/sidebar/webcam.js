core.directive('blSidebarWebcam', function(TimerFactory, $rootScope, WebcamFactory, TrackingFactory) {
    return {
        restrict: 'E',
        templateUrl: 'js/sidebar/webcam.html',
        link: function(scope) {

            let containerWidth = angular.element(document.getElementById('sidebar-webcam-container'))[0].clientWidth

            scope.containerHeight = containerWidth * .75 + 'px';
            scope.videoWidth = (containerWidth * 2) + 'px';
            scope.videoHeight = (containerWidth * 2) * 0.75 + 'px';

            let positionSetWidth = (containerWidth / -2) + 'px';
            let positionSetHeight = (containerWidth / -2) * .75 + 'px';


            let video = document.getElementById('sidebar-webcam');
            let canvas = document.getElementById("sidebar-canvas");

            scope.webcamCss = {
                'top': positionSetHeight,
                'left': positionSetWidth
            }

            scope.canvasCss = {
                'top': positionSetHeight,
                'left': positionSetWidth
            }

            scope.webcamDir = {
                'height': containerWidth * .75 + 'px'
            }

            WebcamFactory.startWebcam(video);

            $rootScope.videoActive = true;



            //All of this logic is to set bounding box canvas
            scope.$watch('$viewContentLoaded', function() {
                let boundingBox = document.getElementById("canvas-overlay");
                let ctx = boundingBox.getContext("2d");
                let middleX = containerWidth - (containerWidth / 4);
                let middleY = (containerWidth * .75) - ((containerWidth / 3.1));
                let canvasWidth = (containerWidth / 4) * 2;
                let canvasHeight = ((containerWidth / 3) * .75) * 2.5;
                ctx.strokeStyle = "rgba(130,255,50, 0.5)";
                ctx.strokeRect(middleX, middleY, canvasWidth, canvasHeight);
                TrackingFactory.startTracking(canvas, video, [middleX, middleY, canvasWidth, canvasHeight]);

            });
            // start all our things



        }
    }
});