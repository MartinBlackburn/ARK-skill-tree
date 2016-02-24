var App = App || {};

App.Tests = (function()
{
    //variables
    var container = $(".js-categories");
    var categories;
    var items;





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

        sameCategoryId();
        sameItemId();
        prerequisitesExist();
        prerequisiteNotCategory();
        emptyCategory();
    }





    /**
     * Make sure no category has the same id
     */
    function sameCategoryId()
    {
        categories.each(function() {
            var id = $(this).data("id").toString();

            var sameCategoryId = container.find("[data-id='" + id + "']");

            if(sameCategoryId.length > 1) {
                console.error("There are categories with the same id: " + id);
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

            var sameItemId = container.find("[data-id='" + id + "']");

            if(sameItemId.length > 1) {
                console.error("There are items with the same id: " + id);
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
                    var requiredItem = container.find("[data-id='" + prerequisitesArray[i] + "']");

                    //check item exists
                    if(requiredItem.length < 1) {
                        console.error("Item '" + $(this).data("id") + "' doesn't have prerequisite '" + prerequisitesArray[i] + "'");
                    }
                }
            }
        });
    }





    /**
     * Make sure prerequisites isn't a category
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
                    var requiredItem = container.find("[data-id='" + prerequisitesArray[i] + "']");

                    //check prerequisite isn't a category
                    if(requiredItem.hasClass("category")) {
                        console.error("Item '" + $(this).data("id") + "' has prerequisite which is a category '" + prerequisitesArray[i] + "'");
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
            var id = $(this).data("id").toString();

            if(childItems.length === 0) {
                console.error("Categories has no items: " + id);
            }
        });
    }





    /**
     * Functions available to the public
     */
    return {
        init: init
    };
})();
