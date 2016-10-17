core.directive('blSize', function() {
    return {
        restrict: 'A',
        // scope: {
        // 	setHeight: '&blHeight'
        // },
        link: function(scope, element, attr) {
            //bl-height attr in format w x h
            let size = attr.blSize.split('x');

            if (size[0].length) {
                element.css({
                    'min-width': size[0] + 'px'
                });
            }

            if (size[1].length) {
                element.css({
                    'min-height': size[1] + 'px'
                });
            }
        }
    }
});