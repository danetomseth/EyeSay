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
    } else {
        obj.user = obj.guestSettings;
    }


    ///Settings


    obj.setUser = (user) => {
        if (user) {
            obj.user = user;
        } else {
            obj.user = obj.guestSettings;
        }
        $rootScope.user = obj.user;
    }

    obj.getUser = () => {
        return obj.user
    }



    obj.setBlink = (ratio, zero) => {
        if (Session.user) {
            obj.blinkZero = zero;
            obj.blinkRatio = ratio;
            $http.put('/api/users/update', user).then(res => {
                obj.setUser(res.data);
            })
        } else {
            obj.user.blinkZero = zero;
            obj.user.blinkRatio = ratio;
            obj.setUser(false);
        }

    }


    obj.saveUser = (key, value) => {
        if (!Session.user) {
            obj.user[key] = value;
        } else {
            let user = obj.user;
            user[key] = value;
            $http.put('/api/users/update', user).then(res => {
                obj.setUser(res.data);
                obj.user = res.data;
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

        obj.saveUser(key, obj.user[key])
    }

    obj.toggleTracking = (value) => {
        // obj.user.blinkActive = value;
        return obj.user.blinkActive
    }


    return obj;

});