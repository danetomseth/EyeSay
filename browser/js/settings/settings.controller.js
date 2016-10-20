core.controller('SettingsCtrl', function($scope, $rootScope, SettingsFactory, Session, ConstantsFactory, DialogFactory, WebcamFactory) {

    $scope.user = ConstantsFactory.user;
    let thresholdData = [];



    $scope.adjustValue = (add, key) => {
        ConstantsFactory.adjustValue(add, key);
    }



    var ctx = document.getElementById("blink-chart");

    let chartData = $rootScope.user.blinkProfile;
    if (chartData.length > 200) {
        chartData = chartData.slice(0, 200);
        console.log(chartData.length);
    }

    // chartData.forEach((elem) => {
    // 	let point = elem;
    // 	point.y = ($rootScope.user.blinkZero * $rootScope.user.blinkRatio);
    // 	thresholdData.push(point);
    // })

    thresholdData = chartData.map((elem, index) => {
        let point = {};
        point.x = index;
        point.y = ($rootScope.user.blinkZero * $rootScope.user.blinkRatio);
        return point
    })
    console.log(chartData);
    // var myChart = new Chart({})
    var scatterChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                    label: 'Blink Threshold',
                    data: thresholdData,
                    lineTension: 0.1,
                    pointBorderWidth: 1,
                    pointHoverBorderWidth: 1,
                    pointRadius: 1,
                    pointHitRadius: 1,
                    borderColor: "red",
                    responsive: false, 
                    fill: false
                },

                {
                    label: 'Tracking Data',
                    data: chartData,
                    lineTension: 0.1,
                    backgroundColor: "rgba(75,192,192,0.4)",
                    borderColor: "rgba(75,192,192,1)",
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: "rgba(75,192,192,1)",
                    pointBackgroundColor: "#fff",
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: "rgba(75,192,192,1)",
                    pointHoverBorderColor: "rgba(220,220,220,1)",
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    responsive: false
                }



            ]
        },
        options: {
            scales: {
                xAxes: [{
                    type: 'linear',
                    position: 'bottom',
                    scaleLabel: {
                	display: true,
                	labelString: "Tracking Time",
                	fontSize: 18,
                	fontColor: 'rgba(70,70,70,1)'
                }
                }],
                yAxes: [{
                    type: 'linear',
                    position: 'left',
                    scaleLabel: {
                	display: true,
                	labelString: "Eye Area",
                	fontSize: 18,
                	fontColor: 'rgba(70,70,70,1)'
                }
                }]
                
            },


            title: {
                display: true,
                text: 'Your Blink Profile',
                fontSize: 28,
                fontColor: 'rgba(70,70,70,1)',
                padding: 40
            },
            legend: {
            	position: 'bottom',
            	labels: {
            		boxWidth: 30,
            		fontSize: 18
            	}
            }
        }
    });



});