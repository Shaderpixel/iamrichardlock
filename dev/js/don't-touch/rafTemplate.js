    //***********
    //setting up rAF
    //***********
    var rAF = requestAnimationFrame || mozRequestAnimationFrame || webkitRequestAnimationFrame || msRequestAnimationFrame;


    //debouncing animation from trigger event and triggering only when scroll happens
    var latestKnownScrollY = 0,
        ticking = false;

    function onScroll() {
        latestKnownScrollY = window.scrollY;
        requestTick();
    }

    function requestTick() {
        if(!ticking) {
            rAF(update);
        }
        ticking = true;
    }

    function update() {
        // reset the tick so we can
        // capture the next onScroll
        ticking = false;
        var currentScrollY = latestKnownScrollY;
        // console.log("window.scrollY =" + currentScrollY);

        //read window inner height property to determine appear location
        var windowHeight = window.innerHeight;
        var scrollAppearLocation = (windowHeight*6/9) + currentScrollY;
        // console.log("windowHeight" + windowHeight);
        // console.log("scrollAppearLocation" + scrollAppearLocation);

        // read offset of DOM elements
        // and compare to the currentScrollY value
        // then apply some CSS classes // to the visible items





    }

    window.addEventListener('scroll', onScroll, false);