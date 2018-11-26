'use strict';

var TemplateModule = (function () {
	var firstSlider;
    return {
        createButton: function (buttonID, buttonLabel) {
    		this.firstSlider = true;
            $('#modules').append(
            		 '<div class="row moduleRow' + buttonID + ' smallModule">' +
                     '<div class="col-sm-4 col-md-4 custom-col-md-4 col-lg-4 custom-col-lg-4">' +
                                 '<div class= "row"><div class="col-sm-5 col-md-5 col-lg-5"><i class="fa fa-minus fa-lg greyOutClick" id="greyOut' + buttonID + '"></i></div><div class="col-sm-7 col-md-7"></div></div>' +
                                 '<div class="row factorOverlay factorOverlay'+buttonID+'">'+
                                 	'<div class="col-sm-12 col-md-12 col-lg-12">' +
                                    '</div>'+
  	                              '</div>'+
		                                 '<div class="row factorWrapper">' +
		                                     '<div class="buttonColumn">' +
		                                         '<div class="moduleButtonContainer">' +
		                                             '<div id="moduleButton' + buttonID + '" class="factorIcon"><div class="overlayDiv overlayDiv1"></div></div>' +
		                                         '</div>' +
		
		                                     '</div>' +
		                                     '<div class="labelColumn">' +
		                                         '<span id="moduleButtonLabel' + buttonID + '" class="moduleButtonLabel">' + buttonLabel + '</span>' +
		                                     '</div>' +
		                                  '</div>' +
                     '</div>' +
                     '<div id="sliderRow' + buttonID + '" class="col-sm-8 col-md-8 custom-col-lg-8-sliderRow custom-col-8-sliderRow sliderRow">'+
                     	'<div class="sliderNavButtonUI2 sliderNavLeftUI2">'+
                     		'<button class="sliderNavFunction fa fa-chevron-left fa-3x" id="sliderNavLeftUI2"></button>'+
                     	'</div>'+
                     		'<div class="elementContainer"><ul class="elementWrapper setTransition" id="elementColumns' + buttonID + '"><li class="sliderRowFiller"></li></ul></div>'+
                     	'<div class="sliderNavButtonUI2 sliderNavRightUI2">'+
                     		'<button class="sliderNavFunction fa fa-chevron-right fa-3x" id="sliderNavRightUI2"></button>'+
                     	'</div>'+
                    // <ul class="elementWrapper setTransition" id="elementColumns' + buttonID + '"><li class="sliderRowFiller"></li></ul>' +
                     '</div>' +
                  '</div>');

            var moduleButton = document.getElementById('moduleButton' + buttonID);
            moduleButton.onclick = function () { setButtonValue(this.id); };
        },
        createSlider: function (sliderID, slider, label, windowWidth) {
	        $('#elementColumns' + slider).append('<li class="sliderContainer sliderStyle' + slider +'" id="sliderStyle' + sliderID + '">' +
	        		'<div class="sliderLabelMobile">' + label + '</div>'+
	                '<div id="slider' + sliderID + '" class="slider"><div id="sliderBackground' + sliderID + '" class="sliderBackground' + slider + '"></div></div>' +
	        '</li>');
	            
	        if(windowWidth <=992 ){
	            $('#slider' + sliderID).slider({
	                max: 101,
	                min: 1,
	                value: 0,
	                animate: 'fast',
	                orientation: "horizontal",
	                slide: function (event, ui) {
	                    setSliderValue(ui, this.id);
	                },
	                change: function (event, ui) {
	                    setSliderValue(ui, this.id);
	                },
	                stop: function (event, ui){
	                	updateChartPosition(ui, this.id);
	                }
	            });
	        }
	        else {
	        	 $('#slider' + sliderID).slider({
		                max: 101,
		                min: 1,
		                value: 0,
		                animate: 'fast',
		                orientation: "vertical",
		                slide: function (event, ui) {
		                    setSliderValue(ui, this.id);
		                },
		                change: function (event, ui) {
		                    setSliderValue(ui, this.id);
		                },
		                stop: function (event, ui){
		                	updateChartPosition(ui, this.id);
		                }
		            });
	        	
	        }
            $('#slider'+sliderID).append('<div class="maxMin"><div class="sliderScale"></div><div class="scaleMiddle"></div></div>');
            $('#slider' + sliderID).find('span').attr('id', sliderID);
            if (modules.uiType != 'ui2') {
                $('#' + sliderID).append('<div class="handleBackground"></div>'+
                                         '<div id="tooltip' + sliderID + '" class="tooltip1">' +
                                             '<div class="tooltip1-arrow"></div>' +
                                             '<div class="tooltip1-inner">' +
                                                 '<div id="tooltipValue' + sliderID + '" class="tooltipValue">0</div>' +
                                             '</div>' +
                                         '</div>');
            }
        },
        createScorer: function (scorerID, scorer, label, windowWidth) {
            $('#elementColumns' + scorer).append('<li class="scorerContainer" id="scorerStyle' + scorer + '">' +
									                     '<div id="scorer' + scorerID + '" class="scorer">' +
									                     	'<div class="scorerLabelContainer"><div class="scorerLabelText">' + label + '</div></div>' +
									                     	'<div id="scorerValue' + scorerID + '" class="scorerValue"></div>' +
									                     '</div>' +
										          '</li>');

        },
        createSliderYN: function (sliderID) {
            $('#elementColumns' + sliderID).append('<div class="sliderContainerYN" id="sliderStyle' + sliderID + '">' +
	                '<div id="slider' + sliderID + '" class="sliderUI3 sliderStyle'+ sliderID + '" >'+ 
                        '<div id="sliderBackground1' + sliderID + '" class="sliderBackgroundMiddle"></div>'+
                        '<div id="sliderBackground2' + sliderID + '" class="sliderBackground' + sliderID + '"></div>'+
                        '<div id="sliderBackground3' + sliderID + '" class="sliderBackground' + sliderID + '"></div>' +
                        '<div id="sliderBackground4' + sliderID + '" class="sliderBackgroundMiddle"></div>' +
                        '<div class="middleScale"></div><div class="scaleYes">Yes</div><div class="scaleNo">No</div>' +
                    '</div>' +
	        '</div>');
            $('#slider' + sliderID).slider({
                max: 101,
                min: -99,
                value: 0,
                animate: 'fast',
                orientation: "horizontal",
                slide: function (event, ui) {
                    setSliderValue(ui, this.id);
                },
                change: function (event, ui) {
                    setSliderValue(ui, this.id);
                },
                stop: function (event, ui) {
                    updateChartPosition(ui, this.id);
                }
            });
            $('#slider' + sliderID).append('<div class="scaleContainer">' +
                                               '<div class="maxMinYN"><div class="centerLine"></div></div>' +
                                           '</div>');
            var namedSlider = 'sliderID' + sliderID;
            //document.getElementById('slider' + sliderID).className = addClass('slider' + sliderID, 'sliderYN');
            $('#slider' + sliderID).find('span').attr('id', namedSlider);
            $('#' + namedSlider).append('<div class="handleBackground"></div>'+
                                        '<div id="tooltip' + sliderID + '" class="tooltip1 top">' +
						            		'<div class="tooltip1-arrow"></div>' +
						            		'<div class="tooltip1-inner">' +
						            		    '<div id="tooltipValue' + sliderID + '" class="tooltipValue">0</div>' +
						            		'</div>' +
						            	'</div>');
        },
        createDoughnut: function (doughnutID, data, sliderLabel, ordinalPosition) {
        	var liClass = "";
        	if (this.firstSlider) { liClass = "first"; }
        	else { liClass = "defaultChartHeader"; }
            $('.results').append('<li class="' + liClass +'" id="canvasContainer' + doughnutID + '" totalScore="' + doughnutID + '">' +
				            		'<div id="chartHeader'+doughnutID+'" class="result-header factor">'+
							            '<div id="ordianlPosition' + doughnutID + '" class="col-sm-2 col-md-2 col-lg-2 position">' + ordinalPosition + '</div>' +
							            '<div class="col-sm-8 col-md-8 col-lg-8 custom-col-md-8 position">' + sliderLabel + '</div>' +
							            '<div class="col-sm-2 col-md-2 col-lg-2 positionWidth">' +
							            	'<span id="sliderTotalSmall' + doughnutID + '" class="badge">1</span>'+
							            '</div>'+
							        '</div>'+                   
						
                  				 '</li>');
            this.firstSlider = false;
            $('#canvasContainer' + doughnutID).append('<div id="canvas' + doughnutID + '" class="canvasBackground">' +
                                                        '<div class="heightFiller20"></div>'+
            											'<div class="row">'+
            												'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 chartWidth-sm chartWidth-lg">' +
	            												'<div class="chartContainer">'+
	                                                            	'<div class="sliderTotal" id="sliderTotal' + doughnutID + '"></div>' +
	                                                            	'<canvas id=chart' + doughnutID + ' width="400" height="400"></canvas>' +
	                                                            '</div>'+
	                                                        '</div>'+
	            											'<div class="col-sm-8 chart-key-col">' +
	                                                        	'<div class="row">'+
	                                                        		'<div class="col-sm-12 col-md-12 col-lg-12 leftPadding15">' +
            																'<table class="chartKey">' +
                                                                                '<tr class="chartKeyRow"><td><div class="chartKeyDiv1"></div></td><td></td><td class="chartKeyText">Manager</td></tr>' +
                                                                                '<tr class="heightFiller5"><td></td><td></td><td></td></tr>' +
            															        '<tr class="chartKeyRow"><td><div class="chartKeyDiv2"></div></td><td></td><td class="chartKeyText">Goal Keeper</td></tr>' +
                                                                                '<tr class="heightFiller5"><td></td><td></td><td></td></tr>' +
                                                                                '<tr class="chartKeyRow"><td><div class="chartKeyDiv3"></div></td><td></td><td class="chartKeyText">Midfield</td></tr>' +
                                                                                '<tr class="heightFiller5"><td></td><td></td><td></td></tr>' +
                                                                                '<tr class="chartKeyRow"><td><div class="chartKeyDiv4"></div></td><td></td><td class="chartKeyText">League Position & Recent Form</td></tr>' +
                                                                                '<tr class="heightFiller5"><td></td><td></td><td></td></tr>' +
                                                                                '<tr class="chartKeyRow"><td><div class="chartKeyDiv5"></div></td><td></td><td class="chartKeyText">Attack</td></tr>' +
            																'</table>'+                                
                                            						'</div>'+
	                                                        		'</div>'+
	                                                        	'</div>'+
	                                                        '</div>'+
	            										'</div>'+
                                                       '</div>');
            document.getElementById('sliderTotal' + doughnutID).innerHTML = '0';
            document.getElementById('sliderTotalSmall' + doughnutID).innerHTML = '0';
            var ctx = document.getElementById('chart'+doughnutID).getContext("2d");
            return new Chart(ctx).Doughnut(data, {
            segmentShowStroke: false,
            animationEasing: "easeOutQuart",
            animateScale: true,
            animateRotate: false,
            animationSteps: 10,
            responsive: false,
            maintainAspectRatio: true,
            percentageInnerCutout : 40,
            showTooltips: false
             });
        }
    };
});


/*.slider {
        display: inline-block;
        font-weight: 600;
        font-size: 15px;
        height: 10px;
        margin: 0 2% 0 20px;
        width: 95%;
                .scaleNo {
                    position: absolute;
                    right: 97.5%;
                    top: -29px;
                }
                .scaleYes {
                    position: absolute;
                    right: 0;
                    top: -29px;
                }
    }*/