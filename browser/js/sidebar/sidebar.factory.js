core.factory('SidebarFactory', function($state) {

    let itemIndex = 0;
    let returnIndex = 0;

    let links = [
        { label: 'Home', state: 'home'},
        { label: 'Tutorial', state: 'tutorial'},
        { label: 'Type', state: 'type'},
        { label: 'Calibrate', state: 'calibrate'},
        { label: 'Settings', state: 'settings'},
        { label: 'About', state: 'about'}
    ];

    let bottomLinks = [
        {label: 'About', state: 'about'}
    ]

    let loggedInLinks = [
        // { label: 'Social', state: 'newsfeed', auth: true},
        // { label: 'Chat', state: 'chat', auth: true},
        // { label: 'Settings', state: 'settings', auth: true},
        {label: 'About', state: 'about'},
        { label: 'Logout', state: 'logout', auth: true}
    ];

    let loggedOutLinks = [
        { label: 'Login', state: 'login', auth: false},
        { label: 'Signup', state: 'signup', auth: false}
    ];

    let adminLinks = [
        // { label: 'Freeze', state: 'admin', auth: true},
        { label: 'Settings', state: 'stats', auth: true}
    ]

    let userLinks = links

    return {
        moveSelected: () => {
            returnIndex = itemIndex;
            itemIndex++;
            if(itemIndex >= userLinks.length) {
                itemIndex = 0;
            }
            return returnIndex;
        },
        getLinks: () => {
           return userLinks;
        },
        changeState: () => {
            itemIndex = 0;
            $state.go(userLinks[returnIndex].state, null, {reload: true})
        }
    }
});
