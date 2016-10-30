core.directive('blGraph', ($rootScope, PositionFactory, TrackingFactory) => {
    return {
        restrict: 'AE',
        templateUrl: 'js/common/templates/live-graph.html',
        link: function(scope, element, attr) {
            var data = []
            let totalPoints = 300;
            let thresholdLine = [];
            var updateInterval = 30;
            let drawingActive;
            scope.graphReady = false;


            let userThreshold = ($rootScope.user.blinkZero * $rootScope.user.blinkRatio);


            let plot;

            function getRandomData() {


                if (data.length > 0)
                    data = data.slice(1);

                // Do a random walk

                while (data.length < totalPoints) {
                    let y;

                    var prev = data.length > 0 ? data[data.length - 1] : 50;

                    if ($rootScope.trackerInitialized) {
                        y = PositionFactory.eyeValue;
                        // y = PositionFactory.getBlinkValue(TrackingFactory.getPositions());
                    } else {
                        console.log("waiting on values");
                        y = 50;
                    }


                    if (y < 0) {
                        y = 0;
                    } else if (y > 100) {
                        y = 100;
                    }

                    data.push(y);
                }

                // Zip the generated y values with the x values

                var res = [];
                let resThreshold = [];
                for (var i = 0; i < data.length; ++i) {
                    res.push([i, data[i]])
                    resThreshold.push([i, userThreshold]);
                }
                thresholdLine = resThreshold;

                return res;
            }


            let getThreshold = () => {
                var res = [];
                for (var i = 0; i < data.length; ++i) {
                    res.push([i, ($rootScope.user.blinkZero * $rootScope.user.blinkRatio)]);
                }

                return res;
            }

            // Set up the control widget
            function update() {
                if ($rootScope.trackerInitialized) {
                    plot.setData([{
                        label: "Current Eye Area",
                        data: getRandomData()
                    }, {
                        label: "Blink Threshold",
                        data: getThreshold()
                    }]);
                    plot.draw();
                }
                if(drawingActive) {
                	requestAnimationFrame(update);
                }
            }


            let startGraph = () => {
                plot = $.plot("#live-data", [{
                    label: "Current Eye Area",
                    data: getRandomData()
                }, {
                    label: "Blink Threshold",
                    data: getThreshold()
                }], {

                    series: {
                        lines: {
                            show: true,
                            lineWidth: 2
                                // fill: 0.5,
                                // fillColor: {
                                //     colors: [{
                                //         opacity: 0.5
                                //     }, {
                                //         opacity: 0.08
                                //     }]
                                // }
                        },
                        shadowSize: 0 // Drawing is faster without shadows
                    },
                    legend: {
                        show: false,
                        position: "nw",
                        margin: 5,
                        backgroundColor: '#FFF',
                        backgroundOpacity: 1

                    },
                    grid: {
                        labelMargin: 10,
                        hoverable: true,
                        clickable: true,
                        borderWidth: 1,
                        borderColor: 'rgb(82, 167, 224)'
                    },
                    yaxis: {
                        min: 10,
                        max: 50,
                        tickColor: 'rgba(0, 0, 0, 0.06)',
                        font: {
                            color: 'rgba(0, 0, 0, 0.4)'
                        }
                    },
                    xaxis: {
                        show: false
                    },
                    colors: ['rgb(33,150,243)', '#F5403A']


                    //warn rgb(255,87,34)
                    //primary rgb(33,150,243)
                    //secondary rgb(105,240,174)
                });
                update();
            }





            // Since the axes don't change, we don't need to call plot.setupGrid()


            let waitForPositions = () => {
                if ($rootScope.trackerInitialized) {
                    scope.graphReady = true;
                    drawingActive = true;
                    startGraph();
                    return
                } else {
                    setTimeout(waitForPositions, 500)
                }
            }

            waitForPositions();

            scope.$on(
                "$destroy",
                function handleDestroyEvent() {
                	drawingActive = false;
                }
            );


        }
    }
});