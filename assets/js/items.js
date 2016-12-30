var App = App || {};

App.Items = (function()
{
    //variables
    var container = $(".js-categories");
    var useLocalStorage = false;
    var version = "255";
    var highestItemId = 0;
    var totalEngramPoints = 0;

    //item files
    var itemFiles = [
                    "assets/data/root-categories.json",

                    "assets/data/ammunition/arrows.json",
                    "assets/data/ammunition/bullets.json",
                    "assets/data/ammunition/other.json",
                    "assets/data/ammunition/turret.json",

                    "assets/data/armor/chitin.json",
                    "assets/data/armor/cloth.json",
					"assets/data/armor/desert.json",
                    "assets/data/armor/flak.json",
                    "assets/data/armor/fur.json",
                    "assets/data/armor/ghillie.json",
                    "assets/data/armor/hide.json",
                    "assets/data/armor/riot.json",
                    "assets/data/armor/scuba.json",
                    "assets/data/armor/shields.json",
                    "assets/data/armor/other.json",

                    "assets/data/crafting-stations.json",

                    "assets/data/defences/spikewalls.json",
                    "assets/data/defences/traps.json",
                    "assets/data/defences/turrets.json",
                    
                    "assets/data/drugs.json",

                    "assets/data/electrical/cables.json",
                    "assets/data/electrical/elevators.json",
                    "assets/data/electrical/generators.json",
                    "assets/data/electrical/lampposts.json",
                    "assets/data/electrical/other.json",

                    "assets/data/farming/crop-plots.json",
                    "assets/data/farming/irrigation.json",
                    "assets/data/farming/greenhouse.json",
                    "assets/data/farming/other.json",

                    "assets/data/resources.json",

                    "assets/data/saddles/riding.json",
                    "assets/data/saddles/platform.json",

                    "assets/data/storage.json",

                    "assets/data/structures/beds.json",
                    "assets/data/structures/catwalks.json",
                    "assets/data/structures/ceilings.json",
                    "assets/data/structures/dinosaur-gateways.json",
                    "assets/data/structures/dinosaur-gates.json",
                    "assets/data/structures/doorframes.json",
                    "assets/data/structures/doors.json",
                    "assets/data/structures/foundations.json",
                    "assets/data/structures/furniture.json",
                    "assets/data/structures/hatchframes.json",
                    "assets/data/structures/ladders.json",
                    "assets/data/structures/pillars.json",
                    "assets/data/structures/railings.json",
                    "assets/data/structures/ramps.json",
                    "assets/data/structures/roofs.json",
                    "assets/data/structures/signs.json",
					"assets/data/structures/staircase.json",
                    "assets/data/structures/trapdoors.json",
                    "assets/data/structures/tree-platforms.json",
                    "assets/data/structures/trophy-bases.json",
                    "assets/data/structures/walls.json",
                    "assets/data/structures/windowframes.json",
                    "assets/data/structures/windows.json",

                    "assets/data/tools/harvesting.json",
                    "assets/data/tools/survival.json",
                    "assets/data/tools/navigation.json",
                    "assets/data/tools/cosmetic.json",
                    "assets/data/tools/other.json",
                    
                    "assets/data/vehicles.json",

                    "assets/data/weapons/attachments.json",
                    "assets/data/weapons/explosives.json",
                    "assets/data/weapons/grenades.json",
                    "assets/data/weapons/melee.json",
                    "assets/data/weapons/bows.json",
                    "assets/data/weapons/pistols.json",
                    "assets/data/weapons/rifles.json",
                    "assets/data/weapons/shotguns.json",
                    "assets/data/weapons/other.json"
                    ];





    /**
     * setup items
     */
    function init()
    {
        //set flash message
        App.FlashMessage.displayMessage("Loading items...", "success");

        //check version in localstorage
        var localVersion = localStorage.getItem('version');

        //if versions same use localstorage
        if(version === localVersion) {
            useLocalStorage = true;
        }
        
        //set version in local storage
        localStorage.setItem('version', version);

        //load items
        loadItems();
    }





    /**
     * Start item loading
     */
    function loadItems()
    {
        if(useLocalStorage) {
            loadItemsFromLocal();
        } else {
            loadItemsFromServer();
        }
    }





    /**
     * Load items from localstorage
     */
    function loadItemsFromLocal()
    {
        var items = JSON.parse(localStorage.getItem(itemFiles[0]));

        if(items && items.length > 0) {
            processItems(items);
        } else {
            loadItemsFromServer();
        }
    }





    /**
     * Load items from server
     */
    function loadItemsFromServer()
    {
        $.ajax({
            dataType: "json",
            url: itemFiles[0],
            cache: false,
            success: processItems,
            error: loadingError
        });
    }





    /**
     * Load next item file in the list
     */
    function loadNextItemFile()
    {
        //remove from array so it doesn't get loaded again
        itemFiles.shift();

        //load items if any left to load
        //otherwise trigger all items loaded event
        if(itemFiles.length > 0) {
            loadItems();
        } else {
            //update flash message
            App.FlashMessage.displayMessage("Finished loading", "success");

            //trigger everything loaded event
            $(document).trigger("loaded:everything");

            //try load saved settings
            load();
        }
    }





    /**
     * Process all items from json file
     *
     * @param items json
     */
    function processItems(items)
    {
        //save items to local storage, if not loaded from there
        if(!useLocalStorage) {
            localStorage.setItem(itemFiles[0], JSON.stringify(items));
        }

        //loop over each item and draw it to the page
        $.each(items, function(index, item) {
            //draw category to page
            if(item.type == "category") {
                drawCategory(item);
            }

            //draw item to page
            if(item.type == "item") {
                drawItem(item);
                
                //log highest item ID
                if(item.id > highestItemId) {
                    highestItemId = item.id;
                }
                
                //log total engrams points
                totalEngramPoints += item.engrams;
            }
        });

        //update flash message
        var message = itemFiles[0];
        message = message.replace(".json", "");
        message = message.replace("assets/data/", "");
        message = message.replace("/", " - ");

        App.FlashMessage.displayMessage("Loaded: " + message, "success");

        //add event handlers
        //done after each item set so its usable while other items load
        addEventHandlers();

        //load next set of items
        loadNextItemFile();
    }





    /**
     * Error when unable to load items
     */
    function loadingError(xhr, errorType, exception)
    {
        //log error
        console.error("Error loading items: " + itemFiles[0]);
        console.log(errorType);
        console.log(exception);

        //load next set of items
        loadNextItemFile();
    }





    /**
     * Draw a category to the page
     *
     * @param category json
     */
    function drawCategory(category)
    {
        var categoryTemplate = ["<div class='category' data-name='" + category.name + "'>",
                                    "<h2 class='category__name'>" + category.name + "</h2>",
                                    "<div class='category__description'>" + category.description + "</div>",
                                    "<div class='category__children'></div>",
                                "</div>"
                            ].join("\n");

        //check where category belongs
        if(category.parent) {
            //add category to parent category
            var parent = container.find("[data-name='" + category.parent + "'] > .category__children");

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
        var itemTemplate = ["<tr class='item' data-id='" + item.id + "' data-name=\"" + item.name + "\" data-engrams='" + item.engrams + "' data-minlevel='" + item.minLevel + "' data-prerequisites='" + item.prerequisites + "'>",
                                "<td><img src='assets/images/" + item.image + "' /></td>",
                                "<td><h3 class='item__name'>" + item.name + "</h3></td>",
                                "<td><div class='item__description'>" + item.description + "</div></td>",
                                "<td><div class='item__level'>Level req: " + item.minLevel + "</div></td>",
                                "<td><div class='item__engrams'>Engrams req: " + item.engrams + "</div></td>",
                            "</tr>"
                        ].join("\n");

        //find parent element
        var parent = container.find("[data-name='" + item.parent + "']");
        
        //check that there isn't more than one parent
        if(parent.length > 1) {
            console.error("Item '" + item.name + "' has too many parents '" + item.parent + "'");
        }

        //check if item is being added to correct place
        if(parent.hasClass("category")) {
            //make sure there is a table for items to live in
            if(container.find("[data-name='" + item.parent + "'] .category__children > table").length < 1) {
                container.find("[data-name='" + item.parent + "'] .category__children").append("<table class='items'></table>");
            }

            //add to category
            container.find("[data-name='" + item.parent + "'] .category__children > .items").append(itemTemplate);
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
            App.Modal.displayModal("You are not high enough level to learn " + item.data("name"));

            return;
        }

        //get item prerequisites
        var prerequisites = item.data("prerequisites").toString();

        //if item has prerequisites, select them as well
        if(prerequisites.length !== 0) {
            var prerequisitesArray = prerequisites.split(",");

            for(var i = 0; i < prerequisitesArray.length; i++) {
                var requiredItem = container.find("[data-name='" + prerequisitesArray[i] + "']");

                //select item if found
                if(requiredItem.length) {
                    selectItem(requiredItem);
                }
            }
        }

        //spend engrams, if we have the points
        var engrams = parseInt(item.data("engrams"));

        if(App.Player.spendEngrams(engrams) === false) {
            App.Modal.displayModal("You do not have enough points to learn " + item.data("name"));

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

            if($.inArray(item.data("name").toString(), prerequisitesArray) > -1) {
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
        //unselect items
        $(".item").each(function() {
            unselectItem($(this));
        });

        //clear url
        history.replaceState(null, null, location.pathname);

        //update flash message
        App.FlashMessage.displayMessage("Selection reset", "success");
    }





    /**
     * Save item selction to localstorage
     */
    function save()
    {
        var selectedIds = [];

        //added selected items to arrays
        $(".item--selected").each(function() {
            selectedIds.push($(this).data("id"));
        });

        //add selected items to localstorage
        localStorage.setItem('selected', JSON.stringify(selectedIds));

        //update url with selected IDs
        var idString = selectedIds.join(",");
        history.replaceState(null, null, '?ids=' + idString);

        //update flash message
        App.FlashMessage.displayMessage("Selection saved", "success");
    }





    /**
     * Save item selction to localstorage
     */
    function load()
    {
        var loaded = false;
        var selected;

        //try load from url
        var query = window.location.search.substring(1);
        query = query.split("=");

        //have ids in the url
        if(query[0] === "ids") {
            var idString = query[1];
            selected = idString.split(',');
        } else {
            //get saved items from localstorage
            selected = JSON.parse(localStorage.getItem('selected'));
        }

        //load items if any stored
        if(selected && selected.length > 0) {
            //select each item
            $.each(selected, function(index, value) {
                var item = container.find("[data-id='" + value + "']");

                //select item if found
                if(item.length) {
                    selectItem(item);
                }
            });

            //update flash message
            App.FlashMessage.displayMessage("Loaded your saved settings", "success");
        }
    }


    
    
    
    /**
     * Log highest used ID when asked for
     */
    function getHighestItemId()
    {        
        return highestItemId;
    }
    
    
    
    
    
    /**
     * Log highest used ID when asked for
     */
    function getTotalEngramPoints()
    {        
        return totalEngramPoints;
    }





    /**
     * Functions available to the public
     */
    return {
        init: init,
        reset: unselectAllItems,
        save: save,
        load: load,
        getHighestItemId: getHighestItemId,
        getTotalEngramPoints: getTotalEngramPoints
    };
})();
