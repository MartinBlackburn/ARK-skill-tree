var App = App || {};

App.Player = (function() 
{   
    //variables
    var level = 0;
    var maxengrams = 0;
    var spent = 0;

    //display containers
    var levelDisplay = $(".js-level");
    var maxEngramsDisplay = $(".js-maxEngrams");
    var engramsSpentDisplay = $(".js-engramsSpent");

    //watch for changes in players level
    levelDisplay.on("keyup", update);

    //reset button
    $(".js-reset").on("click", function() {
        App.Items.reset();
    });





    /**
     * Update player
     */
    function update()
    {
        getLevel();
        calculateEngrams();
        updateDisplay();
    }





    /**
     * Get the players level
     */
    function getLevel()
    {
        level = levelDisplay.val();

        return level;
    }





    /**
     * Spend Engrams
     * 
     * @param int value
     *
     * @return false if unable to spend Engrams
     */
    function spendEngrams(value)
    {
        //dont spend engrams if we dont have enough
        if((spent + value) > maxEngrams) {
            return false;
        }

        spent += value;

        updateDisplay();
    }





    /**
     * Refund engrams
     * 
     * @param int value
     */
    function refundEngrams(value)
    {
        spent -= value;

        updateDisplay();
    }





    /**
     * Update display of engrams
     */
    function updateDisplay()
    {
        maxEngramsDisplay.text(maxEngrams);
        engramsSpentDisplay.text(spent);
    }





    /**
     * Calculate engrams for the level given
     */
    function calculateEngrams()
    {
        //reset engrams
        maxEngrams = 0;

        //level brackets
        var levelBracket1 = Math.min(level, 9);
        var levelBracket2 = Math.min(level, 19);
        var levelBracket3 = Math.min(level, 29);
        var levelBracket4 = Math.min(level, 39);
        var levelBracket5 = Math.min(level, 49);
        var levelBracket6 = Math.min(level, 59);
        var levelBracket7 = Math.min(level, 72);
        var levelBracket8 = Math.min(level, 86);
        var levelBracket9 = Math.min(level, 94);

        //8 engrams from level 2 to level 9
        for (var i = 2; i <= levelBracket1; i++){
            maxEngrams += 8;
        }

        //12 engrams from level 10 to level 19
        for (var i = 10; i <= levelBracket2; i++){
            maxEngrams += 12;
        }

        //16 engrams from level 20 to level 29
        for (var i = 20; i <= levelBracket3; i++){
            maxEngrams += 16;
        }

        //20 engrams from level 30 to level 39
        for (var i = 30; i <= levelBracket4; i++){
            maxEngrams += 20;
        }

        //24 engrams from level 40 to level 49
        for (var i = 40; i <= levelBracket5; i++){
            maxEngrams += 24;
        }

        //28 engrams from level 50 to level 59
        for (var i = 50; i <= levelBracket6; i++){
            maxEngrams += 28;
        }

        //40 engrams from level 60 to level 72
        for (var i = 60; i <= levelBracket7; i++){
            maxEngrams += 40;
        }

        //50 engrams from level 73 to level 86
        for (var i = 73; i <= levelBracket8; i++){
            maxEngrams += 50;
        }

        //60 engrams from level 87 to level 94
        for (var i = 87; i <= levelBracket9; i++){
            maxEngrams += 60;
        }
    }





    /**
     * Functions available to the public
     */
    return {
        init: update,
        spendEngrams: spendEngrams,
        refundEngrams: refundEngrams,
        getLevel: getLevel
    };
})();