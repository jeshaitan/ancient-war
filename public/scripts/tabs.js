function makeTabs(selector) {
    tab_lists_anchors = document.querySelectorAll(selector + " li a");
    divs = document.querySelector(selector).getElementsByTagName("div");
    for (var i = 0; i < tab_lists_anchors.length; i++) {
	if (tab_lists_anchors[i].classList.contains('active')) {
	    divs[i].style.display = "block";
	}
    }
    for (i = 0; i < tab_lists_anchors.length; i++) {
	document.querySelectorAll(".tabs li a")[i].addEventListener('click', function(e) {
	    for (i = 0; i < divs.length; i++) {
		divs[i].style.display = "none";
	    }
	    for (i = 0; i < tab_lists_anchors.length; i++) {
		tab_lists_anchors[i].classList.remove("active");
	    }
	    clicked_tab = e.target || e.srcElement;
	    clicked_tab.classList.add('active');
	    div_to_show = clicked_tab.getAttribute('href');
	    document.querySelector(div_to_show).style.display = "block";
	});
    }
}
