var App = App || {};

// start the app
App.init = function () {
    App.Player.init();
    App.Items.init();
};

// run on DOM load
$(document).ready(App.init);
