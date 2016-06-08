var App = App || {};

App.Tests = (function()
{
    //variables
    var container = $(".js-categories");
    var categories;
    var items;
    var totalEngramPointsWiki = 5362; // accoring to the wiki: http://ark.gamepedia.com/Engrams





    /**
     * Set up handler for test
     */
    function init()
    {
        $(document).on("loaded:everything", runAll);
    }





    /**
     * Run all tests
     */
    function runAll()
    {
        categories = $(".category");
        items = $(".item");

        sameCategoryName();
        sameItemName();
        sameItemId();
        prerequisitesExist();
        prerequisiteNotCategory();
        emptyCategory();
        totalEngramPoints();
    }





    /**
     * Make sure no category has the same name
     */
    function sameCategoryName()
    {
        categories.each(function() {
            var name = $(this).data("name").toString();

            var sameCategoryId = container.find("[data-name='" + name + "']");

            if(sameCategoryId.length > 1) {
                console.error("There are categories with the same name: " + name);
            }
        });
    }





    /**
     * Make sure no item has the same id
     */
    function sameItemId()
    {
        items.each(function() {
            var id = $(this).data("id").toString();
            var name = $(this).data("name").toString();

            var sameItemId = container.find("[data-id='" + id + "']");

            if(sameItemId.length > 1) {
                console.error("There are items with the same id: " + name + " (" + id + ")");
            }
        });
    }





    /**
     * Make sure no item has the same name
     */
    function sameItemName()
    {
        items.each(function() {
            var name = $(this).data("name").toString();

            var sameItemId = container.find("[data-name='" + name + "']");

            if(sameItemId.length > 1) {
                console.error("There are items with the same name: " + name);
            }
        });
    }





    /**
     * Make sure prerequisites exist
     */
    function prerequisitesExist()
    {
        items.each(function() {
            //get item prerequisites
            var prerequisites = $(this).data("prerequisites").toString();

            //if item has prerequisites, check they exist
            if(prerequisites.length !== 0) {
                var prerequisitesArray = prerequisites.split(",");

                //check each prerequisite
                for(var i = 0; i < prerequisitesArray.length; i++) {
                    var requiredItem = container.find("[data-name='" + prerequisitesArray[i] + "']");

                    //check item exists
                    if(requiredItem.length < 1) {
                        console.error("Item '" + $(this).data("name") + "' doesn't have prerequisite '" + prerequisitesArray[i] + "'");
                    }
                }
            }
        });
    }





    /**
     * Make sure prerequisite isn't a category
     */
    function prerequisiteNotCategory()
    {
        items.each(function() {
            //get item prerequisites
            var prerequisites = $(this).data("prerequisites").toString();

            //if item has prerequisites, check it's not a category
            if(prerequisites.length !== 0) {
                var prerequisitesArray = prerequisites.split(",");

                //check each prerequisite
                for(var i = 0; i < prerequisitesArray.length; i++) {
                    var requiredItem = container.find("[data-name='" + prerequisitesArray[i] + "']");

                    //check prerequisite isn't a category
                    if(requiredItem.hasClass("category")) {
                        console.error("Item '" + $(this).data("name") + "' has prerequisite which is a category '" + prerequisitesArray[i] + "'");
                    }
                }
            }
        });
    }





    /**
     * Make sure no category is empty
     */
    function emptyCategory()
    {
        categories.each(function() {
            var childItems = $(this).find(".item");
            var name = $(this).data("name").toString();

            if(childItems.length === 0) {
                console.error("Categories has no items: " + name);
            }
        });
    }




    
    /**
     * Make sure correct number of engrams points
     */
    function totalEngramPoints()
    {
        var myEngrampoints = App.Items.getTotalEngramPoints();
        
        if(myEngrampoints < totalEngramPointsWiki) {
            console.error("Not enough engram points, according to the wiki");
            console.error("I have " + myEngrampoints + ", should have " + totalEngramPointsWiki);
        }
        
        if(myEngrampoints > totalEngramPointsWiki) {
            console.error("Too many engram points, according to the wiki");
            console.error("I have " + myEngrampoints + ", should have " + totalEngramPointsWiki);
        }
    }
    
    
    
    
    
    /**
     * Functions available to the public
     */
    return {
        init: init
    };
})();
