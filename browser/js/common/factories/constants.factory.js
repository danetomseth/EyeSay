core.factory('ConstantsFactory', function($rootScope, $http, SettingsFactory, Session) {
    let obj = {};


    obj.guestSettings = {
        blinkZero: 42,
        blinkRatio: 0.78,
        cursorDelay: 750,
        blinkActive: true
    } 


    if (Session.user) {
        obj.user = Session.user;
        //------
        $rootScope.user = Session.user;
    } else {
        obj.user = obj.guestSettings;
        //------
        $rootScope.user = obj.guestSettings;
    }


    ///Settings


    obj.setUser = (user) => {
        if (user) {
            obj.user = user;
            // ------
            $rootScope.user = user;
        } else {
            obj.user = obj.guestSettings;
            // ------
            $rootScope.user = obj.guestSettings;
        }
    }

    obj.getUser = () => {
        return obj.user
    }



    obj.setBlink = (ratio, zero) => {
        if (Session.user) {
            obj.blinkZero = zero;
            obj.blinkRatio = ratio;
            // -------
            $rootScope.user.blinkZero = zero;
            $rootScope.user.blinkRatio = ratio;
            $http.put('/api/users/update', user).then(res => {
                obj.setUser(res.data);
            })
        } else {
            obj.user.blinkZero = zero;
            obj.user.blinkRatio = ratio;
            // -------
            $rootScope.user.blinkZero = zero;
            $rootScope.user.blinkRatio = ratio;
            obj.setUser(false);
        }

    }


    obj.saveUser = (key, value) => {
        if (!Session.user) {
            obj.user[key] = value;
            // --------
            $rootScope.user[key] = value;
            console.log("Updated Guest", obj.user.blinkActive);
        } else {
            let user = obj.user;
            user[key] = value;
            // --------
            $rootScope.user[key] = value;

            $http.put('/api/users/update', user).then(res => {
                obj.setUser(res.data);
                obj.user = res.data;
                console.log("updated user", res.data);
            })
        }

    }

    obj.adjustValue = (add, key) => {
        if(add) {
            obj.user[key] += (obj.user[key] * .02);
        }
        else {
            obj.user[key] -= (obj.user[key] * .02);
        }

        if(obj.user[key] < 1) {
            obj.user[key] = (obj.user[key].toFixed(3)) / 1;
        }
        else if(obj.user[key] < 100) {
            obj.user[key] = (obj.user[key].toFixed(3)) / 1;
        }
        else {
            obj.user[key] = Math.floor(obj.user[key])
        }



        if(add) {
            $rootScope.user[key] += ($rootScope.user[key] * .02);
        }
        else {
            $rootScope.user[key] -= ($rootScope.user[key] * .02);
        }

        if($rootScope.user[key] < 1) {
            $rootScope.user[key] = ($rootScope.user[key].toFixed(3)) / 1;
        }
        else if($rootScope.user[key] < 100) {
            $rootScope.user[key] = ($rootScope.user[key].toFixed(3)) / 1;
        }
        else {
            $rootScope.user[key] = Math.floor($rootScope.user[key])
        }

        obj.saveUser(key, obj.user[key])
    }

    obj.toggleTracking = (value) => {
        // obj.user.blinkActive = value;
        return obj.user.blinkActive
    }


    return obj;

});