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

        sameCategoryName();
        sameItemName();
        sameItemId();
        prerequisitesExist();
        prerequisiteNotCategory();
        emptyCategory();
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
     * Check points against what on wiki
     * This is very tempermental as tries to match by name, which is NOT accurate
     */
    function testAgainstWiki()
    {
        $.get("http://ark.gamepedia.com/Engrams", function(data) {
            //object of wiki items
            var wikiItems = [];
            
            //get items from wiki
            var rows = $(data).find(".wikitable tr:not(:first-child)");
            
            //add each item to the array
            rows.each(function() {
                var item = {};
                
                //get item name
                var name = $(this).find("td:nth-child(2)").text();
                name = name.toLowerCase();
                name = name.trim();
                name = name.charAt(0).toUpperCase() + name.slice(1);
                item.name = name;
                
                //get item engram points
                var engramPoints = $(this).find("td:nth-child(3)").text();
                if(!$.isNumeric(engramPoints)) {
                    engramPoints = 0;
                } 
                item.engrams = Number(engramPoints);
                
                //add wiki item to array
                wikiItems.push(item);
            });
            
            console.log(wikiItems);
            
            //check each item on the wiki
            $.each(wikiItems, function(index, wikiItem) {
                //look for wiki item on my site
                var foundItems = container.find("[data-name='" + wikiItem.name + "']");
                
                //check we have it
                if(foundItems.length === 0) {
                    console.error("Didnt find wiki item: " + wikiItem.name);
                }
                
                //check it the same engram points
                if(foundItems.length > 0) {
                    if(foundItems[0].data("engrams").toString() != wikiItem.engrams) {
                        console.error("Item didnt have same engram points as wiki: " + wikiItem.name);
                        console.error("Mine: " + foundItems[0].data("engrams").toString() + ", Wiki: " + wikiItem.engrams);
                    }
                }
            });
        });
    }
    
    
    
    
    
    /**
     * Functions available to the public
     */
    return {
        init: init,
        testAgainstWiki: testAgainstWiki
    };
})();
