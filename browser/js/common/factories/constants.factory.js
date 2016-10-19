core.factory('ConstantsFactory', function($rootScope, $http, SettingsFactory, Session) {
    let obj = {};


    let guestSettings = {
        blinkZero: 42,
        blinkRatio: 0.78,
        cursorDelay: 750,
        blinkActive: true,
        calibrated: false,
        blinkProfile: []
    }


    if (Session.user) {
        $rootScope.user = Session.user;
    } else {
        $rootScope.user = guestSettings;
    }


    let saveUser = () => {
        $http.put('/api/users/update', $rootScope.user).then(res => {
            $rootScope.user = res.data;
        })
    }



    obj.setUser = (user) => {
        if (user) {
            $rootScope.user = user;
        } else {
            $rootScope.user = guestSettings;
        }
    }


    obj.setBlink = (ratio, zero, profile) => {
        $rootScope.user.blinkZero = zero;
        $rootScope.user.blinkRatio = ratio;
        $rootScope.user.calibrated = true;
        $rootScope.user.blinkProfile = profile;
        if (Session.user) {
            saveUser()
        }
    }


    

    obj.adjustValue = (add, key) => {
        if (add) {
            $rootScope.user[key] += ($rootScope.user[key] * .02);
        } else {
            $rootScope.user[key] -= ($rootScope.user[key] * .02);
        }

        if ($rootScope.user[key] < 1) {
            $rootScope.user[key] = ($rootScope.user[key].toFixed(3)) / 1;
        } else if ($rootScope.user[key] < 100) {
            $rootScope.user[key] = ($rootScope.user[key].toFixed(3)) / 1;
        } else {
            $rootScope.user[key] = Math.floor($rootScope.user[key])
        }

        if (Session.user) {
            saveUser()
        }
    }

    obj.toggleTracking = (value) => {
        return obj.user.blinkActive
    }


    return obj;

});