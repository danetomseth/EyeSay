// Analysis of tracker positions.
core.factory('PositionFactory', function() {
    const detector = new EyeSayLib.BlinkDetector(150);

    const service = {
        // Latest eye-openness reading (both eyes), for graphs.
        eyeValue: 0,
    };

    service.getBlinkValue = (positions) => {
        if (positions) service.eyeValue = EyeSayLib.eyeOpenness(positions);
        return service.eyeValue;
    };

    // Returns 'singleBlink' on the frame a blink starts, otherwise null.
    service.detectBlink = (positions, user, now) => {
        const value = service.getBlinkValue(positions);
        return detector.update(value, Number(user.blinkZero), Number(user.blinkRatio), now);
    };

    return service;
});
