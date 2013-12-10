#Slick Presentation Embedding

Slick was developed for Study Portal, an application for IIT Roorkee intranet made by SDSLabs. We needed to embed presentations but could not utilize SpeakerDeck/SlideShare embedding thanks to 2AM-5AM Mon-Fri Internet blackout in the campus. We were not going to show empty divs during the blackout, right?

##Working

We followed the SpeakerDeck format. User uploads presentations in PDF format which is converted to images in the backend. The images are in serial order with a common suffix. Slick expects the image URL with a `*` in place of the number, the starting number and the ending one.

Slick will also support creating presentation from an array of images which are not in serial order.

To create the presentation

    var slick = new Slick('.slick', options);

The options available are (with defaults shown as set):

    options = {
	    source: undefined, // eg '/slide/slick-*.jpg',
	    serialSource: false, // true | false
	    start: undefined, // eg 0
	    end: undefined, // eg 5
	    next: '.next', // class/id of element to which Slick should assign next
	    prev: '.prev', // class/id of element to which Slick should assign prev
	    keyControl: true, // In case of multiple presentation, set true for keyboard control on this one
	    container: '.slick' // class/id of div to be used as container for Slick.
    }

Slick will support theming of presentation. The default options are set for the theme used in the repository. The CSS is in `css/style.css` and HTML in `index.html`.

##To Do

1. Add support for creating presentation from non serial image sources too
2. Add sample PDF to image conversion scripts as well as instructions for PowerPoint and KeyNote
3. Add fullscreen support
4. Add support for theming.
5. Add support for serial no indicator be set to anything, not just *