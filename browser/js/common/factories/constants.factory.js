core.factory('ConstantsFactory', function($rootScope, $http, SettingsFactory, Session) {
    let obj = {};

    let guest = {
        blinkZero: {
            label: 'Blink Zero',
            value: 42,
            number: true
        },
        blinkRatio: {
            label: 'Blink Ratio',
            value: 0.78,
            number: true
        },
        cursorDelay: {
            label: 'Cursor Delay',
            value: 750,
            number: true
        },
        blinkActive: {
            label: 'Blink Active',
            value: true,
            number: false
        },
        doubleBlink: {
            label: 'Double Blink Function',
            value: false,
            number: false
        },
        webcamActive: {
            label: 'Webcam Status',
            value: true,
            number: false
        }
    }


    if (Session.user) {
        obj.settings = {
            blinkZero: {
                label: 'Blink Zero',
                value: user.blinkZero,
                number: true
            },
            blinkRatio: {
                label: 'Blink Ratio',
                value: user.blinkRatio,
                number: true
            },
            cursorDelay: {
                label: 'Cursor Delay',
                value: user.cursorDelay,
                number: true
            },
            blinkActive: {
                label: 'Blink Active',
                value: user.blinkActive,
                number: false
            },
            doubleBlink: {
                label: 'Double Blink Function',
                value: user.doubleBlink,
                number: false
            },
            webcamActive: {
                label: 'Webcam Status',
                value: user.webcamActive,
                number: false
            }
        }
    } else {
        obj.settings = guest;
    }


    ///Settings


    obj.setUser = (user) => {
        if (user) {
            obj.settings = {
                blinkZero: {
                    label: 'Blink Zero',
                    value: user.blinkZero,
                    number: true
                },
                blinkRatio: {
                    label: 'Blink Ratio',
                    value: user.blinkRatio,
                    number: true
                },
                cursorDelay: {
                    label: 'Cursor Delay',
                    value: user.cursorDelay,
                    number: true
                },
                blinkActive: {
                    label: 'Blink Active',
                    value: user.blinkActive,
                    number: false
                },
                doubleBlink: {
                    label: 'Double Blink Function',
                    value: user.doubleBlink,
                    number: false
                },
                webcamActive: {
                    label: 'Webcam Status',
                    value: user.webcamActive,
                    number: false
                }
            }
        } else {
            obj.settings = guest;
        }

    }



    obj.setBlink = (ratio, zero) => {
        if (Session.user) {
            let user = Session.user;
            user.blinkZero = zero;
            user.blinkRatio = ratio;
            $http.put('/api/users/update', user).then(res => {
                console.log('resp', res.data);
                obj.setUser(res.data);
            })
        }
        else {
        	guest.blinkZero.value = zero;
        	guest.blinkRatio.value = ratio;
        	obj.setUser(false);
        }

    }


    obj.saveUser = (key, value) => {
        let user = Session.user;
        user[key] = value;
        $http.put('/api/users/update', user)
    }


    return obj;

});