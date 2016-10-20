core.factory('ConstantsFactory', function($rootScope, $http, Session, AUTH_EVENTS) {
    let obj = {};




    let guestSettings = {
        blinkZero: 42,
        blinkRatio: 0.78,
        cursorDelay: 750,
        blinkActive: true,
        calibrated: false,
        blinkProfile: []
    }



    let saveUser = () => {
        
        if (Session.user) {
            $http.put('/api/users/update/' + Session.user._id, $rootScope.user).then(res => {
                $rootScope.user = res.data;
            })
        }

       
    }


    obj.saveCalibration = (blinkRatio, blinkZero, blinkProfile) => {
        let blinkData = {
            blinkRatio: blinkRatio,
            blinkZero: blinkZero,
            blinkProfile: blinkProfile,
            userId: 'guest'
        }
        if(Session.user) {
             blinkData.userId = Session.user._id;
        }

         $http.post('/api/blinkdata/', blinkData).then(res => {
            console.log("post response", res.data);
        })
    }


    obj.setUser = (user) => {
        console.log("logging out", user);
        if (user) {
            $rootScope.user = user;
        } else {
            console.log("setting as guest");
            $rootScope.user = guestSettings;
        }
    }


    obj.setBlink = (ratio, zero, profile) => {
        $rootScope.user.blinkZero = zero;
        $rootScope.user.blinkRatio = ratio;
        $rootScope.user.calibrated = true;
        $rootScope.user.blinkProfile = profile;
        saveUser()
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

        saveUser()
    }

    obj.toggleTracking = (value) => {
        return obj.user.blinkActive
    }


    return obj;

});