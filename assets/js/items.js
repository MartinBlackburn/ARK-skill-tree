var App = App || {};

App.Items = (function() 
{   
    //variables
    var items;
    var container = $(".js-categories");

    //item files
    var itemFiles = [
                    "assets/data/ammunition.json",
                    "assets/data/armor.json",
                    "assets/data/crafting.json",
                    "assets/data/farming.json",
                    "assets/data/resources.json",
                    "assets/data/storage.json",
                    "assets/data/tools.json",
                    "assets/data/traps.json",
                    "assets/data/turrets.json"
                    ];





    /**
     * Load all items
     */
    function loadItems()
    {
        //Get all items from each json file
        for(var i = 0; i < itemFiles.length; i++) {
            $.ajax({
                dataType: "json",
                url: itemFiles[i],
                cache: false,
                success: processItems,
                error: function(jqXHR, textStatus){ console.log("Error loading items: " + textStatus); }
            });
        }
    }
    

    //save selection to local storage

    //get selection from local storage

    //get selection from url





    /**
     * Process all items from json file
     * 
     * @param items json
     */
    function processItems(items)
    {
        //loop over each item and draw it to the page
        $.each(items, function(index, item) {
            //draw category to page
            if(item.type == "category") {
                drawCategory(item);
            }

            //draw item to page
            if(item.type == "item") {
                drawItem(item);
            }
        });

        //add event handlers
        addEventHandlers();
    }





    /**
     * Draw a category to the page
     * 
     * @param category json
     */
    function drawCategory(category)
    {
        var categoryTemplate = ["<div class='category' data-id='" + category.name + "'>",
                                    "<h2 class='category__name'>" + category.name + "</h2>",
                                    "<div class='category__description'>" + category.description + "</div>",
                                    "<div class='category__children'></div>",
                                "</div>"
                            ].join("\n");

        //check where category belongs
        if(category.parent) {
            //add category to parent category
            var parent = container.find("[data-id='" + category.parent + "'] > .category__children");

            parent.append(categoryTemplate);
        } else {
            //add category to container
            container.append(categoryTemplate);
        }
    }





    /**
     * Draw an item to the page
     * 
     * @param item json
     */
    function drawItem(item)
    {
        var itemTemplate = ["<tr class='item' data-id='" + item.name + "' data-engrams='" + item.engrams + "' data-minlevel='" + item.minLevel + "' data-prerequisites='" + item.prerequisites + "'>",
                                "<td><img src='assets/images/" + item.image + "' /></td>",
                                "<td><h3 class='item__name'>" + item.name + "</h3></td>",
                                "<td><div class='item__description'>" + item.description + "</div></td>",
                                "<td><div class='item__level'>Level req: " + item.minLevel + "</div></td>",
                                "<td><div class='item__engrams'>Engrams req: " + item.engrams + "</div></td>",
                            "</tr>"
                        ].join("\n");

        //find parent element
        var parent = container.find("[data-id='" + item.parent + "']");

        //check if item is being added to correct place
        if(parent.hasClass("category")) {
            //make sure there is a table for items to live in
            if(container.find("[data-id='" + item.parent + "'] .category__children > table").length < 1) {
                container.find("[data-id='" + item.parent + "'] .category__children").append("<table class='items'></table>");
            }

            //add to category
            container.find("[data-id='" + item.parent + "'] .category__children > .items").append(itemTemplate);
        } else {
            //error - parent isn't correct
            console.error("Item '" + item.name + "' doesn't have a correct parent '" + item.parent + "'");
        }
    }





    /**
     * Add event handlers for everything
     */
    function addEventHandlers()
    {
        //remove an existing events
        $(".category").off();
        $(".item").off();
        
        //open and close categories
        $(".category").on("click", ".category__name, .category__description" , function(event) {
            event.stopPropagation();

            $(this).parent(".category").toggleClass("category--open").children(".category__children").slideToggle(300);
        });

        //select and unselect items
        $(".item").on("click", function(event) {
            var item = $(this);

            //if item already selected then unselect
            if(item.hasClass("item--selected")) {
                unselectItem(item);
                return;
            }

            //select item
            selectItem(item);
        });
    }





    /**
     * Select an item
     * and any prerequisite items
     * 
     * @param item jquery element
     */
    function selectItem(item)
    {
        //dont do anything if item is already selected
        if(item.hasClass("item--selected")) {
            return;
        }

        //check level requirements
        if(item.data("minlevel") > App.Player.getLevel()) {
            App.Modal.displayModal("You are not high enough level to learn " + item.data("id"));

            return;
        }

        //get item prerequisites
        var prerequisites = item.data("prerequisites").toString();

        //if item has prerequisites, select them as well
        if(prerequisites.length !== 0) {
            var prerequisitesArray = prerequisites.split(",");

            for(var i = 0; i < prerequisitesArray.length; i++) {
                var requiredItem = container.find("[data-id='" + prerequisitesArray[i] + "']");

                //check parent exists
                //error if not
                if(requiredItem.length < 1) {
                    console.error("Item '" + item.data("id") + "' doesn't have prerequisite '" + prerequisitesArray[i] + "'");

                    return false;
                }

                selectItem(requiredItem);
            }
        }

        //spend engrams, if we have the points
        var engrams = parseInt(item.data("engrams"));

        if(App.Player.spendEngrams(engrams) === false) {
            App.Modal.displayModal("You do not have enough points to learn " + item.data("id"));

            return false;
        }

        //add select class
        item.addClass("item--selected");
    }





    /**
     * Unselect an item and any thing that prerequisites it
     * 
     * @param item jquery element
     */
    function unselectItem(item)
    {
        //dont do anything if item is already unselected
        if(!item.hasClass("item--selected")) {
            return;
        }

        //unselect anything that prerequisites this item
        $(".item").each(function() {
            var prerequisites = $(this).data("prerequisites").toString();
            var prerequisitesArray = prerequisites.split(",");

            if($.inArray(item.data("id").toString(), prerequisitesArray) > -1) {
                //unselect any prerequisite item that this item may have needed
                unselectItem($(this));
            }
        });

        //refund engrams
        var engrams = parseInt(item.data("engrams"));
        App.Player.refundEngrams(engrams);

        //remove selected class
        item.removeClass("item--selected");
    }





    /**
     * Unselect all items
     */
    function unselectAllItems()
    {
        $(".item").each(function() {
            unselectItem($(this));
        });
    }





    /**
     * Functions available to the public
     */
    return {
        init: loadItems,
        reset: unselectAllItems
    };
})();