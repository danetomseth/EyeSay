// The single per-frame loop that drives the app.
//
// Every animation frame (while tracking is on) it draws the face mesh, reads the
// tracker, and emits:
//   'iterate'     every user.cursorDelay ms — advances keyboard/nav highlights
//   'singleBlink' when a blink is detected — selects
// Other code can also subscribe to raw frames with onFrame().
//
// Angular only digests when one of those events fires (or a frame handler asks
// for it), instead of on every frame as before.
core.factory('TimerFactory', function($rootScope, PositionFactory, TrackingFactory) {
    const PROGRESS_DIGEST_MS = 100;
    const frameHandlers = new Set();
    let startTime = 0;
    let lastDigest = 0;
    let frameId = null;

    const digest = (now) => {
        lastDigest = now;
        if (!$rootScope.$$phase) $rootScope.$digest();
    };

    const loop = (timestamp) => {
        frameId = requestAnimationFrame(loop);
        const user = $rootScope.user;
        if (!user || !user.blinkActive || !TrackingFactory.isRunning()) return;

        TrackingFactory.draw();
        let needsDigest = false;
        let wantsProgress = false;

        if (timestamp - startTime > user.cursorDelay) {
            startTime = timestamp;
            $rootScope.$emit('iterate');
            needsDigest = true;
        }

        const positions = TrackingFactory.getPositions();
        if (positions) {
            const blink = PositionFactory.detectBlink(positions, user, timestamp);
            frameHandlers.forEach((handler) => {
                if (handler(PositionFactory.eyeValue, timestamp)) wantsProgress = true;
            });
            if (blink) {
                startTime = timestamp; // give the user a full interval after selecting
                $rootScope.$emit(blink);
                needsDigest = true;
            }
        }

        if (needsDigest || (wantsProgress && timestamp - lastDigest > PROGRESS_DIGEST_MS)) {
            digest(timestamp);
        }
    };

    return {
        start() {
            if (frameId === null) frameId = requestAnimationFrame(loop);
        },
        resetBlinkTime() {
            startTime = performance.now();
        },
        // handler(eyeValue, timestamp) runs on every tracked frame; return true to
        // request a (throttled) digest. Returns an unsubscribe function.
        onFrame(handler) {
            frameHandlers.add(handler);
            return () => frameHandlers.delete(handler);
        },
    };
});
