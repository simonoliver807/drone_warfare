var HighLight = (function() {
	var tabList;
	var bodyBindClick;
	var currentHighLighted1;
	var currentHighLighted2;
	return {
		init: function() {
		this.tablist = ['tabTap', 'tabSlide', 'tabDecide','tabShare'];
		this.bodyBindClick = false;
		this.currentHighLighted1 = null;
		this.currentHighLighted2 = null;
		},
		addHighLight: function(id) {
		    switch (id) {
		        case "tabTap":
		            var classNames = document.getElementById('tabTap').className;
		            var showHide = classNames.indexOf('selectBackground');
		            if (showHide === -1) {
		            	this.removeHighLightOverlay();
		            	this.bodyRemoveHighLight();
		                document.getElementById('tabTap').className = classNames + ' selectBackground';
		                $('.overlayDiv').addClass('bc');
		                var tapTabWidth = document.getElementById('labelsFirstCol').getBoundingClientRect().width;
		                var offsetPos = $('#modules').offset();
		                var leftMinusPadding = offsetPos.left + getCSSint($('#labelsFirstCol').css('padding-left'));
		                document.getElementById('sliderNav').style.background = '0';
		                this.updateOverlay('highLightOverlay1', 0, $(window).width(), 'tabTap', false);
		                this.updateOverlay('highLightOverlay2', leftMinusPadding, tapTabWidth, 'tabTap', true);
		                this.currentHighLighted1 = 'tabTap';
		                this.currentHighLighted2 = 'Tap';
		                $('.tab').unbind('click');
		            }
		            else {
		                $('#tabTap').removeClass('selectBackground');
		                $('.buttonColumn').removeClass('selectBackground');
		                //document.getElementById('labelsFirstCol').className = removeClass('labelsFirstCol', 'selectBackground');
		                $('.overlayDiv').removeClass('bc');
		                this.updateOverlay('highLightOverlay1', 0, 0, 0, 0, '', false);
		                this.updateOverlay('highLightOverlay2', 0, 0, 0, 0, '', false);
		                this.currentHighLighted1 = 'null';
		                this.currentHighLighted2 = 'null';
		            }
		            break;
		        case "tabSlide":
		            var classNames = document.getElementById('tabSlide').className;
		            var showHide = classNames.indexOf('selectBackground');
		            if (showHide === -1) {
		            	this.removeHighLightOverlay();
		            	this.bodyRemoveHighLight();
                        if (modules.uiType == 'ui1') {
		            	    updateClassNamesAdd('slider', ' bc');
		            	}
		            	else if (modules.uiType == 'ui2') {
		            	    updateClassNamesAdd('scorer', ' bc');
		            	}
		            	else {
		            	    updateClassNamesRemove('tooltip1', 'right');
		            	    updateClassNamesAdd('slider', ' bc');
		            	}
		                document.getElementById('tabSlide').className = classNames + ' selectBackground';
		                var tapTabWidth = document.getElementById('labelsSecondCol').getBoundingClientRect().width;
		                var offsetPosLeft = $('#tabSlide').offset().left;
		                var widthMinusPadding = tapTabWidth - getCSSint($('#labelsSecondCol').css('padding-left'));
		                document.getElementById('sliderNav').style.background = '0';
		                document.getElementById('sliderNavLeft').style.background = '0';
		                document.getElementById('sliderNavRight').style.background = '0';
		                document.getElementById('labelsBackground').className = '';
		                document.getElementById('sliderNavWrapper').className = addClass('sliderNavWrapper', 'selectedCBC');
		                this.updateOverlay('highLightOverlay1', 0, $(window).width(), 'tabSlide', false);
		                this.updateOverlay('highLightOverlay2', offsetPosLeft, widthMinusPadding, 'tabSlide', true);
		                this.currentHighLighted1 = 'tabSlide';
		                this.currentHighLighted2 = 'Slide';
		                $('.tab').unbind('click');
		            }
		            else {
		                $('#tabSlide').removeClass('selectBackground');
		                $('.slider').removeClass('bc');
		                document.getElementById('sliderNavLeft').style.background = '#fff';
		                document.getElementById('sliderNavRight').style.background = '#fff';
		                document.getElementById('labelsBackground').className = 'labelsBackground';
		                document.getElementById('sliderNavWrapper').className = removeClass('sliderNavWrapper', 'selectedCBC');
		                if (modules.uiType == 'ui2') {
		                    updateClassNamesRemove('scorer', 'bc');
		                }
		                else {
		                    updateClassNamesRemove('slider', 'bc');
		                }
		                this.updateOverlay('highLightOverlay1', 0, 0, 0, 0, '', false);
		                this.updateOverlay('highLightOverlay2', 0, 0, 0, 0, '', false);
		                this.currentHighLighted1 = 'null';
		                this.currentHighLighted2 = 'null';
		            }
		            break;
		        case "tabDecide":
		            var classNames = document.getElementById('tabDecide').className;
		            var showHide = classNames.indexOf('selectBackground');
		            if (showHide === -1) {
		            	this.removeHighLightOverlay();
		            	this.bodyRemoveHighLight();
		                document.getElementById('tabDecide').className = classNames + ' selectBackground';
		                document.getElementById('results').className = addClass('results', 'selectedCBC');
		                $('.result-header').addClass('selectedCBC45');
		                var firstBool = true;
		                $('.results').children('li').each(function () {
		                    if (firstBool) {
		                        this.className = 'firstNoBackground';
		                        firstBool = false;
		                    }
		                    else {
		                        this.className = 'chartHeaderNoBackground';
		                    }
		                });
		                var tapDecideWidth = document.getElementById('results').getBoundingClientRect().width;
		                this.updateOverlay('highLightOverlay1', 0, $(window).width(), 'tabDecide', false);
		                this.currentHighLighted1 = 'tabDecide';
		                this.currentHighLighted2 = 'Decide';
		                $('.tab').unbind('click');
		            }
		            else {
		                $('#tabDecide').removeClass('selectBackground');
		                removeClass('results', 'selecetedCBC');
		                document.getElementById('results').className = removeClass('results', 'selectedCBC');
		                $('.result-header').removeClass('selectedCBC45');
		                var firstBool = true;
		                $('.results').children('li').each(function () {
		                    if (firstBool) {
		                        this.className = 'first';
		                        firstBool = false;
		                    }
		                    else {
		                        this.className = 'defaultChartHeader';
		                    }
		                });
		                this.updateOverlay('highLightOverlay1', 0, 0, 0, 0, '', false);
		                this.currentHighLighted1 = 'null';
		                this.currentHighLighted2 = 'null';
		            }
		            break;
		        case "tabShare":
		        	var classNames = document.getElementById('results').className;
		            var showHide = classNames.indexOf('resultsDisplayNone');
		            if (showHide === -1) {
		            	this.removeHighLightOverlay();
		            	this.bodyRemoveHighLight();
		            	document.getElementById('tabShare').className = addClass( 'tabShare', 'selectBackground');
		            	document.getElementById('results').className = addClass('results', 'resultsDisplayNone');
		            	document.getElementById('shareDropDown').style.display = 'block';
		            	document.getElementById('shareDropDown').style.borderTop = '1px solid #1597a7';
		            //	this.updateOverlay('highLightOverlay1', 0, $(window).width(), 'tabDecide', false);
		            	this.currentHighLighted1 = 'tabShare';
		                this.currentHighLighted2 = 'Now Share';
		            	 $('.tab').unbind('click');
		            	
		            }
		            else {
		            	document.getElementById('results').className = removeClass('results', 'resultsDisplayNone');
		            	$('#tabShare').removeClass('selectBackground');
		            	document.getElementById('shareDropDown').style.display = 'none';
		            	document.getElementById('shareDropDown').style.borderTop = 'none';
		            	this.updateOverlay('highLightOverlay1', 0, 0, 0, 0, '', false);
		            	this.currentHighLighted1 = 'null';
		                this.currentHighLighted2 = 'null';
		            }
		        	
		        	break;
		    }
		},
		updateOverlay: function (id, posLeft, el_width, attrVal, withBG) {
		    // calculate the height and top of the highlight which the same for all 3
		    var posTop = 195;
		    var gamePadding = $('#game-content').css('padding-top');
		    var el_height = $('#game-content').height() + parseInt(gamePadding.match(/[0-9]+/g)[0]);
		    document.getElementById(id).style.left = posLeft + 'px';
		    document.getElementById(id).style.top = posTop + 'px';
		    document.getElementById(id).style.width = el_width + 'px';
		    document.getElementById(id).style.height = el_height + 'px';
		    if (withBG) {
		        document.getElementById(id).style.background = '#73c1ca';
		        document.getElementById(id).style.zIndex = '-1';
		    }
		    document.getElementById(id).setAttribute(id, attrVal);

		},
		removeHighLightOverlay: function() {
			var tabList = ['tabTap', 'tabSlide', 'tabDecide','tabShare'];
			for (var i = 0; i < tabList.length; i++) {
		        var classNamesTabs = document.getElementById(tabList[i]).className;
		        var showHide = classNamesTabs.indexOf('selectBackground');
		        if (showHide !== -1) {
		            this.addHighLight(tabList[i]);
		        }
		    }
		},
		bodyRemoveHighLight: function() {
			var self = this;
			$( "body" ).click(function( event ) {
				if(self.bodyBindClick){
					  $( "body").unbind( "click" );
					  var id = event.target.id;
					  var htmlText = event.target.innerHTML;
					  if((id == 'tabTap' || id == 'tabSlide' || id == 'tabDecide' || id == 'tabShare') && id != self.currentHighLighted1){
						  self.addHighLight(id);
					  }
					  else if((htmlText == 'Tap' || htmlText == 'Slide' || htmlText == 'Decide' || htmlText == 'Now Share') && htmlText  != self.currentHighLighted2){
						  self.addHighLight(event.target.parentElement.id);
					  }
					  else {
						  self.removeHighLightOverlay();  
						  self.bodyBindClick = false;
						  $('.tab').click(function (event) {
							    var id = event.currentTarget.id;
							    self.addHighLight(id);
							});
					  }
				}
				else {
					self.bodyBindClick = true;
				}
			});
		}
	};
});
