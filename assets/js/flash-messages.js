var App = App || {};

App.FlashMessage = (function()
{
    //variables
    var time = 3000; // in milliseconds
    var timer;





    /**
     * Change the message that is displayed
     */
    function changeMessage(message)
    {
        //update new type
        $(".flashMessage__message").html(message);

        //reset timer
        startTimer();
    }





    /**
     * Change the message type that is displayed
     */
    function changeType(type)
    {
        //remove old type
        var classes = $(".flashMessage").attr("class").split(' ');

        $.each(classes, function(index, cssClass) {
            if (cssClass.indexOf("flashMessage--") === 0) {
                $("#sample").removeClass(cssClass);
            }
        });

        //update new type
        $(".flashMessage").addClass("flashMessage--" + type);

        //reset timer
        startTimer();
    }





    /**
     * Display a message
     *
     * @param string message
     */
    function displayMessage(message, type)
    {
        //if message already displayed, update it
        if($(".flashMessage").length > 0) {
            changeType(type);
            changeMessage(message);

            return;
        }

        var template = ["<div class='flashMessage flashMessage--" + type + "'>",
                            "<div class='wrapper'>",
                                "<div class='flashMessage__message'>" + message + "</div>",
                            "</div>",
                         "</div>"
                        ].join("\n");

        //add modal to page
        $("body").append(template);

        //fade modal in
        $(".flashMessage").hide().fadeIn(200);

        //start timer to remove message
        startTimer();
    }





    /**
     * Start a timer before closing the message
     */
    function startTimer()
    {
        clearTimeout(timer);
        timer = setTimeout(close, time);
    }





    /**
     * Close modal
     */
    function close()
    {
        $(".flashMessage").fadeOut(200, function() {
            $(this).remove();
        });
    }





    /**
     * Functions available to the public
     */
    return {
        displayMessage: displayMessage
    };
})();
