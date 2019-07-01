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

        //stores dirty check values of each animation
        var dirty = {};

        //get an array of animation update functions to pass to the ticker
        var updateArray = [];


        //-->for using scroll element visibility
        //check if indicator class exists for scroll visibility
        //prefix: gsSEV
        if(document.querySelector("head").classList.contains("gsapScrollElementVisibility")) {

          dirty.gsSEV = false;

          //To do: will need to make it querySelectorAll
          var gsSEVitem = document.querySelector(".gs-target--scrollVisibility");

          //animation tween can not be set in update function because it will be overwritten
          //with each ticker call
          var gsSEVanimation = TweenLite.from(".gs-target--scrollVisibility", 1, {
                autoAlpha:0,
                ease: Linear.easeNone,
                paused: true
          });

          updateArray.push(gsSEVupdate);

        }

        //-->for using scroll add tween animation
        //check if indicator class exists for add tween
        //prefix: gsAT-
        if(document.querySelector("head").classList.contains("gsapScrollAddTween")) {

          dirty.gsAT = false;

          //will need to make it querySelectorAll, then most likely have to use the array.prototype.call(to use foreach)
          var gsSATitem = document.querySelector(".gs-target--addTween");

          TweenLite.set(gsSATitem, {
            rotation: -180,
            xPercent: -100,
            yPercent: 0,
            autoAlpha: 0,
            scale: 0,
            transformOrigin:"left bottom"
          });

          var gsSATanimation = TweenLite.to(gsSATitem, 0.45, {
                autoAlpha: 1,
                scale: 1,
                rotation: 0,
                xPercent: 0,
                yPercent: 0,
                paused: true,
                force3D: true
            }).progress(1);


           updateArray.push(gsSATupdate);

        }



          //------>setting up GSAP ticker
          TweenLite.delayedCall(0.25, function() {
            window.addEventListener("resize", resize);
            document.addEventListener("scroll", queueUpdate);
            document.addEventListener("touchmove", queueUpdate);
            TweenLite.ticker.addEventListener("tick", function(){
              //loop through and call each function in the array
              for (index in updateArray) {
                updateArray[index]();
              }
            });
          });

          //update function for gsAT
          function gsSATupdate() {
            //dirty check if nothing changed return
            if (!dirty.gsAT) return;

            //if there is no item with the class name in the document
            if (!gsSATitem) {
              console.log("Error: Animation targetClassName: " + targetClassName + " not found");
              return false;
            }

            //if dirty reset dirty status and run code
            dirty.gsAT = false;


            var min = Math.abs(gsSATitem.offsetTop - vh)
            var max = min + (gsSATitem.offsetHeight + vh);
            var currentYOffset = window.pageYOffset;

            if (currentYOffset >= min && currentYOffset <= max) {
              if (!gsSATanimation.isActive()) {
                gsSATanimation.play();
                //debug
                // console.log("play");
              }
            } else if (currentYOffset < min || currentYOffset > max) {
              gsSATanimation.pause(0);
              //debug
              // console.log("pause");
            }

            //debug
            // console.log("min = " + min);
            // console.log("max = " + max);
            // console.log("scroll = " + window.pageYOffset);
          }


          //update function for gsSEV
          function gsSEVupdate() {
            //dirty check if nothing changed return
            if (!dirty.gsSEV) return;

            //if there is no item with the class name in the document
            if (!gsSEVitem) {
              console.log("Error: Animation targetClassName: " + targetClassName + " not found");
              return false;
            }

            //if dirty reset dirty status and run code
            dirty.gsSEV = false;

            //min should be when the animation begins and that should be
            //when the bottom of viewport meets top of the element
            var min = Math.abs(gsSEVitem.offsetTop - vh);
            //max should be when element is in view port: three fourths of item height
            //but what if item is very long and 3/4 of it is already greater than vh?
            //take the min of two values: 3/4 of item height if item is short or a fraction value of vh
            var max = Math.round(Math.min(min + (gsSEVitem.offsetHeight*(3/4)), min + (vh*(4/5))));

            var norm = clamp(normalize(window.pageYOffset, min, max), 0, 1);

            gsSEVanimation.progress(norm);

              //debug
              // var text = "";
              //   text += "Min: Math.abs(item.offsetTop - vh) = " + min + "\n";
              //   text += "MaxElement: min + (item.offsetHeight*(3/4)) = " + (min + (item.offsetHeight*(3/4))) + "\n";
              //   text += "MaxVH: min + (vh*(4/5)) = " + (min + (vh*(4/5))) + "\n";
              //   text += "Item.offsetTop: " + item.offsetTop + "\n";
              //   text += "Item.offsetHeight: " + item.offsetHeight + "\n";
              //   text += "Viewport Height: " + vh + "\n";
              //   text += "Document Client Height: " + size + "\n";
              //   text += "Scroll Value: " + window.pageYOffset + "\n";
              //   text += "Percent Visibility: " + Math.round(norm * 100) + "%";

              // console.log(text);
          }


        function queueUpdate() {
          for (item in dirty) {
            dirty[item] = true;
          }
        }

        function resize() {
          for (item in dirty) {
            dirty[item] = true;
          }
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



