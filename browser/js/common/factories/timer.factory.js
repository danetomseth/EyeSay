//this sets all of timer dependent functions to the same intervals to clear on state change

core.factory('TimerFactory', function($rootScope, Session, $state, PositionFactory, TrackingFactory, ActionFactory, ConstantsFactory) {

    let iterationTime = ConstantsFactory.settings.cursorDelay.value; //used directly down below (32)
    let startTime = 0;
    let frameId = 0;
    let trackingStopped = false;


  

    function loop (timestamp){

        // Always draw the face on the tracker
        if(!ConstantsFactory.settings.blinkActive.value) {
            frameId = requestAnimationFrame(loop);
            return
        }

        TrackingFactory.drawLoop();


        if (timestamp - startTime > ConstantsFactory.settings.cursorDelay.value){
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
    }

});
