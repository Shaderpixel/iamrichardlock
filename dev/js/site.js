$(function(){
	'use strict';
    //***********
    // setting up Headroom.js
    //***********
    var myElement = document.querySelector("header");
    // construct an instance of Headroom, passing the element
    var headroom  = new Headroom(myElement);
    var object;
    // initialise
    headroom.init();

    //***********
    //GSAP code
    //***********
    //Homepage Animations
    if ($(".homepage-main").length) {
        TweenLite.from(".special-header",1.8,{
            y: -200,
            autoAlpha:0,
            ease: Power1.easeOut,
            textShadow:0,
        });
        TweenLite.from(".header-subtitle",0.5,{
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


    //creating inheritable function and prototype
    function gsapClassProto(nodeList, animation, update) {
      this.nodeList = nodeList;
      this.animation = animation;
      this.update = update;
    }

	function queueUpdate() {
		for (object in animationObjectArray) {
			animationObjectArray[object].makeDirty();
		}
	}


	function resize() {
		for (object in animationObjectArray) {
			animationObjectArray[object].makeDirty();
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


    //if scroll animate class exists
    if(document.querySelector("head").classList.contains("gsapScrollAnimate")) {

      var vh = window.innerHeight;
      var size = document.body.clientHeight;

      //stores an array of animation objects to pass to the ticker
      var animationObjectArray = [];

      var animationArray =[];

      gsapClassProto.prototype = {
        nodeList: null,
        animation: null,
        update: null,
        isDirty: false,
        addUniqueClasses: function() {
          Array.prototype.forEach.call(this.nodeList, function(element, index, array) {
              var uniqueClassName = "gs-target--scrollVisibility-" + index;
              element.classList.add(uniqueClassName);
          });
        },
        draw: function() {
          //if dirty then run update
          if (!this.isDirty) {
            return;
          }

          //reset isDirty
          this.isDirty = false;
          this.update();
        },
        makeDirty: function() {
          this.isDirty = true;
        }
      };

      //-->scrollVisibility code
      if(document.querySelector("head").classList.contains("gsapScrollElementVisibility")) {
        //make sure that animation class exist
        if (!document.querySelector(".gs-target--scrollVisibility")) {
              console.log("Error: Animation targetClassName: gs-target--scrollVisibility not found");
              return false;
        }

        var scrollVisibility = new gsapClassProto(
          document.querySelectorAll(".gs-target--scrollVisibility"),
          function(){
            Array.prototype.forEach.call(this.nodeList, function(element, index, array) {
              var uniqueClassName = ".gs-target--scrollVisibility-" + index;
              var tween = TweenLite.from(uniqueClassName, 1, {
                  autoAlpha:0,
                  ease: Linear.easeNone,
                  paused: true,
              });
              tween.progress(1);
             animationArray.push(tween);
            });
          },
          function() {
            Array.prototype.forEach.call(this.nodeList, function(element, index, array) {
              //min: animation should begin when top of item meets bottom of viewport
              var min = Math.abs(element.offsetTop - vh);
              //max: animation ends when top of item hits center of viewport
              var max = Math.round(min + (vh/2));
              var norm = clamp(normalize(window.pageYOffset, min, max), 0, 1);
              animationArray[index].progress(norm);
            });
          });

        //make it visible on page load
        scrollVisibility.addUniqueClasses();
        scrollVisibility.animation();

        animationObjectArray.push(scrollVisibility);
      }



      TweenLite.delayedCall(0.25, function() {
        window.addEventListener("resize", resize);
        document.addEventListener("scroll", queueUpdate);
        document.addEventListener("touchmove", queueUpdate);
        TweenLite.ticker.addEventListener("tick", function(){
          //loop through updateArray and call draw function in each object
          animationObjectArray.forEach(function(object) {
            object.draw();
          });
        });
      });
    }
});
