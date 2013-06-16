crocodoc-viewer
===============

**docviewer-multidoc.js** is Crocodoc's docviewer.js modified to allow multiple documents per page.


DEMO
----------------
[http://tim-peterson.github.io/crocodoc-docviewer/](http://tim-peterson.github.io/crocodoc-docviewer/)


Rationale
----------------
Crocodoc's docviewer can't render multiple documents on the same page. This is because each page is given the ```id="Page{X}"``` where ```X``` is the page number. Therefore when multiple documents exist on the same page there are multiple elements with the same ```id```. This leads ```docviewer``` to ```append()``` each page's content to the **first** element having a matching ```id```. So, each page of the 2nd document get appended to the ```id```-matched pages of the 1st document. This means that 2nd document renders as a blank document and the 1st document has multiple documents' page content in each page.

The solution was to give each page an id that was specific to the document. For this this, I chose to replace all instances of:

	id="Page{X}"

 with: 

	id="Page{X}"-{docviewerObj.id}

where ```docviewerObj.id``` is the ```id=""``` that you gave to docviewer upon instantiating it. In order for the ```docviewerObj``` and thus ```docviewerObj.id```, to be globally available, I also had to add it as a parameter to ```LazyLoader()```.


     


