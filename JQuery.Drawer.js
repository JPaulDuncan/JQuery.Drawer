/*
       jQuery Drawer Plugin 1.0.0

       Released into Public Domain by J Paul Duncan (jpaulduncan@gmail.com)
       
       Usage:
       ------
       JavaScript Call:  $('[data-action="drawer"]').drawer();
       JavaScript Call with settings: $('[data-action="drawer"]').drawer({ onOpen : function(data){ alert(data.title); });

       Options:
       --------
       onInit (knob)
        knob : the knob object being initialized.

       onOpen (data)
        data.title : the title of the drawer indicated in [data-drawer-title] on the knob.
        data.knob : the knob object used to open the drawer indicated by [data-action="drawer"]
        data.drawer : the drawer object indicated by [data-target] on the knob.
       
       onClose (data) 
        data.title : the title of the drawer indicated in [data-drawer-title] on the knob.
        data.knob : the knob object used to open the drawer indicated by [data-action="drawer"]
        data.drawer : the drawer object indicated by [data-target] on the knob.
       
       onDrawerSwitch (target) 
        target: the drawer being switched to.

       openEffect (string) : the jQuery effect to apply when the drawer is opened. Default: slideDown
       closeEffect (string) : the jQuery effect to apply when the drawer is closed.  Default: slideUp

       knobOnClass (string) : the CSS class to toggle when the knob is selected.

       Example:  
       --------
       <button class="btn btn-success" data-action="drawer" data-target="#myDrawer" data-drawer-title="My Drawer">Toggle Drawer!</button>
       
       <div id="myDrawer" style="display:none;">
        This is my drawer!
       </div>
        
       <script type="text/javascript">
        $(document).ready(function () { $('[data-action="drawer"]').drawer(); } );
       </script>

*/
(function ($)
{
    var methods = {
        knobId: 1,
        init: function (settings)
        {
            // this is a knob
            return this.each(function ()
            {
                // Set the options
                this.options = $.extend(
                    {},
                    $.fn.drawer.defaults,
                    settings);

                // Helper pointers
                var me = this, self = $(this);
                
                // Set up a unique id for our knob
                self.attr("data-drawer-knob-id", methods.knobId++);
                self.on("click", null, function ()
                {
                    var title = $(this).attr("data-drawer-title");
                    var targetDrawer = $($(this).attr("data-target"));
                    var knobId = targetDrawer.attr("data-current-knob-id");
                    var currentKnob = $('[data-drawer-knob-id="' + knobId + '"]');
                    if (targetDrawer)
                    {
                        if (currentKnob) { currentKnob.removeClass(me.options.knobOnClass); }
                        self.addClass(me.options.knobOnClass);
                        if (knobId)
                        {
                            if (self.attr("data-drawer-knob-id") == knobId)
                            {
                                if (targetDrawer.attr("data-drawer-state") == "close")
                                {
                                    methods._open(self, title, targetDrawer, me.options);
                                }
                                else
                                {
                                    methods._close(self, title, targetDrawer, me.options);
                                }
                            }
                            else
                            {
                                if (this.options.onDrawerSwitch && this.options.onDrawerSwitch != undefined)
                                {
                                    this.options.onDrawerSwitch(targetDrawer);
                                }
                               
                                methods._open(self, title, targetDrawer, me.options);

                            }
                        } else
                        {
                            methods._open(self, title, targetDrawer, me.options);
                        }
                    } else
                    {
                        alert("Drawer: data-target not indicated.");
                        return;
                    }
                });

                // Callback onInit
                if (me.options.onInit && me.options.onInit != undefined)
                {
                    me.options.onInit(this)
                }
            })
        },
        _open: function (knob, title, targetDrawer, options)
        {
            
            targetDrawer.find('.drawer-title').first().html(title);
            targetDrawer.attr("data-drawer-state", "open");
            targetDrawer.attr("data-current-knob-id", knob.attr("data-drawer-knob-id"));
            
            if (options.openEffect == undefined) { targetDrawer.slideDown(); } else {
                targetDrawer.effect(options.openEffect);
            }

            // Allows you to have a different element also close the drawer.
            targetDrawer.find('[data-action="drawer-close"]').first().one("click", null, function ()
            {
                methods._close(knob, title, targetDrawer, options);
            });

            if (options.onOpen && options.onOpen != undefined)
            {
                options.onOpen(
                    {
                        knob: knob,
                        title: title,
                        drawer: targetDrawer
                    });
            }
        },
        _close: function (knob, title, targetDrawer, options)
        {
            knob.removeClass(options.knobOnClass);
            targetDrawer.attr("data-drawer-state", "close");
            if (options.closeEffect == undefined) { targetDrawer.slideUp(); } else {
                targetDrawer.effect(options.closeEffect);
            }

            if (options.onClose && options.onClose != undefined)
            {
                options.onClose(
                    {
                        knob: knob,
                        title: title,
                        drawer: targetDrawer
                    });
            }
        }
    };

    // Plugin hook
    $.fn.drawer = function (methodName)
    {
        if (methods[methodName])
        {
            return methods[methodName].apply(this, Array.prototype.slice.call(arguments, 1));
        }
        else if (typeof methodName === 'object' || !methodName)
        {
            return methods.init.apply(this, arguments);
        }
        else
        {
            $.error('Method ' + methodName + ' does not exist!');
        }
    };

    // Plugin defaults
    $.fn.drawer.defaults = {
        onInit: undefined,
        onOpen: undefined,
        onClose: undefined,
        onDrawerSwitch: undefined,
        openEffect: undefined,
        closeEffect: undefined,
        knobOnClass: 'knob-selected'
    }
})(jQuery);