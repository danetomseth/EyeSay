(function () {
    'use strict';

    const auth = angular.module('blinkAuth', []);

    auth.constant('AUTH_EVENTS', {
        loginSuccess: 'auth-login-success',
        loginFailed: 'auth-login-failed',
        logoutSuccess: 'auth-logout-success',
        sessionTimeout: 'auth-session-timeout',
        notAuthenticated: 'auth-not-authenticated',
        notAuthorized: 'auth-not-authorized'
    });

    auth.factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
        const statusDict = {
            401: AUTH_EVENTS.notAuthenticated,
            403: AUTH_EVENTS.notAuthorized,
            419: AUTH_EVENTS.sessionTimeout,
            440: AUTH_EVENTS.sessionTimeout
        };
        return {
            responseError: function (response) {
                if (statusDict[response.status]) $rootScope.$broadcast(statusDict[response.status], response);
                return $q.reject(response);
            }
        };
    });

    auth.config(function ($httpProvider) {
        $httpProvider.interceptors.push('AuthInterceptor');
    });

    auth.service('AuthService', function ($http, Session, $rootScope, AUTH_EVENTS, $q, ConstantsFactory) {
        const errorMessage = (fallback) => (res) => $q.reject({
            message: (res && res.data && res.data.error) || fallback
        });

        function onSuccessfulLogin(response) {
            const user = response.data.user;
            ConstantsFactory.setUser(user);
            Session.create($rootScope.user);
            $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
            return user;
        }

        this.isAuthenticated = () => !!Session.user;

        // Resolves to the logged-in user, or null for a guest.
        this.getLoggedInUser = function (fromServer) {
            if (this.isAuthenticated() && fromServer !== true) {
                return $q.when(Session.user);
            }
            return $http.get('/session')
                .then((res) => {
                    $rootScope.accountsEnabled = !!res.data.accounts;
                    return res.data.user ? onSuccessfulLogin(res) : null;
                })
                .catch(() => null);
        };

        this.signup = function (userInfo) {
            // Bring a guest's calibration along into the new account.
            const body = angular.extend({}, userInfo, { settings: ConstantsFactory.settings() });
            return $http.post('/signup', body)
                .then(onSuccessfulLogin, errorMessage('Could not create your account.'));
        };

        this.login = function (credentials) {
            return $http.post('/login', credentials)
                .then(onSuccessfulLogin, errorMessage('Invalid login credentials.'));
        };

        this.logout = function () {
            return $http.post('/logout').finally(() => {
                Session.destroy();
                ConstantsFactory.setUser();
                $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
            });
        };
    });

    auth.service('Session', function ($rootScope, AUTH_EVENTS) {
        const self = this;

        $rootScope.$on(AUTH_EVENTS.notAuthenticated, () => self.destroy());
        $rootScope.$on(AUTH_EVENTS.sessionTimeout, () => self.destroy());

        this.user = null;
        this.create = function (user) {
            this.user = user;
        };
        this.destroy = function () {
            this.user = null;
        };
    });
})();
