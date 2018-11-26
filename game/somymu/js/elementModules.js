var SliderModule = (function () {
    var sliderValue;
    var totalValue;
    var sliderID;
    var disabledBool;
    var tooltipBool;
   // var setSliderValue;
    return {
        setSliderID: function (sliderID) {
            this.sliderValue = 0;
            this.totalValue = 0;
            this.sliderID = sliderID;
            this.disabledBool = false;
            this.tooltipBool = false;
           // this.overscrollStatus = false;
        },
        setValues: function (sliderValue, buttonValue) {
            if (sliderValue !== '') {
                this.sliderValue = sliderValue - 1;
                //  update the tooltip
                var position = $('#' + this.sliderID).offset();
                $('#tooltipValue'+this.sliderID).text(this.sliderValue);
                document.getElementById('sliderBackground' + this.sliderID).style.width = this.sliderValue + '%';
            }
            this.totalValue = buttonValue * this.sliderValue;
        }
    };
});
var SliderModuleYN = (function () {
    var sliderValue;
    var totalValue;
    var sliderID;
    var disabledBool;
    var tooltipBool;
    var isNegetiveBool;
   // var setSliderValue;
    
    return {
        setSliderID: function (sliderID) {
            this.sliderValue = 0;
            this.totalValue = 0;
            this.sliderID = sliderID;
            this.disabledBool = false;
            this.tooltipBool = false;
            this.isNegetiveBool = false;
           // this.overscrollStatus = false;
        },
        setValues: function (sliderValue, buttonValue) {
            if (sliderValue !== '') {
            	if(sliderValue < 0){
            		this.isNegetiveBool = true;
            	}
            	else {
            		this.isNegetiveBool = false;
            	}
                this.sliderValue = sliderValue - 1;
                this.sliderValue = Math.abs(this.sliderValue);
                //  update the tooltip
                $('#tooltipValue' + this.sliderID).text(Math.abs(this.sliderValue));
                var setSliderBackground = this.sliderValue / 2; 
                if (this.isNegetiveBool) {
                    document.getElementById('sliderBackground1' + this.sliderID).style.width = (50 - setSliderBackground) + '%';
                    document.getElementById('sliderBackground2' + this.sliderID).style.width = setSliderBackground + '%';
                    document.getElementById('sliderBackground3' + this.sliderID).style.width = '0%';
                    document.getElementById('sliderBackground4' + this.sliderID).style.width = '50%';
                }
                else {
                    document.getElementById('sliderBackground1' + this.sliderID).style.width = '50%';
                    document.getElementById('sliderBackground2' + this.sliderID).style.width = '0%';
                    document.getElementById('sliderBackground3' + this.sliderID).style.width = setSliderBackground + '%';
                    document.getElementById('sliderBackground4' + this.sliderID).style.width = (50 - setSliderBackground) + '%';
                } 
            }
            this.totalValue = buttonValue * this.sliderValue;
        }
    };
});
var ScorerModule = (function () {
    var opValue;
    var totalValue;
    var scorerID;
    var disabledBool;
    var tooltipBool;
    var timesValue;
    //var setscorerValue;
    return {
        setscorerID: function (scorerID, numberOfElements) {
            this.opValue = 0;
            this.totalValue = 0;
            this.scorerID = scorerID;
            this.disabledBool = false;
            this.tooltipBool = false;
            this.overscrollStatus = false;
            this.setScorerValue = 0;
            this.timesValue = 100 / numberOfElements;
        },
        setValues: function (scorerValue, buttonValue) {
            this.setScorerValue = this.setScorerValue * this.timesValue;
            this.totalValue = buttonValue * this.setScorerValue;
        }
    };
});