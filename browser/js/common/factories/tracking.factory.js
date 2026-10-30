'use strict';
// Wraps clmtrackr. The tracker only runs while blink tracking is switched on,
// since face fitting is by far the most CPU-intensive thing the app does.
core.factory('TrackingFactory', function($rootScope, $timeout, DialogFactory) {
    let tracker;
    let video;
    let canvas;
    let context;
    let box;
    let running = false;

    $rootScope.trackerInitialized = false;

    const service = {};

    const run = () => {
        if (running || !tracker || !video) return;
        running = true;
        tracker.start(video, box);
    };

    const halt = () => {
        if (!running) return;
        running = false;
        tracker.stop();
        tracker.reset();
        if (context) context.clearRect(0, 0, canvas.width, canvas.height);
    };

    // videoElem: playing <video>; drawCanvas: face mesh layer; overlay: guide box layer
    service.init = (videoElem, drawCanvas, overlay) => {
        video = videoElem;
        canvas = drawCanvas;
        context = canvas.getContext('2d');

        // Where to look for the face first: the middle of the visible (cropped) area.
        const w = video.width;
        box = [w / 3, w * 0.2083, w * 0.325, w * 0.3438];
        const ctx = overlay.getContext('2d');
        ctx.clearRect(0, 0, overlay.width, overlay.height);
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#2196f3';
        ctx.strokeRect(box[0], box[1], box[2], box[3]);

        if (!tracker) {
            tracker = new clm.tracker({ searchWindow: 5 });
            tracker.init(pModel);
        }

        // clmtrackr needs a moment after init before its response models are ready.
        $timeout(() => {
            tracker.setResponseMode('blend', ['raw', 'sobel']);
            if ($rootScope.user.blinkActive) run();
            $rootScope.trackerInitialized = true;
            $rootScope.$broadcast('trackerInitialized');
        }, 1500);
    };

    service.isRunning = () => running;

    service.draw = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        tracker.draw(canvas);
    };

    service.convergence = () => (tracker && running ? tracker.getConvergence() : Infinity);

    service.getPositions = () => (running ? tracker.getCurrentPosition() : false);

    service.checkTracking = () => {
        if (service.convergence() > 75) {
            DialogFactory.checkTracking();
            return true;
        }
        return false;
    };

    $rootScope.$watch('user.blinkActive', (active) => {
        if (!$rootScope.trackerInitialized) return;
        if (active) run();
        else halt();
    });

    return service;
});
