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
     * Make sure no category has the same id
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
     * Functions available to the public
     */
    return {
        init: init
    };
})();
