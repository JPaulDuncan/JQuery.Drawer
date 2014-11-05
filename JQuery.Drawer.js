;
// Drawers
// 
// data-drawer-effect="slide"
// data-drawer-direction="up | down | left | right"
// data-drawer-target="#drawer-target"
// data-drawer-style="single | multi"
// 
// Usage: 
//
// <div id="mini" data-drawer-effect="slide" data-drawer-direction="right" data-drawer-target="#drawer-target" data-drawer-style="multi">
//     <button data-toggle="drawer" data-target="#my-drawer">Click</button>
//     <div class="drawer-container">
//         <div id="my-drawer" class="drawer">My drawer.</div>
//     </div>
//     <div id="drawer-target">My page data.....</div>
// </div>
//
//<script type="text/javascript">
//     $(document).ready(function () { var d = $('#mini').drawer(); });
//</script>
//
(function($) {

    'use strict';

    var defaults = {
        onInit: function() {
        },
        onShow: function() {
        },
        onHide: function() {
        },
        container: 'drawer-container',
        effect: 'slide',
        direction: 'up',
        target: undefined,
        onClass: 'col-lg-3',
        targetOnClass: 'col-lg-9 pull-right',
        style: "multi",
        buttonOnClass: 'btn-primary',
        buttonOffClass: 'btn-default'
    };

    $.fn.drawer = function(options) {

        if (typeof options === 'undefined') {
            options = {};
        }

        if (this.length === 0)
            return this;

        var drawer = this;
        var knobs = $(this).find('[data-toggle="drawer"]');

        var init = function() {

            for (var key in defaults) {
                if (defaults.hasOwnProperty(key)) {
                    if (drawer.attr('data-drawer-' + key.toLowerCase())) {
                        options[key] = drawer.data('drawer-' + key.toLowerCase());
                    }
                }
            };

            drawer.settings = $.extend({}, defaults, options);

            knobs.each(function() {

                $(this).on("click", null, function() {

                    var current = this;

                    var p = getKnobData(current);

                    if ($(p.targetDrawer).hasClass("in")) {
                        close(p);
                    }
                    else {
                        open(p);
                    };

                    if (drawer.settings.style == "single") {
                        
                        knobs.each(function() {
                            if (this != current) {
                                close(getKnobData(this));
                            }
                        });
                    };
                });
            });

            drawer.settings.onInit();
        };

        var getKnobData = function(knob) {

            var slideDirection = $(knob).attr("data-direction");
            var targetDrawer = $(knob).attr("data-target");
            var targetContainer = $(targetDrawer).parent();

            if (slideDirection == "") {
                slideDirection = drawer.settings.direction;
            };

            return {
                knob: knob,
                direction: slideDirection,
                targetDrawer: $(knob).attr("data-target"),
                targetContainer: targetContainer,
                hasContainer: targetContainer.hasClass("drawer-container"),
                targetDiv: $(drawer.settings.target)
            }
        };

        var close = function(p) {

            $(p.knob).removeClass(drawer.settings.buttonOnClass);
            $(p.knob).addClass(drawer.settings.buttonOffClass);

            $(p.targetDrawer).removeClass("in");

            if (p.hasContainer) {
                $(p.targetDrawer).hide();
            }
            else {
                $(p.targetDrawer).removeClass(drawer.settings.onClass);
                $(p.targetDrawer).hide(drawer.settings.effect, {direction: p.direction});
            }

            if ($(drawer).find('.drawer.in').length == 0) {

                if (p.hasContainer) {
                    $(p.targetContainer).hide(drawer.settings.effect, {direction: p.direction});
                    $(p.targetContainer).removeClass(drawer.settings.onClass);
                }

                $(p.targetDiv).removeClass(drawer.settings.targetOnClass);

                drawer.settings.onHide();
            }
        };

        var open = function(p) {

            $(p.targetDiv).addClass(drawer.settings.targetOnClass);

            $(p.knob).removeClass(drawer.settings.buttonOffClass);
            $(p.knob).addClass(drawer.settings.buttonOnClass);

            $(p.targetDrawer).addClass("in");

            if (p.hasContainer) {
                $(p.targetContainer).addClass(drawer.settings.onClass);
                $(p.targetContainer).show(drawer.settings.effect, {direction: p.direction});
                $(p.targetDrawer).show();
            }
            else {
                $(p.targetDrawer).addClass(drawer.settings.onClass);
                $(p.targetDrawer).show(drawer.settings.effect, {direction: p.direction});
            }

            drawer.settings.onShow(p.targetDrawer);
        };

        init();

        return drawer;
    };

}(jQuery));
