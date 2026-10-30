// Two-phase calibration:
//   open   – sample eye openness with eyes open → blinkZero (trimmed mean)
//   closed – user blinks repeatedly; frames well below blinkZero are blink samples
//            → blinkRatio = mean(blink samples) / blinkZero
core.factory('CalibrateFactory', function($rootScope, ConstantsFactory, TimerFactory, ActionFactory) {
    const OPEN_SAMPLES = 101;
    const OPEN_SAMPLE_MS = 25;
    const CLOSED_SAMPLES = 100;
    const CLOSED_WARMUP_FRAMES = 50; // ignore the first frames after the dialog closes
    const PROFILE_MAX = 400;

    const service = {};
    let openSamples = [];
    let closedSamples = [];
    let blinkProfile = [];
    let maxAvg = 0;
    let frames = 0;
    let lastSample = 0;
    let unsubscribe = null;

    const stopSampling = () => {
        if (unsubscribe) unsubscribe();
        unsubscribe = null;
    };

    service.reset = () => {
        stopSampling();
        service.openCalibrationComplete = false;
        service.closedCalibrationComplete = false;
        service.calibrationSet = false;
        service.openCount = 0;
        service.closedCount = 0;
        openSamples = [];
        closedSamples = [];
        blinkProfile = [];
        maxAvg = 0;
        frames = 0;
        lastSample = 0;
    };
    service.reset();

    const sample = (handler) => {
        stopSampling();
        $rootScope.user.blinkActive = true; // calibration needs the tracker running
        unsubscribe = TimerFactory.onFrame((value, now) => {
            if (!ActionFactory.isActive('calibrate')) {
                stopSampling();
                return false;
            }
            return handler(value, now);
        });
    };

    service.runOpenCalibration = () => {
        sample((value, now) => {
            if (now - lastSample < OPEN_SAMPLE_MS) return false;
            lastSample = now;
            openSamples.push(value);
            service.openCount = Math.min(100, Math.round((openSamples.length / OPEN_SAMPLES) * 100));
            if (openSamples.length >= OPEN_SAMPLES) {
                stopSampling();
                maxAvg = EyeSayLib.trimmedMean(openSamples, 0.2, 0.9);
                service.openCalibrationComplete = true;
            }
            return true;
        });
    };

    service.runClosedCalibration = () => {
        frames = 0;
        sample((value) => {
            frames++;
            if (frames < CLOSED_WARMUP_FRAMES) return false;
            if (blinkProfile.length < PROFILE_MAX) blinkProfile.push({ x: blinkProfile.length + 1, y: value });
            if (value < maxAvg * 0.92) closedSamples.push(value);
            service.closedCount = Math.min(CLOSED_SAMPLES, closedSamples.length);
            if (closedSamples.length >= CLOSED_SAMPLES) {
                stopSampling();
                const minAvg = EyeSayLib.trimmedMean(closedSamples, 0.2, 1);
                const zero = Math.round(maxAvg * 100) / 100;
                const ratio = Math.round((minAvg / maxAvg) * 100) / 100;
                ConstantsFactory.setBlink(ratio, zero, blinkProfile);
                service.closedCalibrationComplete = true;
                service.calibrationSet = true;
            }
            return true;
        });
    };

    return service;
});
