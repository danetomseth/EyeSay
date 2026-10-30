// Owns the camera stream.
core.factory('WebcamFactory', function($rootScope, $timeout, $q, DialogFactory) {
    const MAX_RETRIES = 5;
    let video;
    let stream;
    let retries = 0;
    let retryTimer;

    $rootScope.videoActive = false;

    const describe = (err) => {
        switch (err && err.name) {
            case 'NotAllowedError':
            case 'SecurityError':
                return 'Camera access was blocked. Allow camera access for this site in your browser settings, then try again.';
            case 'NotFoundError':
            case 'OverconstrainedError':
                return 'No webcam was found. Connect a webcam and try again.';
            case 'NotReadableError':
                return 'The webcam is being used by another application. Close it and try again.';
            default:
                return 'The webcam could not be started.';
        }
    };

    const fail = (err) => {
        console.warn('Webcam error', err);
        $rootScope.videoActive = false;
        // Permission problems won't fix themselves; transient ones get a few retries.
        const permanent = err && ['NotAllowedError', 'SecurityError', 'NotFoundError'].includes(err.name);
        if (!permanent && retries < MAX_RETRIES) {
            retries++;
            retryTimer = $timeout(() => service.start(video), 1000 * retries);
        } else {
            DialogFactory.webcamFail(describe(err), () => {
                retries = 0;
                service.start(video);
            });
        }
    };

    const service = {
        start(videoElem) {
            video = videoElem;
            $timeout.cancel(retryTimer);
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                return $q.reject(fail({ name: 'Unsupported' }));
            }
            return $q.when(navigator.mediaDevices.getUserMedia({
                audio: false,
                video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
            }))
            .then((s) => {
                stream = s;
                video.srcObject = s;
                return video.play().catch(() => {}); // autoplay is allowed for muted video
            })
            .then(() => {
                retries = 0;
                $rootScope.videoActive = true;
                $rootScope.$broadcast('WebcamInitialized', video);
            })
            .catch(fail);
        },
        stop() {
            if (stream) stream.getTracks().forEach((t) => t.stop());
            stream = null;
            $rootScope.videoActive = false;
        },
    };
    return service;
});
