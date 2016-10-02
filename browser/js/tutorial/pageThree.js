core.directive("blTutorialThree", ($rootScope) => {
    return {
        restrict: 'E',
        templateUrl: 'js/tutorial/pageThree.html',
        link: (scope, elem, attr) => {
            // $rootScope.$on("fillBar", () => {
            //     console.log("fill", scope.blinkCount);
            //     scope.blinkCount++
            //     scope.blinkFill = (scope.blinkCount / 10) * 100;
            //     if (scope.blinkCount === 10) {
            //         scope.blinkCount = 0;
            //         scope.blinkFill = 0;
            //         $rootScope.$emit("nextTab");
            //     }
            // })
           

        }

    }
});