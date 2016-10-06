core.factory('WebcamFactory', function($rootScope, $state, DialogFactory) {

    // Subscribe to event.
    $rootScope.trackingInit = false;


    // Emit event.


    let errorCallback = function(e) {
        console.log('Error connecting to source!', e);
        DialogFactory.webcamFail();
        //$state.reload();
    };

    $rootScope.videoActive = false;
    return {
        startWebcam: (videoElem) => {
            //starts webcam
            if (Modernizr.getusermedia) {
                var gUM = Modernizr.prefixed('getUserMedia', navigator);
                gUM({
                    video: true
                }, function(stream) {
                    $rootScope.videoStream = stream;
                    $rootScope.videoActive = true;
                    videoElem.src = window.URL.createObjectURL($rootScope.videoStream);
                }, errorCallback);

            }
            else {
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
