core.directive('blGrow', function($interval) {
    return {
        restrict: 'A',
        link: function(scope, element, attr) {
            let init = attr.blGrow;
            element.addClass("transformable")
            element.css({
                'height': init + 'px'
            })

            element.on('mouseenter', function() {

                element.css({
                    'height': '150px'
                })
            });
            element.on('mouseleave', function() {
                element.css({
                    'height': init + 'px'
                })
            });
        }
    }
});