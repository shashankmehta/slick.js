#Slick Presentation Embedding

Slick was developed for Study Portal, an application for IIT Roorkee intranet made by SDSLabs. We needed to embed presentations but could not utilize SpeakerDeck/SlideShare embedding thanks to 2AM-5AM Mon-Fri Internet blackout in the campus. We were not going to show empty divs during the blackout, right?

##Working

We followed the SpeakerDeck format. User uploads presentations in PDF format which is converted to images in the backend. The images are in serial order with a common suffix. Slick expects the image URL with a `*` in place of the number, the starting number and the ending one.

To create the presentation, include jQuery and slick.js

    var s = new Slick('.slick', options);

The options available are (with defaults shown as set):

    options = {
	    source: undefined, // eg '/slide/slick-*.jpg',
	    serialSource: false, // true | false
	    start: undefined, // eg 0
	    end: undefined, // eg 5
	    next: '.next', // class/id of element to which Slick should assign next
	    prev: '.prev', // class/id of element to which Slick should assign prev
	    keyControl: true, // In case of multiple presentations, set true for keyboard control on this one
	    container: '.slick' // class/id of div to be used as container for Slick.
    }

Programmatic access available:
	
    // s is instance of Slick
    Slick.next(s);
    Slick.prev(s);

##Features

1. There can be multiple presentations on one page.
2. Slick prefetches the next slide.
3. Quick Skipping: If the user quickly clicks on next, say, 5 times, the intermediate slides are not loaded.
4. The slide is not changed until it loads completely. _(This is not a gallery plugin)_
5. The slides are not deleted but kept hidden in DOM. _(unlike SpeakerDeck)_

Slick will support theming of presentation player. The default options are set for the theme used in the repository. The CSS is in `examples/css/style.css` and HTML in `examples/index.html`.

##To Do

1. Add sample PDF to image conversion scripts as well as instructions for PowerPoint and KeyNote
2. Add fullscreen support
3. Add support for theming.
4. Add support for serial no indicator be set to anything, not just *