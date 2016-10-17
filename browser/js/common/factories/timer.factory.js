//this sets all of timer dependent functions to the same intervals to clear on state change

core.factory('TimerFactory', function($rootScope, Session, $state, PositionFactory, TrackingFactory, ActionFactory) {

    let iterationTime = $rootScope.user.cursorDelay; //used directly down below (32)
    let startTime = 0;
    let currentTimestamp
    let frameId = 0;
    let trackingStopped = false;

    function resetBlinkTime () {
        startTime = currentTimestamp;
    }
  

    function loop (timestamp){
        currentTimestamp = timestamp;
        // Always draw the face on the tracker
        if(!$rootScope.user.blinkActive) {
            frameId = requestAnimationFrame(loop);
            return
        }

        TrackingFactory.drawLoop();


        if (timestamp - startTime > $rootScope.user.cursorDelay){
            $rootScope.$emit("iterate")
            startTime = timestamp
        }

        let positions = TrackingFactory.getPositions();
        // Only run theses if we are tracking properly
        if (positions) {
            $rootScope.$digest();

            // Check for blink
            let blink = PositionFactory.blinkCompare(positions);

            if(blink){
                startTime = timestamp;
                $rootScope.$emit(blink) // emits "doubleBlink" or "singleBlink"
            }
        }
        // loop again
        frameId = requestAnimationFrame(loop);
    };

    $rootScope.$on("trackerInitialized", () => {
        loop();
    });

    $rootScope.$on('resumeBlink', function() {
        if(trackingStopped) {
            loop();
            trackingStopped = false;
        }
    });

    $rootScope.$on("cancelBlink", function() {
        trackingStopped = true;
        cancelAnimationFrame(frameId);
    });



    return {
        start: loop,
        resetBlinkTime: resetBlinkTime
    }

});
