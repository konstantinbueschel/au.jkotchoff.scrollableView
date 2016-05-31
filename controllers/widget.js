var args               = arguments[0] || {},
    disabledDotOpacity = 0.4,
    pagingControlBelow = args['pagingControlBelow'] || false,
    pagingControlBg    = args['pagingControlBackgroundColor'] || '#f1f1f1',
    pagingControlDot   = args['pagingControlDotImage'] || WPATH('images/paging_control_dot.png');

// Is it true?
pagingControlBelow = (pagingControlBelow === true || ['true','yes','1'].indexOf(pagingControlBelow.toString().toLowerCase()) > -1);

// Style the paging control
$.pagingControl.setBackgroundColor(pagingControlBg);

// pagingControl position: inline with images or below them
if (pagingControlBelow) $.container.layout = 'vertical';

// Exports setViews
exports.setViews = setScrollableViewViews;
function setScrollableViewViews(_views) {
	if(_views) {
	    $.scrollableView.setViews(_views);
	    args.children = _views;
	    initializePagingControl();  
	}
};
// Set the view parameters as children of the ScrollableView
setScrollableViewViews(args.children);

// Exports setHeight to allow set the height after control initialization
exports.setHeight = setControlHeight;
function setControlHeight(_value) {
	if(_value) {
    	$.container.setHeight(_value);
    
	  	// In case of pagingControl shows below images, assign height to scrollview - the height of the pagingControl
	    if (pagingControlBelow) $.scrollableView.height = (_value - parseInt($.pagingControl.height)) + "dp";
	}
};

// Highlight the selected view
exports.setCurrentPage = setScrollableViewCurrentPage;
function setScrollableViewCurrentPage(currentIndex, animated) {

	animated = _.isBoolean(animated) ? animated : true;

	_.each($.pagingControlButtons.children, function(pagingDot, index) {
		pagingDot.opacity = (index == currentIndex) ? 1 : disabledDotOpacity;
	});


	if ($.scrollableView.getCurrentPage() !== currentIndex) {

		animated ? $.scrollableView.scrollToView(currentIndex) : $.scrollableView.setCurrentPage(currentIndex);
	}
};

// Initialize the dots in the faux paging control
function initializePagingControl() {
	if(args.children) {
	    _(args.children.length).times(function(n){
	        $.pagingControlButtons.add(Ti.UI.createImageView({
		        image: pagingControlDot, 
		        width: '16dp',
		        height: '16dp'
	        }));
	    });

		// Initialize the first view
		setScrollableViewCurrentPage(0);
	}
}

// Handle scroll events
$.scrollableView.addEventListener('scrollEnd', function(e){
	if(e == null || e.source == null || e.source.currentPage == null) return;
	exports.setCurrentPage(e.source.currentPage);
});

//Apply any widget arguments.
delete args.children;
_.extend($.getView(), args);

// In case of pagingControl shows below images, assign height to scrollview - the height of the pagingControl
if (pagingControlBelow) $.scrollableView.height = (parseInt(args.height) - parseInt($.pagingControl.height)) + "dp";

// Use the view from this widget in the calling container
__parentSymbol.add($.getView());

// Overwrite Backbone methods, as used in the generated code by Alloy:
// doClick ? $.__views.myWidget.on("click", doClick) : __defers["$.__views.myWidget!click!doClick"] = !0;
exports.on = function(name, cb) { return $.scrollableView.addEventListener(name, cb); };
exports.off = function(name, cb) { return $.scrollableView.removeEventListener(name, cb); };
exports._hasListenersForEventType = function(name, flag) {
    return $.scrollableView._hasListenersForEventType(name, flag);
};

// Support Titanium methods
exports.addEventListener = function(name, cb) { return $.scrollableView.addEventListener(name, cb); }
exports.removeEventListener = function(name, cb) { return $.scrollableView.removeEventListener(name, cb); };

// support next & previous "slide" from code
exports.moveNext = function(){
	$.scrollableView.moveNext();
};
exports.movePrevious = function(){
	$.scrollableView.movePrevious();
};

// Overwrite backbone aliases:
exports.bind = $.scrollableView.addEventListener;
exports.unbind = $.scrollableView.removeEventListener;
 
// Overwrite Backbone trigger and Titanium fireEvent methods for convenience
exports.trigger = $.scrollableView.fireEvent;
exports.fireEvent = $.scrollableView.fireEvent;

exports.getCurrentPage = function() { return $.scrollableView.getCurrentPage(); };
exports.getTotalPages = function() { return $.scrollableView.getViews().length - 1; };

exports.showPagingControl = function() {

	$.pagingControl.show();

}; // END showPagingControl()


exports.hidePagingControl = function() {

	$.pagingControl.hide();

}; // END hidePagingControl()
