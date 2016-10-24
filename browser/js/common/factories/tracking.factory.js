'use strict';

core.factory('TrackingFactory', function($rootScope, DialogFactory) {
    let canvas;
    let context;
    let tracker;
    let ctx;
    let video;
    let trackingBox = [0, 0, 0, 0]; // middleX, middleY, containerWidth, containerHeight
    $rootScope.trackerInitialized = false;

    let trackObj = {};

    trackObj.startTracking = (canvasElem, video, boundingBox) => {
        //new tracker
        tracker = new clm.tracker({
            searchWindow: 5
        });
        // tracker = new clm.tracker;
        tracker.init(pModel);
        canvas = canvasElem;
        context = canvas.getContext("2d");
        //helps remove the error when tracker first loads
        // Avoids cannot get response model on point XX


        setTimeout(function() {
            tracker.setResponseMode("blend", ["raw", "sobel"]);
            boundingBox ? tracker.start(video, boundingBox) : tracker.start(video);
            $rootScope.$broadcast("trackerInitialized");
            $rootScope.trackerInitialized = true;
        }, 500);
    };

    trackObj.startSidebar = () => {
        let containerWidth = angular.element(document.getElementById('sidebar-webcam-container'))[0].clientWidth
        let boundingBox = document.getElementById("canvas-overlay");
        ctx = boundingBox.getContext("2d");
        video = document.getElementById('sidebar-webcam');
        canvas = document.getElementById("sidebar-canvas");
        trackingBox[0] = containerWidth - (containerWidth / 4);
        trackingBox[1] = (containerWidth * .75) - ((containerWidth / 3.1));
        trackingBox[2] = (containerWidth / 4) * 2;
        trackingBox[3] = ((containerWidth / 3) * .75) * 2.5;

        ctx.strokeStyle = "rgba(130,255,50, 0.5)";
        ctx.strokeRect(trackingBox[0], trackingBox[1], trackingBox[2], trackingBox[3]);

        trackObj.startTracking(canvas, video, trackingBox);
    }

    trackObj.drawLoop = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        tracker.draw(canvas);
    };
    trackObj.convergence = () => {
        return tracker.getConvergence();
    }

    trackObj.getPositions = () => {
        return tracker.getCurrentPosition();
    };
    trackObj.checkTracking = () => {
        if (tracker.getConvergence() > 75) {
            DialogFactory.checkTracking();
            return true;
        } else return false
    }



    $rootScope.$on("WebcamInitialized", () => {
        trackObj.startSidebar()
    })

    return trackObj;
});