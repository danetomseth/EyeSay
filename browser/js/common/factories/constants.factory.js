// Holds the current user's blink settings on $rootScope.user and persists them:
// to the server for logged-in users, to localStorage for guests (so a guest's
// calibration survives a page reload).
core.factory('ConstantsFactory', function($rootScope, $http, $timeout, Session, ErrorFactory) {
    const STORAGE_KEY = 'eyesay.guestSettings';
    const SETTING_KEYS = ['cursorDelay', 'blinkRatio', 'blinkZero', 'doubleBlink', 'blinkActive', 'calibrated', 'blinkProfile'];
    const GUEST_DEFAULTS = {
        blinkZero: 42,
        blinkRatio: 0.78,
        cursorDelay: 750,
        doubleBlink: false,
        blinkActive: true,
        calibrated: false,
        blinkProfile: [],
    };

    const storage = {
        read() {
            try {
                return JSON.parse(window.localStorage.getItem(STORAGE_KEY)) || {};
            } catch (e) {
                return {};
            }
        },
        write(settings) {
            try {
                window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
            } catch (e) { /* private mode / storage full: settings just won't persist */ }
        },
    };

    const obj = {};
    let saveTimer;

    obj.settings = () => {
        const out = {};
        SETTING_KEYS.forEach((k) => { out[k] = $rootScope.user[k]; });
        return out;
    };

    const persist = () => {
        const settings = obj.settings();
        if (!Session.user) {
            storage.write(settings);
            return;
        }
        $http.put('/api/users/me', settings).then((res) => {
            // Keep the local object (bindings point at it); just refresh its values.
            angular.extend($rootScope.user, res.data);
            Session.user = $rootScope.user;
        }, () => ErrorFactory.error('Your settings could not be saved.'));
    };

    // Settings change in quick bursts (e.g. tapping +/-), so batch the writes.
    obj.save = () => {
        $timeout.cancel(saveTimer);
        saveTimer = $timeout(persist, 400, false);
    };

    obj.setUser = (user) => {
        $rootScope.user = user ? angular.extend({}, GUEST_DEFAULTS, user) : angular.extend({}, GUEST_DEFAULTS, storage.read());
    };

    obj.setBlink = (ratio, zero, profile) => {
        angular.extend($rootScope.user, {
            blinkZero: zero,
            blinkRatio: ratio,
            calibrated: true,
            blinkProfile: profile,
        });
        obj.save();
    };

    // Same limits the server enforces.
    const LIMITS = { cursorDelay: [200, 5000], blinkRatio: [0.21, 0.99], blinkZero: [1, 999] };

    obj.adjustValue = (add, key) => {
        const current = Number($rootScope.user[key]);
        let next = add ? current * 1.02 : current * 0.98;
        if (LIMITS[key]) next = Math.min(LIMITS[key][1], Math.max(LIMITS[key][0], next));
        $rootScope.user[key] = next < 100 ? Math.round(next * 1000) / 1000 : Math.round(next);
        obj.save();
    };

    obj.setUser();
    return obj;
});
