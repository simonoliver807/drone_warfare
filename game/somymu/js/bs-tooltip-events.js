//tooltip module to activate and disable the tooltip
var TooltipModulesto = (function() {
	return {
		disableTooltip: function() {
		    var elementArray = modules.getElementArray();
		    // is this ui1 or ui2
		    if (elementArray[0][0]) {
		        for (var i = 0; i < elementArray.length; i++) {
		            for (var j = 0; j < elementArray[i].length; j++) {
		                if (elementArray[i][j].tooltipBool) {
		                    elementArray[i][j].tooltipBool = false;
		                }
		            }
		        }
		    }
		    else {
		        for (var i = 0; i < elementArray.length; i++) {
		            if (elementArray[i].tooltipBool) {
		                elementArray[i].tooltipBool = false;
		            }
		        }
		    }
		   $('.tooltip1').css('display','none');
		},
		tooltipActivate: function(el, id) {
		    var sliderElement
		    if (modules.uiType == 'ui3') { var sliderID = id.match(/[0-9]+/g); }
		    else {
		        var id = document.getElementById(id).children[1].id;
		        var sliderID = id.match(/[0-9]+/g);
		    }
		   
		    var elementArray = modules.getElementArray();
		    if(sliderID.length > 1) {
		        for (var i = 0; i < elementArray.length; i++) {
		            for (var j = 0; j < elementArray[i].length; j++) {
		                if (elementArray[i][j].tooltipBool) {
		                    if (elementArray[i][j].sliderID != sliderID[0] + '_' + sliderID[1]) {
		                      //  document.getElementById('tooltip' + [i] + '_' + [j]).style.display = 'none';
		                        elementArray[i][j].tooltipBool = false;
		                    }
		                }
		            }
		        }
		    }
		    else {
		        for (var i = 0; i < elementArray.length; i++) {
		            if (elementArray[i].tooltipBool) {
		                if (elementArray[i].sliderID != sliderID[0]) {
		                	document.getElementById('tooltip' + elementArray[i].sliderID).style.display = 'none';
		                    elementArray[i].tooltipBool = false;
		                }
		            }
		        }
		        sliderElement = elementArray[sliderID[0]];
		      //  sliderID = 'sliderID' + sliderID[0];
		    }
		    if (modules.uiType == 'ui3') {
		        var tooltipID = 'tooltip' + sliderID;
		        if (!elementArray[sliderID].tooltipBool) {
		            document.getElementById(tooltipID).style.display = 'block';
		            elementArray[sliderID].tooltipBool = true;
		            l(elementArray[sliderID]);
		        }
		    }
		    else {
		        var tooltipID = 'tooltip' + sliderID[0] + '_' + sliderID[1];

		        if (!elementArray[sliderID[0]][sliderID[1]].tooltipBool) {
		            document.getElementById(tooltipID).style.display = 'block';
		            elementArray[sliderID[0]][sliderID[1]].tooltipBool = true;
		            l(elementArray[sliderID[0]][sliderID[1]]);
		        }

		    }
		}

		
	};
});