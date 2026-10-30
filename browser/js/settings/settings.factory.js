core.factory('SettingsFactory', function($rootScope, LineChart) {
    return {
        // Draws the saved calibration blink profile with the current blink threshold.
        createGraph(canvas) {
            const profile = ($rootScope.user.blinkProfile || []).map((p) => Number(p.y)).filter(Number.isFinite);
            const threshold = Number($rootScope.user.blinkZero) * Number($rootScope.user.blinkRatio);
            LineChart.draw(canvas, {
                yMin: Math.min(...profile, threshold) - 2,
                yMax: Math.max(...profile, threshold) + 2,
                xLabel: 'Tracking Time',
                yLabel: 'Eye Area',
                series: [
                    { values: profile, color: 'rgba(75,192,192,1)', width: 1.5 },
                    { values: [threshold, threshold], color: 'red', width: 1.5 },
                ],
            });
        },
    };
});
