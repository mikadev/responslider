$.fn.responSlider = function(options){

	var OBJ     	= $(this);

	/* WRAP SLIDER */
	OBJ.wrap("<div class='responslider-parent responslider-left'></div>");
	OBJ.parent().wrap("<div id='responslider-globalcontent'></div>");

	/* ATTR & PARAMS */
	var OBJPARENT   	= OBJ.parent();
	var ELEMENTS		= OBJ.find("ul li").length;
	var WIDTH 			= $(window).width();
	var HEIGHT  		= $(window).height();
	var SWIDTH  		= OBJ.width();
	var SHEIGHT 		= OBJ.height();
	var navPrev  		= "";
	var navNext  		= "";
	var nbrActu 		= 0;
	var ACTION 			= true;
	var TIMERAUTOPLAY   = 0;
	var PARAM       	= {
			responsHeight   : true,
			responsWidth    : true,
			effect			: "fade", //fade
			timer 			: 400,
			paginateAlign 	: "middle", //middle, left, right
			pagination		: true,
			navigation		: true,
			reverse			: true,
			loadBar			: {
				activate	: false,
				color       : "#000"
			},
			position		: "center", //center, left, right
			onTop    		: {
				activate	: false, 
				marginT     : 0,
				onload 		: false
			},
			autoPlay 	    : {
	            activate	: false,
	            random	    : false,
	            delay		: 1000
		    },
		    maxWidth        : 0,
		    callBack		: function(){}
};

	var click 		= 	(PARAM.effect === "fade") ? 1 : 0;
	/* WRAP INSIDE CONTENT */
	OBJ.find("ul li").wrapInner("<div style='position:absolute;width:100%;'></div>");
	//BASIC PROPERTYS
	OBJ.find("ul li").css("list-style-type", "none");
	OBJ.find("ul li img").css("max-width", "100%");
	/* hide slider until loading */
	OBJPARENT.parent()
	.css("visibility","hidden");
	/* USER PARAM */
	if(options) $.extend(PARAM, options);
	/* LOAD BAR */
	if(PARAM.loadBar.activate && PARAM.autoPlay.activate){
		var loadBAR = $("<div class='responslider-loadbar'></div>").insertBefore(OBJ.find("ul"));
		loadBAR.css({
			"height"			: 2,
		    "background-color"	: PARAM.loadBar.color,
		    "width"				: 0
		});
	}
	/* CREATE NAVIGATION ELEMENTS */
	var display = (PARAM.navigation) ? "" :"none";
	$("<div class='responslider-left-navigation responslider-navigation'><div style='display:"+display+"' class='responslider-prev'>"+navPrev+"</div></div>").insertBefore(OBJ.parent());
	$("<div class='responslider-right-navigation responslider-navigation'><div style='display:"+display+"' class='responslider-next'>"+navNext+"</div></div>").insertAfter(OBJ.parent());

	var NAVNEXT     = OBJPARENT.parent().find("div.responslider-next");
	var NAVPREV     = OBJPARENT.parent().find("div.responslider-prev");
	var NAVHEIGHT	= OBJPARENT.parent().find("div.responslider-navigation").children().height();
	var NAVWIDTH	= OBJPARENT.parent().find("div.responslider-navigation").children().width();
	/* CREATE PAGINATION ELEMENTS */
	if(PARAM.pagination){
		OBJ.append("<ul class='responslider-paginate'></ul>");
		for(var i = 1; i <= ELEMENTS; i++){
			var act = (i==1) ? "active" : "";
			OBJ.find("ul.responslider-paginate").append("<li class='"+act+"' ><span>"+i+"</span></li>");
		}
		i--;

		switch (PARAM.paginateAlign){
			case 'left':
				OBJ.find("ul.responslider-paginate").css("float","left");
			break;
			case 'right':
				OBJ.find("ul.responslider-paginate").css("float","right");
			break;
			default:
				var pgMarginL  = OBJ.find("ul.responslider-paginate li").css("margin-left");
				var pgMarginR  = OBJ.find("ul.responslider-paginate li").css("margin-right");
				var pgPaddingL = OBJ.find("ul.responslider-paginate li").css("padding-left");
				var pgPaddingR = OBJ.find("ul.responslider-paginate li").css("padding-right");
				OBJ.find("ul.responslider-paginate").width( 
					    (OBJ.find("ul.responslider-paginate li").width()*i) 
						+ (parseInt(pgMarginL)*i) 
						+ (parseInt(pgMarginR)*i) 
						+ (parseInt(pgPaddingL)*i) 
						+ (parseInt(pgPaddingR)*i) 
						+ 2*i
					);
				OBJ.find("ul.responslider-paginate").css({
					"margin" : "0 auto"
				});
				var PAGINATEWIDTH = (OBJ.find("ul.responslider-paginate").width());
		}
	}


	/* RESIZE */
	var TOPS = 0;
	window.onresize = function(){
	
		var img 			= OBJ.find("ul li:visible img");
		var imgWidth        = new Image();
		var nWidth          = 0
		imgWidth.src 		= img.attr("src");
		nWidth 				= imgWidth.naturalWidth;
		nHeight				= imgWidth.naturalHeight;
		var SLIDERTOP 		= OBJ.offset().top+SHEIGHT+paginateHeight(OBJ);
		var WINTOP			= $(window).scrollTop();
		var COMPAREELEMENT	= (SLIDERTOP-WINTOP);
		var percent 		= $(window).height() / COMPAREELEMENT;
		var newWidhtSlider  = SWIDTH*percent;
		
		//get the offset top of the element
	  	if($(window).height() < (COMPAREELEMENT+paginateHeight(OBJ)) &&
	  	   $(window).scrollTop() - ( OBJ.offset().top-(OBJ.height()*2) ) > 0){
			if(newWidhtSlider < $(window).width() && PARAM.responsHeight){
				OBJ.css("width",(newWidhtSlider-(paginateHeight(OBJ))));
				OBJPARENT.css("width",(newWidhtSlider-(paginateHeight(OBJ))));
			}else if(PARAM.responsWidth){
				OBJ.css("width",$(window).width());
				OBJPARENT.css("width",$(window).width());
			}
		}else{
			if(PARAM.responsWidth){
				OBJ.css("width",$(window).width());
				OBJPARENT.css("width",$(window).width());
			}else if(PARAM.responsHeight){
				OBJ.css("width",nWidth);
				OBJPARENT.css("width",nWidth);
			}
		}
		/* PAGINATE WIDTH */
		if(PAGINATEWIDTH > OBJ.width()){
			OBJ.find("ul.responslider-paginate").css("width", OBJ.width());
			OBJ
			.css({
				"height":OBJ.find("ul li:visible").find("img").height()+(paginateHeight(OBJ)*2)
			});
			OBJPARENT
			.css({
				"height":OBJ.find("ul li:visible").find("img").height()+(paginateHeight(OBJ)*2)
			});
		}else{
			OBJ.find("ul.responslider-paginate").css("width", PAGINATEWIDTH);
			OBJ
			.css({
				"height":OBJ.find("ul li:visible").find("img").height()+paginateHeight(OBJ)
			});
			OBJPARENT
			.css({
				"height":OBJ.find("ul li:visible").find("img").height()+paginateHeight(OBJ)
			});
		}
		if($(window).height() > HEIGHT)	{
			HEIGHT = $(window).height();
		}
		if(PARAM.onTop.activate){
			if($(window).scrollTop() < OBJ.offset().top+OBJ.height()  && 
			   $(window).scrollTop() - ( OBJ.offset().top-(OBJ.height()*2) ) > 0 )
			{
				var top = OBJ.offset().top-PARAM.onTop.marginT;
				$("html, body").animate({scrollTop : top}, 0, function(){
					$(this).clearQueue()
				});
			}
		}

		OBJPARENT
		.parent()
		.css({
			"width"    : OBJ.width(),
			"position" : "relative",
			"height"   : OBJ.find("ul li:visible").find("img").height()+paginateHeight(OBJ)
		});
		OBJ.find("ul.responslider-paginate").css("top",OBJ.find("ul li:visible").find("img").height()+5);
		OBJPARENT.parent().find('div.responslider-prev, div.responslider-next').css("margin-top",OBJ.find("ul li:visible").find("img").height()/2-(NAVHEIGHT/2));
		OBJPARENT.css("margin-left", -(OBJ.width()/2));
	}

	/* SET THE RIGHT WIDTH */
	var CPT = 0;
	var loaded = setInterval(function(){
			var isset 			= OBJ.find("ul li:visible").find("img").width();
			var img 			= OBJ.find("ul li:visible img");
			var imgWidth        = new Image();
			var nWidth          = 0;
			var nHeight         = 0;
			imgWidth.src 		= img.attr("src");
			nWidth 				= imgWidth.naturalWidth;
			nHeight  			= imgWidth.naturalHeight;

			CPT++;
			if(CPT > 5){
				nWidth 	= OBJ.find("ul li:visible").find("img").width();
				nHeight = OBJ.find("ul li:visible").find("img").height();	
			}
			if(CPT > 9){
				clearInterval(loaded);
			}
			/* CSS */
			OBJPARENT
			.parent()
			.find("div.responslider-navigation").css({
				"position" : "absolute",
    			"top"      : 0,
    			"z-index"  : 9999,
			});
			OBJPARENT
			.parent()
			.find("div.responslider-left-navigation").css({
				"left" : "0"
			});
			OBJPARENT
			.parent()
			.find("div.responslider-right-navigation").css({
				"right" : "0"
			});
			OBJPARENT.css({
			    "width"		: "100%",
			    "height"	: "100%",
			    "position"	: "absolute",
			    "left"		: "50%"
			});
			OBJ.css({
			    "position"   : "relative",
			    "overflow"	 : "hidden",
			    "width"		 : "100%",
			    "height"	 : "100%",
			    "padding"	  : 0,
		    	"-webkit-touch-callout"	: "none",
			    "-webkit-user-select"	: "none",
			    "-khtml-user-select"	: "none",
			    "-moz-user-select"		: "none",
			    "-ms-user-select"		: "none",
			    "user-select"			: "none",
			});
			OBJ.find("ul:not(.responslider-paginate) li:nth-child(n+2)").hide();
		if(isset > 0 && nWidth > 0 && nHeight > 0) {

			OBJ.css({
				"width":nWidth,
				"height":nHeight+paginateHeight(OBJ)
			});
			if(PARAM.maxWidth != 0) OBJPARENT.css("max-width", PARAM.maxWidth);
			else				    OBJPARENT.css("max-width", nWidth);
			OBJPARENT.css("max-height", nHeight+paginateHeight(OBJ));
			OBJPARENT.css("margin-left", -(OBJ.width()/2));					
			OBJ.css("max-height", nHeight+paginateHeight(OBJ));
			
			SHEIGHT 		    = OBJ.height();
			SWIDTH			    = OBJ.width();
			var SLIDERTOP 		= OBJ.offset().top+SHEIGHT+paginateHeight(OBJ);
			var WINTOP			= $(window).scrollTop();
			var COMPAREELEMENT	= (SLIDERTOP-WINTOP);
			var percent 		= $(window).height() / COMPAREELEMENT;
			var newWidhtSlider  = SWIDTH*percent;

			/* ONLOAD RESIZE */
		  	if($(window).height() < (COMPAREELEMENT+paginateHeight(OBJ)) &&  
		  	   $(window).scrollTop() - ( OBJ.offset().top-(OBJ.height()*2) ) > 0){
				if(newWidhtSlider < $(window).width() && PARAM.responsHeight){
					OBJ.css("width",(newWidhtSlider-(paginateHeight(OBJ))));
					OBJPARENT.css("width",(newWidhtSlider-(paginateHeight(OBJ))));
				}else if(PARAM.responsWidth){
					OBJ.css("width",$(window).width());
					OBJPARENT.css("width",$(window).width());
				}
			}else{
				if(PARAM.responsWidth){
					OBJ.css("width",$(window).width());
					OBJPARENT.css("width",$(window).width());
				}else if(PARAM.responsHeight){
					OBJ.css("width",nWidth);
					OBJPARENT.css("width",nWidth);
				}
			}
			/* MAX-WIDTH */
			if(PARAM.maxWidth != 0){
				OBJPARENT.parent().css("max-width", PARAM.maxWidth);
				OBJPARENT.css("max-width", PARAM.maxWidth);
				OBJ.css("max-width", PARAM.maxWidth);
			} else {
				OBJ.css("max-width", nWidth);
			}
			/* PAGINATE WIDTH */
			if(PAGINATEWIDTH > OBJ.width()){
				OBJ.find("ul.responslider-paginate").css("width", OBJ.width());
				OBJ
				.css({
					"height":OBJ.find("ul li:visible").find("img").height()+(paginateHeight(OBJ)*2)
				});
				OBJPARENT
				.css({
					"height":OBJ.find("ul li:visible").find("img").height()+(paginateHeight(OBJ)*2)
				});
			}else{
				OBJ.find("ul.responslider-paginate").css("width", PAGINATEWIDTH);
				OBJ
				.css({
					"height":OBJ.find("ul li:visible").find("img").height()+paginateHeight(OBJ)
				});
				OBJPARENT
				.css({
					"height":OBJ.find("ul li:visible").find("img").height()+paginateHeight(OBJ)
				});
			}
			OBJPARENT.css("margin-left", -(OBJ.width()/2));
			OBJ.parent().css({
				"height":OBJ.find("ul li:visible").find("img").height()+paginateHeight(OBJ)
			});
			OBJ.find("ul.responslider-paginate").css("top",OBJ.find("ul li:visible").find("img").height()+5);
			OBJPARENT.parent().find('div.responslider-prev, div.responslider-next').css("margin-top",OBJ.find("ul li:visible").find("img").height()/2-(NAVHEIGHT/2));
			switch(PARAM.position){
				case "left":
					OBJPARENT.parent().css({"float":"left"});
				break;
				case "right":
					OBJPARENT.parent().css({"float":"right"});
				break;
				default :
					OBJPARENT.parent().css("margin", "0 auto");
			}
			if(PARAM.onTop.activate && PARAM.onTop.onload){
				if($(window).scrollTop() < OBJ.offset().top+OBJ.height()  && 
				   $(window).scrollTop() - ( OBJ.offset().top-(OBJ.height()*2) ) > 0 )
				{
					var top = OBJ.offset().top-PARAM.onTop.marginT;
					$("body").animate({scrollTop : top}, 300);
				}
			}
			OBJPARENT
			.parent()
			.css({
				"width"    : OBJ.width(),
				"position" : "relative",
				"height"   : OBJ.find("ul li:visible").find("img").height()+paginateHeight(OBJ)
			});
			OBJPARENT
			.parent()
			.css("visibility","visible");
			clearInterval(loaded);
			PARAM.callBack();
		}
	}, 200 );
	
	/* AUTOPLAY */
	var autoPLAY = function(active){
		if(!ACTION) return false;
		PARAM.timer = (PARAM.autoPlay.delay < PARAM.timer) ?  PARAM.autoPlay.delay : PARAM.timer;
		if(PARAM.autoPlay.random){
			var nbr 	= Math.floor((Math.random()*ELEMENTS));
			if(nbrActu === nbr){
				(nbr+1 < ELEMENTS) ? nbr++ : nbr--;
			}
			nbrActu = nbr;
			paginator(OBJ.find("ul.responslider-paginate").find("li"),nbr);
		}else{
			click = (click === ELEMENTS) ? 0 : click; 
			paginator(OBJ.find("ul.responslider-paginate").find("li"),click++);
		}
		if(PARAM.loadBar.activate && PARAM.autoPlay.activate){
			animateLoadedBar(OBJ.find("div.responslider-loadbar"),PARAM.autoPlay.delay);
		}
	}

	if(PARAM.autoPlay.activate){
		if(PARAM.loadBar.activate){
			animateLoadedBar(OBJ.find("div.responslider-loadbar"),PARAM.autoPlay.delay);
		}
		if(PARAM.autoPlay.delay < 500) PARAM.autoPlay.delay = 1000;
		TIMERAUTOPLAY = setInterval(autoPLAY, PARAM.autoPlay.delay);
	}

	/* NEXT */
	NAVNEXT.click(function(){
		slideNext();
	});
	function slideNext(){
		var elem = OBJ.find("ul:not(.responslider-paginate) li:visible");
		var NEXT = elem.next();
		if(PARAM.reverse && NEXT.size() < 1){
			NEXT = OBJ.find("ul:not(.responslider-paginate) li:first-child");
		}
		if(PARAM.loadBar.activate && PARAM.autoPlay.activate){
			clearInterval(TIMERAUTOPLAY);
			TIMERAUTOPLAY = setInterval(autoPLAY, PARAM.autoPlay.delay);
			resetLoadedBar(OBJ.find("div.responslider-loadbar"));
			animateLoadedBar(OBJ.find("div.responslider-loadbar"),PARAM.autoPlay.delay);
		}
		if (NEXT.size() < 1 || !ACTION) return false;
		OBJ.find("ul.responslider-paginate li").removeClass("active");
		OBJ.find("ul.responslider-paginate li:eq("+NEXT.index()+")").addClass("active");
		click 				= NEXT.index()+1;
		ACTION 				= false;
		var NEWWIDTHIMAGE   = OBJ.find("ul li:visible").find("img").width();
		OBJ.css({
			width  : NEWWIDTHIMAGE
		});
		if(PARAM.effect === "slide"){
			NEXT.children().css("left", NEWWIDTHIMAGE);
			NEXT.show();
			elem.children().animate({
				right : elem.find("img").width()
			},PARAM.timer, function(){$(this).parent().hide()});
			NEXT.children().animate({
				left : 0
			},PARAM.timer, function(){$(this).css({"left":"","right":""}); ACTION = true;});
		} else if(PARAM.effect === "fade") {
			NEXT.show();
			NEXT.children().hide();
			elem.children().fadeTo(PARAM.timer,0, function(){$(this).parent().hide();});
			NEXT.children().fadeTo(PARAM.timer,1, function(){ACTION = true;});
		}
	}
	/* PREVIOUS */
    NAVPREV.click(function(){
		slidePrev();
	});
	function slidePrev(){
		var elem = OBJ.find("ul:not(.responslider-paginate) li:visible");
		var PREV = elem.prev();
		if(PARAM.reverse && PREV.size() < 1){
			PREV = OBJ.find("ul:not(.responslider-paginate) li:last-child");
		}
		if(PARAM.loadBar.activate && PARAM.autoPlay.activate){
			clearInterval(TIMERAUTOPLAY);
			TIMERAUTOPLAY = setInterval(autoPLAY, PARAM.autoPlay.delay);
			resetLoadedBar(OBJ.find("div.responslider-loadbar"));
			animateLoadedBar(OBJ.find("div.responslider-loadbar"),PARAM.autoPlay.delay);
		}
		if (PREV.size() < 1 || !ACTION) return false;
		OBJ.find("ul.responslider-paginate li").removeClass("active");
		OBJ.find("ul.responslider-paginate li:eq("+PREV.index()+")").addClass("active");
		click 				= PREV.index()+1;
		ACTION 				= false;
		var NEWWIDTHIMAGE   = OBJ.find("ul li:visible").find("img").width();
		OBJ.css({
			width  : NEWWIDTHIMAGE
		});
		if(PARAM.effect === "slide"){
			PREV.children().css("right", NEWWIDTHIMAGE);
			PREV.show();
			elem.children().animate({
				left : elem.find("img").width()
			},PARAM.timer, function(){$(this).css({"left":"","right":""}); $(this).parent().hide()});
			PREV.children().animate({
				right : 0
			},PARAM.timer, function(){ACTION = true;});
		} else if(PARAM.effect === "fade") {
			PREV.show();
			PREV.children().hide();
			elem.children().fadeTo(PARAM.timer,0, function(){$(this).parent().hide();});
			PREV.children().fadeTo(PARAM.timer,1, function(){ACTION = true;});
		}
	}
	/* KEYBOARD NAVIGATION */
	$(document).keydown(function(e){
		if(e.which == 39){
			e.preventDefault();
			slideNext();
		}else if(e.which == 37){
			e.preventDefault();
			slidePrev();
		}
	});
	/* Mobile detection */
	if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(navigator.userAgent.toLowerCase())) {
		try{
			 OBJ.on("swiperight", function(){
				slidePrev();
			 });
			 OBJ.on("swipeleft", function(){
				slideNext();
			 });
		}catch(e){
			//do nothing
		}
	}
    /* responslider-paginate */
    var paginator = function(objActu,index){
	    		var INDEX 			= objActu.index();
	    		var INDEXACTU		= OBJ.find("ul:not(.responslider-paginate) li:visible").index();
	    		var NEWWIDTHIMAGE   = OBJ.find("ul:not(.responslider-paginate) li:visible").find("img").width();
	    		var ELEM 			= OBJ.find("ul:not(.responslider-paginate) li:visible").children();
	    		if(index) INDEX 	= index;
	    		if(PARAM.loadBar.activate && PARAM.autoPlay.activate){
					clearInterval(TIMERAUTOPLAY);
					TIMERAUTOPLAY = setInterval(autoPLAY, PARAM.autoPlay.delay);
					resetLoadedBar(OBJ.find("div.responslider-loadbar"));
					animateLoadedBar(OBJ.find("div.responslider-loadbar"),PARAM.autoPlay.delay);
				}
	    		//REINIT PLAYER EVEN AFTER MULTICLICK
	    		setTimeout(function(){ACTION = true;}, PARAM.timer);
	    		if(!ACTION) return false;
	    		ACTION = false;
	    		/* ADD CLASS ACTIVE */
	    		OBJ.find("ul.responslider-paginate li").removeClass("active");
	    		OBJ.find("ul.responslider-paginate li:eq("+INDEX+")").addClass("active");
	    		if(PARAM.effect === "slide"){
		    		if(INDEX > INDEXACTU){
		    			OBJ.find("ul li:eq("+INDEX+")").children().css("left", NEWWIDTHIMAGE);
		    			OBJ.find("ul li:eq("+INDEX+")").show();
		    			ELEM.animate({
							right : NEWWIDTHIMAGE
						},PARAM.timer, function(){$(this).parent().hide();$(this).css({"left":"","right":""});});
						OBJ.find("ul li:eq("+INDEX+")").children().animate({
							left : 0
						},PARAM.timer, function(){$(this).css({"left":"","right":""});ACTION = true;});
		    		}else if(INDEX < INDEXACTU){
		    			ACTION = false;
		    			OBJ.find("ul li:eq("+INDEX+")").children().css("right", NEWWIDTHIMAGE);
		    			OBJ.find("ul li:eq("+INDEX+")").show();
		    			ELEM.animate({
							left : NEWWIDTHIMAGE
						},PARAM.timer, function(){$(this).parent().hide();$(this).css({"left":"","right":""});});
						OBJ.find("ul li:eq("+INDEX+")").children().animate({
							right : 0
						},PARAM.timer, function(){$(this).css({"left":"","right":""});ACTION = true;});
		    		}else{
		    			return false;
		    		}
		    	} else if(PARAM.effect === "fade") {
		    		ACTION = false;
					OBJ.find("ul li:eq("+INDEX+")").show();
					OBJ.find("ul li:eq("+INDEX+")").children().hide();
					OBJ.find("ul li:eq("+INDEXACTU+")").children().fadeTo(PARAM.timer,0, function(){$(this).parent().hide();});
					OBJ.find("ul li:eq("+INDEX+")").children().fadeTo(PARAM.timer,1, function(){ACTION = true;});
				}

		}

		/* PAGINATE ON CLICK */
	    OBJ.find("ul.responslider-paginate")
       .find("li")
       .click(function(){
       	   	click = $(this).index()+1;
			paginator($(this));
		});
    	//$("script").remove();
}

function resetLoadedBar(obj){
	obj.clearQueue();
	obj.stop();
	obj.css("width",0);
}
function animateLoadedBar(obj,time){
	obj.animate({
		width : 100+"%"
	}, time, function(){$(this).css("width",0)});
}
function paginateHeight(obj){
	var pgMarginT  = isNaN(parseInt(obj.find("ul.responslider-paginate li").css("margin-top"))) ? 0 : parseInt(obj.find("ul.responslider-paginate li").css("margin-top"));
	var pgPaddingT = isNaN(parseInt(obj.find("ul.responslider-paginate li").css("padding-top"))) ? 0 : parseInt(obj.find("ul.responslider-paginate li").css("padding-top"));
	var pgTop 	   = isNaN(parseInt(obj.find("ul.responslider-paginate li").css("top"))) ? 0 : parseInt(obj.find("ul.responslider-paginate li").css("top"));
	var height     = obj.find("ul.responslider-paginate").height();
	return pgMarginT+pgPaddingT+pgTop+height;
}
