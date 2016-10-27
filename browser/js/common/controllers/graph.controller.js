core.controller('GraphCtrl', function($scope, $rootScope, PositionFactory, TrackingFactory) {

    // let elem = angular.element(document.querySelector('#graph-content'))[0];

    var data = []
    let totalPoints = 300;
    let thresholdLine = [];
    var updateInterval = 30;


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
                y = PositionFactory.getBlinkValue(TrackingFactory.getPositions());
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
            res.push([i, userThreshold]);
        }

        return res;
    }

    // Set up the control widget
    function update() {
        if ($rootScope.trackerInitialized) {
            console.log("updating");
            plot.setData([{
                label: "Current Eye Area",
                data: getRandomData()
            }, {
                label: "Blink Threshold",
                data: getThreshold()
            }]);
            plot.draw();
        }
        setTimeout(update, updateInterval);
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
                show: true,
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
                max: 60,
                tickColor: 'rgba(0, 0, 0, 0.06)',
                font: {
                    color: 'rgba(0, 0, 0, 0.4)'
                }
            },
            xaxis: {
                show: false
            },
            colors: ['rgb(33,150,243)', 'rgb(255,87,34)']


            //warn rgb(255,87,34)
            //primary rgb(33,150,243)
            //secondary rgb(105,240,174)
        });
        update();
    }





    // Since the axes don't change, we don't need to call plot.setupGrid()


    let waitForPositions = () => {
        if ($rootScope.trackerInitialized) {
            $scope.graphReady = true;
            startGraph();
            return
        } else {
            setTimeout(waitForPositions, 500)
        }
    }

            waitForPositions();


    $scope.$on('$viewContentLoaded',
        function() {
        });




});