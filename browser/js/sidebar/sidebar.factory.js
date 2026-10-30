core.factory('SidebarFactory', function($state) {
    const links = [
        { label: 'Home', state: 'home' },
        { label: 'Tutorial', state: 'tutorial' },
        { label: 'Type', state: 'type' },
        { label: 'Calibrate', state: 'calibrate' },
        { label: 'Settings', state: 'settings' },
        { label: 'Instructions', state: 'instructions' },
        { label: 'About', state: 'about' }
    ];
    let itemIndex = 0;
    let returnIndex = 0;

    return {
        getLinks: () => links,
        moveSelected: () => {
            returnIndex = itemIndex;
            itemIndex = (itemIndex + 1) % links.length;
            return returnIndex;
        },
        changeState: () => {
            itemIndex = 0;
            $state.go(links[returnIndex].state, null, { reload: true });
        }
    };
});
