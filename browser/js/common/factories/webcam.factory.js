core.factory('WebcamFactory', function($rootScope, $state, $timeout, DialogFactory, ErrorFactory) {

    // Subscribe to event.
    $rootScope.trackingInit = false;

    let currentVideo;
    let videoStream;


    // Emit event.


    let errorCallback = function(e) {
        console.log('Error connecting to source!', e);
        $timeout(() => {
                console.log("retrying");
                retryWebcam()
            }, 1000)
            // DialogFactory.webcamFail();
    };

    $rootScope.videoActive = false;

    let retryWebcam = () => {
        if (Modernizr.getusermedia) {
            var gUM = Modernizr.prefixed('getUserMedia', navigator);
            gUM({
                video: true
            }, function(stream) {
                $rootScope.videoStream = stream;
                $rootScope.videoActive = true;
                currentVideo.src = window.URL.createObjectURL($rootScope.videoStream);
                $rootScope.$broadcast("WebcamInitialized");
            }, errorCallback);
        }
    }


  


    let userMediaError = () => {
        let message = "Error Connecting To Your Webcam";
        ErrorFactory.clientError(message);
    }





    return {
        startWebcam: (videoElem) => {
           
            currentVideo = videoElem
            if (Modernizr.getusermedia) {
                var gUM = Modernizr.prefixed('getUserMedia', navigator);
                gUM({
                    video: true
                }, function(stream) {
                    console.log("webcam started");
                    $rootScope.videoStream = stream;
                    videoStream = stream;
                    $rootScope.videoActive = true;
                    videoElem.src = window.URL.createObjectURL($rootScope.videoStream);
                    $rootScope.$broadcast("WebcamInitialized");
                }, errorCallback);

            } else {
                userMediaError();
            }
        },
        endWebcam: () => {
            $rootScope.videoStream.getVideoTracks()[0].stop();
        },
        restartWebcam: () => {
            $rootScope.videoStream.getVideoTracks()[0].start();
        }
    }
});