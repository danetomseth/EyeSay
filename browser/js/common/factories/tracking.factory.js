'use strict';

core.factory('TrackingFactory', function($rootScope, DialogFactory) {
    let canvas;
    let context;
    let tracker;
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

        setTimeout(function() {
            tracker.setResponseMode("blend", ["raw", "sobel"]);
            if (boundingBox) {
                console.log('tracking, bounding box');
                tracker.start(video, boundingBox);
            } else {
                console.log("tracking, no box");
                tracker.start(video);
            }
            $rootScope.$broadcast("trackerInitialized")
        }, 2000);

    };

    trackObj.startSidebar = () => {
        var containerWidth = angular.element(document.getElementById('sidebar-webcam-container'))[0].clientWidth
        var boundingBox = document.getElementById("canvas-overlay");
        var ctx = boundingBox.getContext("2d");
        var video = document.getElementById('sidebar-webcam');
        var canvas = document.getElementById("sidebar-canvas");
        var middleX = containerWidth - (containerWidth / 4);
        var middleY = (containerWidth * .75) - ((containerWidth / 3.1));
        var canvasWidth = (containerWidth / 4) * 2;
        var canvasHeight = ((containerWidth / 3) * .75) * 2.5;

        ctx.strokeStyle = "rgba(130,255,50, 0.5)";
        ctx.strokeRect(middleX, middleY, canvasWidth, canvasHeight);

        trackObj.startTracking(canvas, video, [middleX, middleY, canvasWidth, canvasHeight]);
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

    return trackObj;
});