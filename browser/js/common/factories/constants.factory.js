core.factory('ConstantsFactory', function($rootScope, $http, Session, AUTH_EVENTS, ErrorFactory) {
    let obj = {};




    let guestSettings = {
        blinkZero: 42,
        blinkRatio: 0.78,
        cursorDelay: 750,
        blinkActive: true,
        calibrated: false,
        blinkProfile: []
    }

    let saveSuccess = (res) => {
        console.log("res");
        $rootScope.user = res.data;
    }

    let saveFailed = (res) => {
        var err = new Error('Error Updating User')
        ErrorFactory.error(err.message, err)
            .then(res => {
            })
    }


    let saveUser = () => {
        if (Session.user) {
            
            $http.put('/api/users/update/' + Session.user._id, $rootScope.user).then(saveSuccess, saveFailed)
           
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

         $http.post('/api/blinkdata/', blinkData).then(saveSuccess, saveFailed)
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