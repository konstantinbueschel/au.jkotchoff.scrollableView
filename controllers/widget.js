var LTAG = '[de.jkotchoff.scrollableView]',
    
    disabledDotOpacity = 0.4,
    pagingControlBelow, pagingControlBg, pagingControlDot;

/**
 * SEF to organize otherwise inline code
 *
 * @private
 * @param {Object} args
 * @returns void
 */
(function constructor(args) {
    
    pagingControlBelow = args.pagingControlBelow || false,
    pagingControlBg = args.pagingControlBackgroundColor || '#f1f1f1',
    pagingControlDot = args.pagingControlDotImage || WPATH('images/paging_control_dot.png');
    
    // Is it true?
    pagingControlBelow = pagingControlBelow === true || !!~['true', 'yes', '1'].indexOf(pagingControlBelow.toString().toLowerCase());
    
    // Style the paging control
    $.pagingControl.setBackgroundColor(pagingControlBg);
    
    // pagingControl position: inline with images or below them
    pagingControlBelow && ($.container.layout = 'vertical');
    
    // Set the view parameters as children of the ScrollableView
    _setScrollableViewViews(args.children);
    
    // Handle scroll events
    $.scrollableView.addEventListener('scrollEnd', function(event) {
        
        if (event == null || event.source == null || event.source.currentPage == null) {
            return;
        }
    
        _setScrollableViewCurrentPage(event.source.currentPage);
    });

    //Apply any widget arguments.
    delete args.children;
    _.extend($.getView(), args);

    // In case of pagingControl shows below images, assign height to scrollview - the height of the pagingControl
    pagingControlBelow && ($.scrollableView.height = (parseInt(args.height) - parseInt($.pagingControl.height)) + 'dp');

    // Use the view from this widget in the calling container
    __parentSymbol.add($.getView());
    
})(arguments[0] || {});


function _setScrollableViewViews(views) {
    
    if (views) {
        
        $.scrollableView.setViews(views);
        
        args.children = views;
        
        _initializePagingControl();
    }
    
} // END _setScrollableViewViews()


function _setControlHeight(value) {
    
    if (value) {
        
        $.container.setHeight(value);
        
        // In case of pagingControl shows below images, assign height to scrollview - the height of the pagingControl
        pagingControlBelow && ($.scrollableView.height = (value - parseInt($.pagingControl.height)) + 'dp');
    }
    
} // END _setControlHeight()


function _setScrollableViewCurrentPage(currentIndex, animated) {
    
    animated = _.isBoolean(animated) ? animated : true;
    
    _.each($.pagingControlButtons.children, function(pagingDot, index) {
        
        pagingDot.opacity = (index == currentIndex ? 1 : disabledDotOpacity);
    });
    
    if ($.scrollableView.getCurrentPage() !== currentIndex) {
        
        animated ? $.scrollableView.scrollToView(currentIndex) : $.scrollableView.setCurrentPage(currentIndex);
    }
    
} // END _setScrollableViewCurrentPage()


/**
 * Initialize the dots in the faux paging control
 */
function _initializePagingControl() {
    
    if (args.children) {
        
        // reset paging control, in case called again
        $.pagingControlButtons.removeAllChildren();
        
        _(args.children.length).times(function() {
            
            $.pagingControlButtons.add($.UI.create('ImageView', {
                
                classes: ['pagingControlDotImage'],
                image: pagingControlDot
            }));
        });
        
        // Initialize the first view
        _setScrollableViewCurrentPage(0);
    }
    
} // END _initializePagingControl()


// PUBLIC INTERFACE
exports.setViews = _setScrollableViewViews;
exports.setHeight = _setControlHeight;
exports.setCurrentPage = _setScrollableViewCurrentPage;

// Overwrite Backbone methods, as used in the generated code by Alloy:
exports.on = function(name, cb) {
    
    return $.scrollableView.addEventListener(name, cb);
    
}; // END on()


exports.off = function(name, cb) {
    
    return $.scrollableView.removeEventListener(name, cb);
    
}; // END off()


exports._hasListenersForEventType = function(name, flag) {
    
    return $.scrollableView._hasListenersForEventType(name, flag);
    
}; // END _hasListenersForEventType()


// Support Titanium methods
exports.addEventListener = function(name, cb) {
    
    return $.scrollableView.addEventListener(name, cb);
    
}; // END addEventListener()


exports.removeEventListener = function(name, cb) {
    
    return $.scrollableView.removeEventListener(name, cb);
    
}; // END removeEventListener()


// support next & previous "slide" from code
exports.moveNext = function() {
    
    $.scrollableView.moveNext();
    
}; // END moveNext()


exports.movePrevious = function() {
    
    $.scrollableView.movePrevious();
    
}; // END movePrevious()

// Overwrite backbone aliases:
exports.bind = $.scrollableView.addEventListener;
exports.unbind = $.scrollableView.removeEventListener;

// Overwrite Backbone trigger and Titanium fireEvent methods for convenience
exports.trigger = $.scrollableView.fireEvent;
exports.fireEvent = $.scrollableView.fireEvent;

exports.getCurrentPage = function() {
    
    return $.scrollableView.getCurrentPage();
    
}; // END getCurrentPage()


exports.getTotalPages = function() {
    
    return $.scrollableView.getViews().length - 1;
    
}; // END getTotalPages()


exports.showPagingControl = function() {
    
    $.pagingControl.show();
    
}; // END showPagingControl()


exports.hidePagingControl = function() {
    
    $.pagingControl.hide();
    
}; // END hidePagingControl()
