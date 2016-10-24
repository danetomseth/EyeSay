core.directive('blGraph', () => {
	return {
		restrict: 'AE',
		templateUrl: 'js/common/templates/live-graph.html',
		controller: "GraphCtrl",
		link: function(scope, element, attr) {
		}
	}
});