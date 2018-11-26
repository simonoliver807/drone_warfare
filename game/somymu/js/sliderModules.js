"use strict";

var ButtonModule = (function () {
	var buttonValue;
    var buttonID;
    var buttonUpdateID;
    var disabledBool;
    return {
        setButtonID: function (buttonID) {
            this.buttonID = buttonID;
            this.buttonUpdateID = buttonID;
            this.disabledBool = false;
            this.buttonValue = 1;
        },
        //getButtonID: function (){
        //    return this.buttonID;
        //},
        setButtonValue: function () {
            if (this.buttonValue === 5) { this.buttonValue = 1; }
            else { this.buttonValue += 1; }
        }
    };
});
var DoughNutModule = (function () {
    var doughnutID;
    var doughnutObject;
    var chartStatus;
    var ordinalPosition;
    var totalScore;
    var data;
    return {
        setDoughnutID: function (doughnutID, ordinalPosition, data) {
            this.doughnutID = doughnutID;
            this.doughnutObject = {};
            this.chartStatus = true;
            this.ordialPosition = ordinalPosition;
            this.totalScore = 0;
            this.data = data;
        }
    };
});
var UIModule = (function () {
    var elementArray = [];
    var buttonArray = [];
    var doughnutArray = [];
    var numberOfElements;
    var numberOfButtons;
    var numberOfCharts;
    var currentElement;
    var elementWidth;
    var id;
    var ie9 = false;
    var windowWidth;
    var windowResizeBool;
    // var bodyRemoveHighLight;
    var highLight;
    var numberOfGreyOuts;
    var elementLabels;
    var buttonLabels;
    var scorerValues;
    var chartData;
    var uiType;

    return {
        init: function (numberOfElements, numberOfButtons, uiType) {
            if (document.getElementsByTagName("body")[0].getAttribute("browser") == 'ie9') {
                document.getElementsByTagName("body")[0].className = 'cms-bootstrap ie9';
                this.ie9 = 'ie9';
            };
            var self = this;
            var toolTip = new TooltipModulesto;
            this.highLight = new HighLight;
            this.currentElement = 0;
            this.elementWidth = 105;
            // set up screen size
            this.windowWidth = $(window).width();
            this.windowResizeBool = false;
            this.bodyRemoveHighLight = false;
            this.numberOfGreyOuts = numberOfButtons;
            this.elementLabels = ['Arsenal', 'Chelsea', 'Liverpool', 'Portsmouth', 'Man United', 'Man City', 'Leeds', 'Bournemouth', 'Reading'];
            this.buttonLabels = ['Manager', 'Goal Keeper & Defence', 'Midfield', 'league Position & Recent Form', 'Attack', 'Chairman'];
            this.scorerValues = [];
            this.chartData = document.getElementById('jsonInput').value;
            this.chartData = JSON.parse(this.chartData);
            if (uiType == 'ui3') { this.numberOfElements = numberOfButtons; }
            else { this.numberOfElements = numberOfElements; }
            this.numberOfButtons = numberOfButtons;
            this.numberOfCharts = 2;
            this.uiType = uiType;
            if (this.uiType == 'ui1') {
                document.getElementById('game-content').className = 'ui1';
                this.slider();
            }
            else if (this.uiType == 'ui2') {
                document.getElementById('game-content').className = 'ui2';
                this.scorer();
            }
            else if (this.uiType = 'ui3') {
                document.getElementById('game-content').className = 'ui3';
                this.sliderYN();
            }
            // bind events
            $('.custom-col-md-4').mouseover(function () {
                toolTip.disableTooltip();
            });
            $('.custom-col-md-3').mouseover(function () {
                toolTip.disableTooltip();
            });
            // hide the tool tip at the top
            document.getElementById('fixedHeader').addEventListener('mouseover',
                function () {
                    toolTip.disableTooltip();
                }, false);
            $('footer').mouseover(function (event) {
                event.stopPropagation();
                toolTip.disableTooltip();
            });
            $('.leftRightButton').on('mouseOver', function (event) {
                event.stopPropagation();
                toolTip.disableTooltip();
            });
            //$('.sliderRow').on('mouseover', function (event) {
            //    event.stopPropagation();
            //    toolTip.tooltipActivate('', this.id);
            //});
            $('.sliderContainer').on('mouseover', function (event) {
                event.stopPropagation();
                toolTip.tooltipActivate('', this.id);
            });
            $('.sliderContainerYN').on('mouseover', function (event) {
                event.stopPropagation();
                toolTip.tooltipActivate('', this.id);
            });
            $('#modules').on('mouseout', function (event) {
                event.stopPropagation();
                toolTip.disableTooltip('', this.id);
            });
            if(this.windowWidth <= 1100) {
                $('.elementContainer').css('margin', '0');
                $('.sliderNavContainer1200').css('margin', '0');
            }
            if(this.windowWidth > 1100) {
                $('.elementContainer').css('margin', '0 auto');
                 $('.sliderNavContainer1200').css('margin', '0 auto');
            }
            if(this.windowWidth <= 1200){
                document.getElementById('sliderLabel4').className = addClass('sliderLabel4', 'hideVisibility');
            }
            //$('.sliderContainer').hover(function (event) {
            //    event.stopPropagation();
            //    toolTip.tooltipActivate(this, this.id);
            //});
            //$('.sliderRow').hover(function (event) {
            //    event.stopPropagation();
            //    toolTip.tooltipActivate(this, this.id);
            //});
        },
        slider: function () {
            //this.sliderRowWidth = 525;
            var templateModule = new TemplateModule();
            //lets create an array of buttons and a array of doughnuts to start
            var sliderLabels = ['Arsenal', 'Chelsea', 'Liverpool', 'Portsmouth', 'Man United', 'Man City', 'Leeds', 'Bournemouth'];
            // add a label for each slider
            for (var i = 0; i < this.numberOfElements; i++) {
                $('#sliderNavWrapper').append('<li id="sliderLabel' + i + '" class="sliderLabelContainer">' + sliderLabels[i] + '</li>');
            }
            for (var i = 0; i < this.numberOfButtons; i++) {
                buttonArray[i] = new ButtonModule();
                buttonArray[i].setButtonID(i);
                templateModule.createButton(i, this.buttonLabels[i]);
            }
            for (var sliderColumn = 0; sliderColumn < this.numberOfButtons; sliderColumn++) {
                // for each column of sliders, one for each button, create a column
                var sliderColumnArray = [];
                for (var i = 0; i < this.numberOfElements; i++) {
                    sliderColumnArray[i] = new SliderModule();
                    var sliderID = sliderColumn + '_' + i;
                    sliderColumnArray[i].setSliderID(sliderID);
                    templateModule.createSlider(sliderID, sliderColumn, sliderLabels[i], this.windowWidth);
                }
                elementArray.push(sliderColumnArray);
            }
            for (var i = 0; i < this.numberOfElements; i++) {
                // create a chart for each sliderColumn
                doughnutArray[i] = new DoughNutModule();
                var ordinalPosition = this.getOrdinalPosition(i + 1);
                doughnutArray[i].setDoughnutID(i, ordinalPosition, this.chartData);
                doughnutArray[i].doughnutObject = templateModule.createDoughnut(i, this.chartData, sliderLabels[i], ordinalPosition);
            }
            // resize all the charts
            $('canvas').css({ width: '100%', height: '100%' });           
            if (this.windowWidth < 992) {
                updateClassNamesAdd('ui-slider-handle', ' fa fa-minus-square fa-lg fa-rotate-90 handleStyle');
                updateClassNamesAdd('tooltip1', ' top');
                this.windowResizeBool = true;
            }
            else {
                updateClassNamesAdd('ui-slider-handle', ' fa fa-minus-square fa-2x handleStyle');
                updateClassNamesAdd('tooltip1', ' right');
                // multiply the number of sliders by the width of the sliders to give the slider container width
                var containerWidth = (this.elementWidth * this.numberOfElements) + 30;
                $('.elementWrapper').css('width', containerWidth);
                $('.sliderNavWrapper').css('width', containerWidth);
            }
            // update the chart positions so only the css is updated
            this.updateChartPositions();
        },
        scorer: function () {
            var self = this;
            var templateModule = new TemplateModule();
            // add a label for each scorer
            for (var i = 0; i < this.numberOfElements; i++) {
                $('#sliderNavWrapper').append('<li id="sliderLabel' + i + '" class="sliderLabelContainer">' + this.elementLabels[i] + '</li>');
            }
            var scorerArray = [];
            for (var i = 0; i < this.numberOfElements; i++) {
                scorerArray[i] = i + 1;
            }
            for (var i = 0; i < this.numberOfButtons; i++) {
                buttonArray[i] = new ButtonModule();
                buttonArray[i].setButtonID(i);
                templateModule.createButton(i, this.buttonLabels[i]);
                this.scorerValues.push(scorerArray);
            }
            for (var scorerColumn = 0; scorerColumn < this.numberOfButtons; scorerColumn++) {
                // for each column of scorers, one for each button, create a column
                var scorerColumnArray = [];
                for (var i = 0; i < this.numberOfElements; i++) {
                    scorerColumnArray[i] = new ScorerModule();
                    var scorerID = scorerColumn + '_' + i;
                    scorerColumnArray[i].setscorerID(scorerID, this.numberOfElements);
                    templateModule.createScorer(scorerID, scorerColumn, this.elementLabels[i], this.windowWidth);
                }
                elementArray.push(scorerColumnArray);
            }
            for (var i = 0; i < this.numberOfElements; i++) {
                // create a chart for each scorerColumn
                doughnutArray[i] = new DoughNutModule();
                var ordinalPosition = this.getOrdinalPosition(i + 1);
                doughnutArray[i].setDoughnutID(i, ordinalPosition, this.chartData);
                doughnutArray[i].doughnutObject = templateModule.createDoughnut(i, this.chartData, this.elementLabels[i], ordinalPosition);
            }
            // bind click events to all the buttons
            $('.scorer').on('click', function () {
                self.setScorerValue(this.id);
            });
            // resize all the charts
            $('canvas').css({ width: '100%', height: '100%' });
            // multiply the number of scorers by the width of the scorers to give the scorer container width
            var containerWidth = (this.elementWidth * this.numberOfElements) + 30;
            $('.elementWrapper').css('width', containerWidth);
            $('.sliderNavWrapper').css('width', containerWidth);
            // update the chart positions so only the css is updated
            this.updateChartPositions();

        },
        sliderYN: function() {
            //lets create an array of buttons and a array of doughnuts to start
            var chartLabels = ['No', 'Yes'];
            var buttonLabels = ['Self-determination', 'Economy', 'Immigration', 'Stiff Upper Lip', 'Relationship with USA'];
            var templateModule = new TemplateModule();
            this.windowResizeBool = true;
            // add a label for each slider
            for (var i = 0; i < this.numberOfbuttons; i++) {
                $('#sliderNavWrapper').append('<li class="sliderLabelContainer">' + sliderLabels[i] + '</li>');
            }
            for (var i = 0; i < this.numberOfButtons; i++) {
                buttonArray[i] = new ButtonModule();
                buttonArray[i].setButtonID(i);
                templateModule.createButton(i, buttonLabels[i]);
                elementArray[i] = new SliderModuleYN();
                elementArray[i].setSliderID(i);
                templateModule.createSliderYN(i);
            }
            for (var i = 0; i < this.numberOfCharts; i++) {
                // create a chart for each sliderColumn
                doughnutArray[i] = new DoughNutModule();
                var ordinalPosition = this.getOrdinalPosition(i + 1);
                doughnutArray[i].setDoughnutID(i, ordinalPosition, this.chartData);
                doughnutArray[i].doughnutObject = templateModule.createDoughnut(i, this.chartData, chartLabels[i], ordinalPosition);
            }
            // bind click events to all the buttons
            //$('.ui-slider-handle').on('click', function () {

            //    self.setButtonValue(this.id);
            //});
            $('.navButtonContainer').css('display', 'none');
            $('.labelsBackground').css('display', 'none');
            // resize all the charts
            $('canvas').css({ width: '100%', height: '100%' });
            // update the handle style 
            for (var i = 0; i < this.numberOfButtons; i++) {
                document.getElementById('sliderID' + i).className = addClass('sliderID' + i, ' overlaydiv overlayDiv1 handleStyle');
            }
            // update the handle style and the height of the button colmuns
            if (this.windowWidth < 992) {
                updateClassNamesAdd('ui-slider-handle', ' fa fa-minus-square fa-lg fa-rotate-90 handleStyle');
            }
            else {
                updateClassNamesAdd('ui-slider-handle', ' fa fa-minus-square fa-2x fa-rotate-90 handleStyle');
            }
            // don't need to do this for iphone
            //            if (this.windowWidth > 992) {
            //                // multiply the number of sliders by the width of the sliders to give the slider container width
            //                var containerWidth = (this.sliderWidth * this.numberOfSliders) + 30;
            //                $('.sliderWrapper').css('width', containerWidth);
            //                $('.sliderNavWrapper').css('width', containerWidth);
            //            }
            // update the chart positions so only the css is updated
            this.updateChartPositions();
        },
        setButtonValue: function (buttonID) {
            var button = buttonArray[buttonID];
            button.setButtonValue();
            var buttonValue = buttonArray[buttonID].buttonValue;
            // update the total value for the slider
            for (var i = 0; i < this.numberOfElements; i++) {
                elementArray[buttonID][i].setValues('', buttonValue);
            }
            if (buttonArray[buttonID].buttonValue === 1) {
                $('#moduleButton' + buttonID).children().removeClass('overlayDiv' + 5);
            }
            else { $('#moduleButton' + buttonID).children().removeClass('overlayDiv' + (buttonArray[buttonID].buttonValue - 1)); }
            $('#moduleButton' + buttonID).children().addClass('overlayDiv' + buttonArray[buttonID].buttonValue);
            // this update the total value
            this.updateButtonValue(buttonID); 
        },
        setSliderValue: function (sliderValue, sliderID) {
            // update the slider module values each time the slider moves
            elementArray[sliderID[0]][sliderID[1]].setValues(sliderValue, buttonArray[sliderID[0]].buttonValue);
           
            this.updateTotal(sliderID[[1]]);
            var chartObject = doughnutArray[sliderID[1]].doughnutObject;
            var segmentAdjust = buttonArray[sliderID[0]].buttonUpdateID;
            var segment1 =  (parseInt(segmentAdjust) * 2 ); 
            var segment2  = segment1 + 1;
            var sliderValue = elementArray[sliderID[0]][sliderID[1]].totalValue / 10;
            var buttonValue = (buttonArray[sliderID[0]].buttonValue * 10) - sliderValue;
            
            chartObject.segments[segment1].value = buttonValue;
            chartObject.segments[segment2].value = sliderValue;
            chartObject.update();

        },
        updateButtonValue: function (buttonNumber) {
            var updateDoughnut = false;
            if (buttonArray[buttonNumber].buttonUpdateID !== null) {
                var segmentAdjust = buttonArray[buttonNumber].buttonUpdateID;
                var segment1 = (parseInt(segmentAdjust) * 2);
                var segment2 = segment1 + 1;
                for (var sliderNumber = 0; sliderNumber < this.numberOfElements; sliderNumber++) {
                    var chartObject = doughnutArray[sliderNumber].doughnutObject;
                    var sliderValue = elementArray[buttonNumber][sliderNumber].totalValue / 10;
                    var buttonValue = (buttonArray[buttonNumber].buttonValue * 10) - sliderValue;
                    chartObject.segments[segment1].value = buttonValue;
                    chartObject.segments[segment2].value = sliderValue;
                    chartObject.update();
                    this.updateTotal(sliderNumber);
                }
            }
            else {
                for (var sliderNumber = 0; sliderNumber < this.numberOfElements; sliderNumber++) {
                    var chartObject = doughnutArray[sliderNumber].doughnutObject;
                    var sliderValue = 0;
                    var buttonValue = 0;
                    this.updateTotal(sliderNumber);
                }
            }
            this.updateChartPositions();
        },
        updateTotal: function (labelNumber) {
            // then update the total value
            var sliderTotal = 0;
            var weightTotal = 0;
            var verticleNumber = 0; 
            for (var rowNumber = 0; rowNumber < this.numberOfButtons; rowNumber++) {
                if(!buttonArray[rowNumber].disabledBool){
                    sliderTotal = sliderTotal + elementArray[rowNumber][labelNumber].totalValue;
                    weightTotal += buttonArray[rowNumber].buttonValue;
                }
            }
            var chartTotalHTML = Math.round(100 * (sliderTotal / (weightTotal * 100)));
            doughnutArray[labelNumber].totalScore  = chartTotalHTML;
            document.getElementById('sliderTotal' + labelNumber).innerHTML = chartTotalHTML;
            document.getElementById('sliderTotalSmall' + labelNumber).innerHTML = chartTotalHTML;
        },
        removeChartSegment: function (id) {
            var deleteSegment = buttonArray[id].buttonUpdateID * 2;
            for(var i = 0; i < doughnutArray.length; i ++){
                doughnutArray[i].doughnutObject.removeData(deleteSegment);
                doughnutArray[i].doughnutObject.removeData(deleteSegment);
            }
        },
        addChartSegment: function (id) {
            id = parseInt(id) * 2;
            var idPlus1 = id + 1;
            for(var i = 0; i < doughnutArray.length; i ++){
                var data = doughnutArray[i].data; 
                doughnutArray[i].doughnutObject.addData({
                    value: 1,
                    color: data[id].color
                }, String(id));
                doughnutArray[i].doughnutObject.addData({
                    value: 0,
                    color: data[idPlus1].color
                }, idPlus1);
            }
            for (var i = 0; i < doughnutArray.length; i++) {
                var dObj = doughnutArray[i];
                var segementToUpdate = 0;
                var segmentPlus1 = 1;
                for (var segment = 0; segment < this.numberOfButtons; segment++) {
                    var segment1 = segment * 2;
                    var segment2 = segment1 + 1;
                    var buttonNumber = segment;
                    if (!buttonArray[buttonNumber].disabledBool) {
                        dObj.doughnutObject.segments[segementToUpdate].fillColor = dObj.data[segment1].color;
                        dObj.doughnutObject.segments[segementToUpdate].highlightColor = dObj.data[segment1].color;
                        dObj.doughnutObject.segments[segmentPlus1].fillColor = dObj.data[segment2].color;
                        dObj.doughnutObject.segments[segmentPlus1].highlightColor = dObj.data[segment2].color;
                        segementToUpdate += 2;
                        segmentPlus1 = segementToUpdate + 1;
                    }
                }
            }
            for (var i = 0; i < doughnutArray.length; i++) {
                doughnutArray[i].doughnutObject.update();
            }
        },
        updateChartPositions: function () {
            if (this.uiType == 'ui3') {
                numberOfCharts = this.numberOfCharts;
            }
            else { numberOfCharts = this.numberOfElements; }
            for(var i = 0; i < numberOfCharts; i++){
                document.getElementById('canvasContainer'+i).setAttribute('totalScore', doughnutArray[i].totalScore);	
            }
            tinysort('ul.results>li',{attr:'totalScore',order:'desc'}); 
            $('.results').children('li').each(function () {
                this.className = "";
            });
            var count = 1;
            var self = this;
            $('.results').children('li').each(function () {
                var op = self.getOrdinalPosition(count);
                var thisID = this.id;
                thisID = thisID.match(/[0-9]+/g);
                $('#ordianlPosition'+thisID[0]).text(op);
                document.getElementById('sliderTotalSmall' + thisID[0]).className = 'badge';
                switch(count) {
                    case 1:
                        if (self.uiType !== 'ui3') {
                            $('#canvas' + thisID[0]).css('display', 'block');
                        }
                        document.getElementById('sliderTotalSmall' + thisID[0]).className = addClass('sliderTotalSmall' + thisID[0], 'goldBadge');
                        this.className = 'first';
                        break;
                    case 2:
                        if (self.uiType !== 'ui3') {
                            $('#canvas' + thisID[0]).css('display', 'none');
                        }
                        document.getElementById('sliderTotalSmall' + thisID[0]).className = addClass('sliderTotalSmall' + thisID[0], 'silverBadge');
                        this.className = 'defaultChartHeader';
                        break;
                    case 3:
                        $('#canvas'+thisID[0]).css('display','none');
                        document.getElementById('sliderTotalSmall' + thisID[0]).className = addClass('sliderTotalSmall' + thisID[0], 'bronzeBadge');
                        this.className = 'defaultChartHeader';
                        break;
                    default:
                        $('#canvas' + thisID[0]).css('display', 'none');
                        this.className = 'defaultChartHeader';
                }
                count = count + 1;

            });
        },
        getOrdinalPosition: function (n) {
            var s=["th","st","nd","rd"],
            v=n%100;
            return n+(s[(v-20)%10]||s[v]||s[0]);
        },
        getElementArray: function () {
            return elementArray;
        },
        getChartArray: function () {
            return doughnutArray;
        },
        getButtonArray: function () {
            return buttonArray;
        },
        setScorerValue: function (scorerID) {
            var scorerID = scorerID.match(/[0-9]+/g);
            var currentPos = elementArray[scorerID[0]][scorerID[1]].opValue;
            var tempScoreArray = [];
            var tempCurrentScore = null;
            var lastValue = this.scorerValues[scorerID[0]][this.scorerValues[scorerID[0]].length - 1];
            if (currentPos == 0) {
                for (var i = 0; i < this.scorerValues[scorerID[0]].length; i++) {
                    if (i == 0) {
                        tempCurrentScore = this.scorerValues[scorerID[0]][i];
                    }
                    else {
                        tempScoreArray.push(this.scorerValues[scorerID[0]][i]);
                    }
                }
                this.scorerValues[scorerID[0]] = tempScoreArray;
                elementArray[scorerID[0]][scorerID[1]].setScorerValue = this.numberOfElements - (tempCurrentScore - 1);
                elementArray[scorerID[0]][scorerID[1]].opValue = tempCurrentScore;

            }
            else if (currentPos > lastValue || typeof(lastValue) == 'undefined') {
                tempCurrentScore = 0;
                for (var i = 0; i < this.scorerValues[scorerID[0]].length; i++) {
                     tempScoreArray.push(this.scorerValues[scorerID[0]][i]); 
                }
                tempScoreArray.push(currentPos);
                this.scorerValues[scorerID[0]] = tempScoreArray;
                if (tempCurrentScore != 0) { elementArray[scorerID[0]][scorerID[1]].setScorerValue = this.numberOfElements - (tempCurrentScore - 1); }
                else { elementArray[scorerID[0]][scorerID[1]].setScorerValue = 0; }
                elementArray[scorerID[0]][scorerID[1]].opValue = tempCurrentScore;
            }
            else {
                for (var i = 0; i < this.scorerValues[scorerID[0]].length; i++) {
                    if (currentPos < this.scorerValues[scorerID[0]][i] && tempCurrentScore === null) {
                        tempCurrentScore = this.scorerValues[scorerID[0]][i];
                        tempScoreArray.push(currentPos);
                    }
                    else {
                        tempScoreArray.push(this.scorerValues[scorerID[0]][i]);
                    }
                }
                elementArray[scorerID[0]][scorerID[1]].setScorerValue = this.numberOfElements - (tempCurrentScore - 1);
                elementArray[scorerID[0]][scorerID[1]].opValue = tempCurrentScore;
                this.scorerValues[scorerID[0]] = tempScoreArray;

            }
            // update the scorer module values each time the scorer moves
            elementArray[scorerID[0]][scorerID[1]].setValues(scorerValue, buttonArray[scorerID[0]].buttonValue);
            //var op = this.getOrdinalPosition(elementArray[scorerID[0]][scorerID[1]].setScorerValue);
            var op = this.getOrdinalPosition(tempCurrentScore);
            if (elementArray[scorerID[0]][scorerID[1]].opValue !== 0) {
                document.getElementById('scorerValue' + scorerID[0] + '_' + scorerID[1]).innerHTML = op;
            }
            else {
                document.getElementById('scorerValue' + scorerID[0] + '_' + scorerID[1]).innerHTML = '';
            }
            this.updateTotalScorer(scorerID[[1]]);
            var chartObject = doughnutArray[scorerID[1]].doughnutObject;
            var segmentAdjust = buttonArray[scorerID[0]].buttonUpdateID;
            var segment1 = (parseInt(segmentAdjust) * 2);
            var segment2 = segment1 + 1;

            var scorerValue = elementArray[scorerID[0]][scorerID[1]].totalValue / 10;
            var buttonValue = (buttonArray[scorerID[0]].buttonValue * 10) - scorerValue;

            chartObject.segments[segment1].value = buttonValue;
            chartObject.segments[segment2].value = scorerValue;
            chartObject.update();
            this.updateChartPositions();


        },
        updateTotalScorer: function (labelNumber) {
            // then update the total value
            var scorerTotal = 0;
            var weightTotal = 0;
            var verticleNumber = 0;
            for (var rowNumber = 0; rowNumber < this.numberOfButtons; rowNumber++) {
                if (!buttonArray[rowNumber].disabledBool) {
                    scorerTotal = scorerTotal + elementArray[rowNumber][labelNumber].totalValue;
                    weightTotal += buttonArray[rowNumber].buttonValue;
                }
            }
            var chartTotalHTML = Math.round(100 * (scorerTotal / (weightTotal * 100)));
            doughnutArray[labelNumber].totalScore = chartTotalHTML;
            document.getElementById('sliderTotal' + labelNumber).innerHTML = chartTotalHTML;
            document.getElementById('sliderTotalSmall' + labelNumber).innerHTML = chartTotalHTML;
        },
        setSliderYNValue: function (sliderValue, sliderID) {
            var chartNumber;
            var otherChartNumber;
            // update the slider module values each time the slider moves
            elementArray[sliderID].setValues(sliderValue, buttonArray[sliderID].buttonValue);
            if (!elementArray[sliderID].isNegetiveBool) {
                chartNumber = 1;
                otherChartNumber = 0;
            }
            else if (elementArray[sliderID].isNegetiveBool) {
                chartNumber = 0;
                otherChartNumber = 1;
            }
            var chartObject = doughnutArray[chartNumber].doughnutObject;
            var segmentAdjust = buttonArray[sliderID[0]].buttonUpdateID;
            var segment1 = (parseInt(segmentAdjust) * 2);
            var segment2 = segment1 + 1;
            var sliderValue = elementArray[sliderID].totalValue / 10;
            var buttonValue = (buttonArray[sliderID].buttonValue * 10) - sliderValue;
            chartObject.segments[segment1].value = buttonValue;
            chartObject.segments[segment2].value = sliderValue;
            chartObject.update();
            var otherChartObject = doughnutArray[otherChartNumber].doughnutObject;
            var otherSliderValue = 0;
            var otherButtonValue = (buttonArray[sliderID].buttonValue * 10) - otherSliderValue;
            otherChartObject.segments[segment1].value = otherButtonValue;
            otherChartObject.segments[segment2].value = otherSliderValue;
            otherChartObject.update();
            this.updateTotalYN();

        },
        setButtonValueYN: function (buttonID) {
            var button = buttonArray[buttonID];
            button.setButtonValue();
            var buttonValue = buttonArray[buttonID].buttonValue;
            // update the total value for the slider
            for (var i = 0; i < this.numberOfElements; i++) {
                elementArray[buttonID].setValues('', buttonValue);
            }
            if (buttonArray[buttonID].buttonValue === 1) {
                $('#moduleButton' + buttonID).children().removeClass('overlayDiv' + 5);
            }
            else { $('#moduleButton' + buttonID).children().removeClass('overlayDiv' + (buttonArray[buttonID].buttonValue - 1)); }
            $('#moduleButton' + buttonID).children().addClass('overlayDiv' + buttonArray[buttonID].buttonValue);
            // this update the total value
            this.updateButtonValueYN(buttonID);
        },
        updateButtonValueYN: function (buttonNumber) {
            var updateDoughnut = false;
            var sliderNumber = buttonNumber;
            var sliderValue;
            var chartNumber;
            for (var chartNumber = 0; chartNumber < this.numberOfCharts; chartNumber++) {
                sliderValue = 0;
                if (buttonArray[buttonNumber].buttonUpdateID !== null) {
                    var segmentAdjust = buttonArray[buttonNumber].buttonUpdateID;
                    var segment1 = (parseInt(segmentAdjust) * 2);
                    var segment2 = segment1 + 1;
                    var chartObject = doughnutArray[chartNumber].doughnutObject;

                    if (elementArray[sliderNumber].isNegetiveBool && chartNumber == 0) {
                        sliderValue = elementArray[sliderNumber].totalValue / 10;
                    }
                    if (!elementArray[sliderNumber].isNegetiveBool && chartNumber == 1) {
                        sliderValue = elementArray[sliderNumber].totalValue / 10;
                    }


                    var buttonValue = (buttonArray[buttonNumber].buttonValue * 10) - sliderValue;
                    chartObject.segments[segment1].value = buttonValue;
                    chartObject.segments[segment2].value = sliderValue;
                    chartObject.update();
                    this.updateTotalYN();
                    // }
                }
                else {
                    this.updateTotalYN();
                }
            this.updateChartPositions();
        }
        },
        updateTotalYN: function () {
            // then update the total value
            var sliderTotal = 0;
            var weightTotal = 0;
            var verticleNumber = 0;
            var chartNumber;
            //if (elementArray[sliderNumber].isNegetiveBool && chartNumber == 0) {
            //    sliderTotal = elementArray[sliderNumber].totalValue;
            //}
            //else {
            //    sliderTotal = 0;
            //}
            //if (!elementArray[sliderNumber].isNegetiveBool && chartNumber == 1) {
            //    sliderTotal = elementArray[sliderNumber].totalValue;
            //}

            
            for (var chartNumber = 0; chartNumber < this.numberOfCharts; chartNumber ++) {
                sliderTotal = 0;
                weightTotal = 0;
                for (var rowNumber = 0; rowNumber < this.numberOfButtons; rowNumber++) {
                    if (!buttonArray[rowNumber].disabledBool) {
                        if(elementArray[rowNumber].isNegetiveBool && chartNumber == 0) {
                            sliderTotal = sliderTotal + elementArray[rowNumber].totalValue;
                        }
                        if(!elementArray[rowNumber].isNegetiveBool && chartNumber == 1) {
                            sliderTotal = sliderTotal + elementArray[rowNumber].totalValue;
                        }
                        weightTotal += buttonArray[rowNumber].buttonValue;
                    }
                }
                var chartTotalHTML = Math.round(100 * (sliderTotal / (weightTotal * 100)));
                doughnutArray[chartNumber].totalScore = chartTotalHTML;
                document.getElementById('sliderTotal' + chartNumber).innerHTML = chartTotalHTML;
                document.getElementById('sliderTotalSmall' + chartNumber).innerHTML = chartTotalHTML;
            }
        }
    };
});
