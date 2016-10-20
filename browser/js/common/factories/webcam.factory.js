core.factory('WebcamFactory', function($rootScope, $state, $timeout, DialogFactory) {

    // Subscribe to event.
    $rootScope.trackingInit = false;

    let currentVideo;
    let videoStream;


    // Emit event.


    let errorCallback = function(e) {
        console.log('Error connecting to source!', e);
        $timeout(() => {
            retryWebcam()
        }, 1000)
        DialogFactory.webcamFail();
        //$state.reload();
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


    return {
        startWebcam: (videoElem) => {
            //starts webcam
            currentVideo = videoElem
            if (Modernizr.getusermedia) {
                var gUM = Modernizr.prefixed('getUserMedia', navigator);
                gUM({
                    video: true
                }, function(stream) {
                    $rootScope.videoStream = stream;
                    videoStream = stream;
                    $rootScope.videoActive = true;
                    videoElem.src = window.URL.createObjectURL($rootScope.videoStream);
                    $rootScope.$broadcast("WebcamInitialized");
                }, errorCallback);

            } else {
                console.log("can't get user media");
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