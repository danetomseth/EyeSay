core.directive('blSidebarWebcam', function($rootScope, WebcamFactory, $timeout) {
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
            // let canvas = document.getElementById("sidebar-canvas");

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



            scope.$watch('$viewContentLoaded', function() {
                console.log("is chrome", $rootScope.isChrome);
                if($rootScope.isChrome) {
                    WebcamFactory.startWebcam(video);
                }
                
            });
            // start all our things



        }
    }
});