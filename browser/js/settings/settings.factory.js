core.factory('SettingsFactory', function($rootScope, $http, ActionFactory) {
    // ROWS: "Keyboard", "Features", "NAV"

 

    $rootScope.$on("iterate", () => {
        // if(ActionFactory.isActive('settings')){
        //     if (iterateRow) {
        //         settingsObj.selections.row = settingsObj.moveSelected();
        //     }
        //     else {settingsObj.selections[currentRow] = settingsObj.iterateOption();}
        // }
    });

    $rootScope.$on("singleBlink", () => {
        // if(ActionFactory.isActive('settings')){
        //     if (iterateRow) {
        //         settingsObj.selectRow();
        //     }
        //     else {
        //         settingsObj.selectOption();
        //     }
        // }
    })

    let settingsObj = {
    }

    return settingsObj;
});
