// Shorthand for $( document ).ready()
$(function(){
    //***********
    // setting up Headroom.js
    //***********
    var myElement = document.querySelector("header");
    // construct an instance of Headroom, passing the element
    var headroom  = new Headroom(myElement);
    // initialise
    headroom.init();

    //***********
    //GSAP code
    //***********
    //Homepage Animations
    if ($(".homepage-main").length) {
        TweenMax.from(".special-header",1.8,{
            y: -200,
            autoAlpha:0,
            ease: Power1.easeOut,
            textShadow:0,
        });
        TweenMax.from(".header-subtitle",0.5,{
            autoAlpha:0,
            delay:1.8,
            textShadow:0,
        });
        TweenMax.staggerFrom(".homepage-nav--flex-card",1, {
            autoAlpha:0,
            delay:2.3,
            y:200,
        }, 0.3);
    }


    //if scroll animate class exists
    if(document.querySelector("head").classList.contains("gsapScrollAnimate")) {
        var vh = window.innerHeight;
        var size = document.body.clientHeight;
        var dirty = false;
        var item = document.querySelector(".gs-target--scrollVisibility");


        //ask Kevin if its better/performant to create multiple ifs, if the page has multiple different animation going on
        //vs different animation function calls within a single update()


        //if using scroll element visibility class exists
        if(document.querySelector("head").classList.contains("gsapScrollElementVisibility")) {

            var animation = TweenLite.from(".gs-target--scrollVisibility", 1, {
                autoAlpha:0,
                ease: Linear.easeNone,
                paused: true
            });

            //setting up GSAP ticker
            TweenLite.delayedCall(0.25, function() {
              window.addEventListener("resize", resize);
              document.addEventListener("scroll", queueUpdate);
              document.addEventListener("touchmove", queueUpdate);
              TweenLite.ticker.addEventListener("tick", update);
            });

            function update() {
                  //dirty check if nothing changed return
                  if (!dirty) return;

                  //if dirty reset dirty status and run code
                  dirty = false;

                  //min should be when the animation begins and that should be
                  //when the bottom of viewport meets top of the element
                  var min = Math.abs(item.offsetTop - vh);
                  //max should be when element is in view port: three fourths of item height
                  //but what if item is very long and 3/4 of it is already greater than vh?
                  //take the min of two values: 3/4 of item height if item is short or a fraction value of vh
                  var max = Math.round(Math.min(min + (item.offsetHeight*(3/4)), min + (vh*(4/5))));

                  var norm = clamp(normalize(window.pageYOffset, min, max), 0, 1);

                  animation.progress(norm);

                    //debug
                    var text = "";
                      text += "Min: Math.abs(item.offsetTop - vh) = " + min + "\n";
                      text += "MaxElement: min + (item.offsetHeight*(3/4)) = " + (min + (item.offsetHeight*(3/4))) + "\n";
                      text += "MaxVH: min + (vh*(4/5)) = " + (min + (vh*(4/5))) + "\n";
                      text += "Item.offsetTop: " + item.offsetTop + "\n";
                      text += "Item.offsetHeight: " + item.offsetHeight + "\n";
                      text += "Viewport Height: " + vh + "\n";
                      text += "Document Client Height: " + size + "\n";
                      text += "Scroll Value: " + window.pageYOffset + "\n";
                      text += "Percent Visibility: " + Math.round(norm * 100) + "%";

                    console.log(text);

            }
        }

        function queueUpdate() {
          dirty = true;
        }

        function resize() {
          dirty = true;
          vh = window.innerHeight;
        }

        //normalize returns a value a ratio between min and max
        function normalize(value, min, max) {
          return (value - min) / (max - min);
        }

        //clamp keeps value between a given min and max
        function clamp(value, min, max) {
          return value < min ? min : (value > max ? max : value);
        }

        function elementVisibility() {

        }
    }






})



