// Live graph of eye openness against the blink threshold.
core.directive('blGraph', ($rootScope, TimerFactory, LineChart) => {
    const POINTS = 300;
    return {
        restrict: 'AE',
        templateUrl: 'js/common/templates/live-graph.html',
        link: function(scope, element) {
            const canvas = element[0].querySelector('canvas');
            const values = new Array(POINTS).fill(NaN);
            let head = 0;
            let frame = null;

            const threshold = () => Number($rootScope.user.blinkZero) * Number($rootScope.user.blinkRatio);

            const render = () => {
                frame = null;
                const ordered = values.slice(head).concat(values.slice(0, head)).filter((v) => !Number.isNaN(v));
                const line = threshold();
                LineChart.draw(canvas, {
                    yMin: 10,
                    yMax: 50,
                    series: [
                        { values: ordered, color: 'rgb(33,150,243)' },
                        { values: ordered.length ? [line, line] : [], color: '#F5403A' },
                    ],
                });
            };

            scope.graphReady = $rootScope.trackerInitialized;
            const offReady = $rootScope.$on('trackerInitialized', () => { scope.graphReady = true; });

            // Collect a reading every tracked frame; draw at most once per animation frame.
            const offFrame = TimerFactory.onFrame((value) => {
                values[head] = value;
                head = (head + 1) % POINTS;
                if (!frame) frame = requestAnimationFrame(render);
                if (!scope.graphReady) {
                    scope.graphReady = true;
                    return true;
                }
                return false;
            });

            scope.$on('$destroy', () => {
                offFrame();
                offReady();
                if (frame) cancelAnimationFrame(frame);
            });
        }
    };
});
