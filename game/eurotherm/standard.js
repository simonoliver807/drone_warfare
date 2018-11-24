"use strict";
function logout(){
	$.ajax({
		type: "POST",
		url: URL_TO_ROOT + "ajax/user/logout.php",
		data: {},
		success: function(data){
			//console.log(data);
			location.reload();
		}
	});
}
// $(document).ajaxComplete(function() {
// 	doSomeLoading();
// });
// $(function() {
// 	doSomeLoading();
// });
// function doSomeLoading(){
// 	$('.datepicker').datepicker({
// 		onSelect: function(date) {},
// 		dateFormat: 'dd/mm/yy'
// 	});;
// }
var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};
function prepHeaderCodeGroups(cla){
	$.ajax({
		type: "POST",
		url: URL_TO_ROOT + "ajax/getCodes.php",
		data: {
			'type':cla
		},
		success: function(data){
			var json=JSON.parse(data);
			$('#'+cla).each(function() {
				var val=$(this).val()
				var data='';

				json.forEach(function(ele){
					if( parseInt(ele.text) < 10 ) {
						ele.text = '0' + ele.text;
					}
					var option='<li class="custom_link_one"><a onClick="filterData(\'' + cla + '\',\'' + ele.value + '\')">' + ele.text + '</a></li>';
					data += option;
				});
				$(this).html(data);
			});
		}
	});
}
function prepCodeGroups(cla){

	console.log(cla);

	$.ajax({
		type: "POST",
		url: URL_TO_ROOT + "ajax/getCodes.php",
		data: {
			'type':cla
		},
		success: function(data){
			var json=JSON.parse(data);
			$('.'+cla).each(function() {
				$(this).hide();
				var val=$(this).val()
				var select=$('<select>').addClass('form-control');
				if($(this).attr('data-active')!='true'){
					var df = $(this).attr('data-field');
					select.attr('data-field', $(this).attr('data-field')).addClass('inactive');
					if ( df == 'includeExcludeforFFRPRR' ){
						select.addClass('width85');
					}
				}
				var option=$('<option>').val('').text('').attr('disabled',true).attr('selected',true);
				select.append(option);
				if($(this).attr('data-nonModifiable')!='true'){
					select.addClass('modifiable');
				}


				var aid = $(this).attr('id');
				if( aid != 'inputbulkProductOwner' && aid != 'inputbulkManufactureInput' && aid != 'inputbulkCodeSNEntryError' && aid != 'inputbulkIncludeExcludeforFFRPRR') {
					if ( aid == 'bulkProductOwner' || aid == 'bulkManufactureInput' || aid == 'bulkCodeSNEntryError' || aid == 'bulkIncludeExcludeforFFRPRR' ){
						$(this).attr('id', 'input' + aid)
						select.attr('id',aid);
					}
					else {
						select.attr('id',$(this).attr('id'));
						$(this).removeAttr('id');
					}

					//select.attr('id',$(this).attr('id'));
					//$(this).removeAttr('id');
					if($(this).attr('data-dependant') !== undefined){
						$(this).parent().attr('onClick','loadCodes(this);');
						select.attr('data-dependant', $(this).attr('data-dependant'));
					}else{

					}
					json.forEach(function(ele){
						var option=$('<option>').val(ele.value).text(ele.text);
						if(val==ele.value){
							option.attr('selected',true);
						}
						select.append(option);
					});
					$(this).parent().append(select);
				}
			});
			processFields();
		}
	});
}
function loadCodes(ele){
	if($(ele).length>0){
		var v=$(ele).find('select').val();

		var a = $(ele).find('select').attr('data-field');
		var b = $(ele).closest('tr').find('td select[data-field=\'' + $(ele).find('select').attr('data-dependant') + '\']').val();
		var c = $(ele).find('select').attr('data-dependant');

		$.ajax({
			type: "POST",
			//url: URL_TO_ROOT + "ajax/getFilteredCodes.php",
			url: URL_TO_ROOT + "ajax/getCodes.php",
			data: {
				'type':$(ele).find('select').attr('data-field')
				, 'val':$(ele).closest('tr').find('td select[data-field=\'' + $(ele).find('select').attr('data-dependant') + '\']').val()
				, 'col':$(ele).find('select').attr('data-dependant')
			},
			success: function(data){
				//console.log($(ele));
				var json=JSON.parse(data);
				//console.log(json);
				var sel=$(ele).find('select');
				sel.html('');
				var option=$('<option>').val('').text('').attr('disabled',true).attr('selected',true);
				sel.append(option);
				json.forEach(function(fo){
					var option=$('<option>').val(fo.value).text(fo.text);
					if(fo.value==v){
						option.attr('selected',true);
					}
					sel.append(option);
				});
				//console.log($(sel).attr('data-field'));
				//console.log($(ele).closest('tr').find("select[data-dependant='" + $(sel).attr('data-field') + "']").parent());
				loadCodes($(ele).closest('tr').find("select[data-dependant='" + $(sel).attr('data-field') + "']").parent());
			}
		});
	}
}
function processFields(){
	$('.modifiable').addClass('inactive');
	$('.modifiable:not([type="checkbox"])').addClass('form-control');
	$('.modifiable').on('blur',function(){
		$(this).addClass('inactive');
		fieldChanged($(this).attr('data-field'), $(this).closest('tr').attr('data-id') , this);
	});
	$('.modifiable').on('focus',function(){
		$(this).removeClass('inactive');
	});
	$('.modifiable').on('change',function(){
		fieldChanged($(this).attr('data-field'), $(this).closest('tr').attr('data-id') , this);
		loadCodes($(this).closest('tr').find("select[data-dependant='" + $(this).attr('data-field') + "']").parent());
	});
}
function addFocus( el ) {
	el.className = 'form-control text-center';
}
function removeFocus( el ) {
	el.className = 'form-control text-center inactive';
}
function getElementValue(element){
	if($(element).attr('type')=='checkbox'){
		if($(element).is(':checked')){
			return 1;
		}else{
			return 0;
		}
	}else{
		return $(element).val();
	}
}
function showChangePasswordModal(){
	$('#cpCurrentPassword').val('');
	$('#cpNewPassword').val('');
	$('#cpReNewPassword').val('');
	$('#changePasswordModal').modal('show');
}
function changePassword(){
	if($('#cpNewPassword').val()!=$('#cpReNewPassword').val()){
		alert('The two passwords you entered do not match');
		return false;
	}
	$.ajax({
		type: "POST",
		url: URL_TO_ROOT + "ajax/user/changePassword.php",
		data: {
			'newPassword':$('#cpNewPassword').val()
			, 'currentPassword':$('#cpCurrentPassword').val()
		},
		success: function(data){
			var json=JSON.parse(data);
			if(json.result){
				$('#changePasswordModal').modal('hide');
				alert('Your password has been changed');
			}else{
				alert(json.message);
			}
		}
	});
}

function filterData(fieldname,fieldvalue){
	getData(fieldname,fieldvalue);
}
$(document).ready(function() {
	$('.tooltips').tooltipster();
});


function loadCharts( productLine, products, targets, chartCount, width, chartArea, chartArea1, title, modal, thisHeight, view, retDppmTitle, sameYear, startDate ) {


		$('#chart_div'+chartCount+'a').children().css( "z-index", "1" );
		var chartData1 = [];
		var ytdAct = 0;
		var dateRange = 0;

		// if ( products[ products.length -1 ].yymm.slice( 0, 4 ) == thisYear )
		if ( sameYear ){
			for( var i = 0; i < products.length; i++ ){
				if ( products[i].yymm.slice( 0, 4 ) == sameYear ) {
					chartData1.push([ products[i].yymm.slice( 0, 7 ), null , products[i].product_value ]);
					ytdAct += products[i].product_value;
				}
			}
		}
		else{
			for( var i = 0; i < products.length; i++ ) {
				if( products[i].yymm == startDate ){
					dateRange = i;
				}
			}
			for( var i = dateRange; i < products.length; i++ ){
				chartData1.push([ products[i].yymm.slice( 0, 7 ), null , products[i].product_value ]);
				ytdAct += products[i].product_value;
			}
		}
		var numMonths = chartData1.length;
		if ( chartData1.length < 12) {
			var i = chartData1.length;
			var aYear = chartData1[ chartData1.length -1 ][0].substring( 0, 4 )
			while ( i < 12 ) {
				var d = ( i < 9 ? '0'+(i + 1) : ( i + 1 ) );
				chartData1.push([ aYear + '-' + d, null, null ]);
				i++;
			}

		}
		// if ( products[ products.length -1 ].yymm.slice( 0, 4 ) == thisYear ) {
		if( sameYear ){
			var count = 0;
			for( var i = 0; i < products.length; i++ ){
				if ( products[i].yymm.slice( 0, 4 ) == ( sameYear - 1 ) ) {
					if( view != 'dynamic' ){
						chartData1[count][1] = products[i].product_value;
					}
					else {
						chartData1[count][1] = null;	
					}
					count ++;
				}
			}
		}
		else {
			var startYear = startDate.substring( 0, 4 );
			var endYear = products[ products.length - 1 ].yymm.substring( 0, 4 );
			// var yearDiff = (endYear - startYear);
			// startYear = startYear - yearDiff;
			startYear = startYear - 1;
			startYear = startYear + '-' + startDate.substring( 5, 10);
			var count = 0;
			var s = 0;
			for( var i = 0; i < products.length; i++ ){
				if( startYear == products[i].yymm ){
					s = 1;
				}
				// if( startDate == products[i].yymm || count == chartData1.length ){
				if( count == chartData1.length ){
					break;
				}
				if( s ){
					if( view != 'dynamic' ){
						chartData1[count][1] = products[i].product_value;
					}
					else {
						chartData1[count][1] = null;	
					}
					count ++;
				}
			}
		}
		if ( modal ){
			chartArea = { top: 5, height: '50%', left: 120};
			if( view == 'dynamic' || !sameYear ){
				width = [ 870, 0 ];
			}
		}


		var chartData = new google.visualization.DataTable();
		chartData.addColumn('string', 'Month');
		chartData.addColumn('number', ( sameYear - 1 ) + ' Returns');
		chartData.addColumn('number', 'Returns');

		chartData.addRows( chartData1 );

		var tempRetDppmTitle;
		retDppmTitle == 'Returns' ? tempRetDppmTitle = 'Returns (Qty)' : tempRetDppmTitle = retDppmTitle;

		var options = {

			chartArea: chartArea,

			colors:['#4975AA','#00B050','#C6D9F1'],
			curveType: 'function',
			legend : 'none',
			height: thisHeight,
			hAxis: { 
				slantedText:true, 
				slantedTextAngle:90,
				textStyle : {
					fontSize: 9,
				}

			},
			seriesType: 'line', 
			series: { 0: {targetAxisIndex: 0, lineDashStyle: [4, 1] },
					1: {targetAxisIndex: 0, type: 'bars'}
			},
			title: '',
			titleTextStyle: {
		        fontSize: 14,
		        bold: 'true'
		    },
			vAxes:  {
				  0: { textStyle: { fontSize: 9 },textPosition: 'left',title: 'Monthly ' + tempRetDppmTitle, gridlines: { color: 'transparent' }, minValue: 0, viewWindow: { min: 0 } }
			},
			// width: 270
			width: width[0]
		};


		if ( modal ) {
			var chartdiv1 = document.getElementById('chart_divModa');
			$('#perModHead').text(title);
			$('.legendContainerModal').css({'display':'block'});
			document.getElementById('lcm').innerHTML = '';
			//var x = $('.legendContainerModal').children().length;
			//if ( !x ) {
				if( view != 'dynamic' && sameYear ){
					var rgBoxClasses = document.getElementById('rgBox' + chartCount).classList.toString();
					var thisLegend =    '<div class="greenBox pull-left"></div><div class="pull-left">Returns ' + sameYear + '</div>' +
										'<div class="darkBlueBox pull-left"></div><div class="pull-left">' + (sameYear - 1) + ' YTD</div>' +
										'<div class="lightBlueBox pull-left"></div><div class="pull-left">' + sameYear + ' Target (YTD)</div>' +
										'<div class="' + rgBoxClasses + '"></div><div class="pull-left">' + sameYear + ' Actual (YTD)</div>' +
										'<div class="blueDotted pull-left"></div><div class="pull-left">Returns ' + (sameYear - 1) + '</div>';
					$('.legendContainerModal').css({'left': 235 });
				}
				else {
					var thisLegend = '<div class="greenBoxDynamic pull-left"></div><div class="pull-left">Returns ' + thisYear + '</div>';
					$('.legendContainerModal').css({'left': 255 });
				}
				$('.legendContainerModal').append( thisLegend );
			//}
		}
		else {
			var chartdiv1 = document.getElementById('chart_div' + view + chartCount + 'a');
			$('#chartHead' + view + chartCount ).text( title );
		}
		var chart = new google.visualization.ComboChart( chartdiv1 );
		chart.draw( chartData, options);

		//var el = document.getElementById('chart_div' + chartCount + 'apng');
		if ( modal ) {
			loadPNG( document.getElementById('chart_div' + chartCount + 'apng'), options, chartData, 'combo' );
		}

		////////////////////////////
		//////////// second chart
		if( view != 'dynamic' && sameYear) {
			var targetObj = {};
			if ( productLine == 'Global' ) {
				for ( var i = 0; i < targets.length; i++) {
					var thisDate = targets[i].date.slice(0,4)
					if ( typeof targetObj[ 'Global' + thisDate] == 'undefined' ){
						targetObj[ 'Global' + thisDate] = 0;
					}
					targetObj[ 'Global' + thisDate] += targets[i].val;
				}
			}
			else {
				for ( var i = 0; i < targets.length; i++) {
					var thisDate = targets[i].date.slice(0,4)
					targetObj[ targets[i].product_id.replace(/\s/g, "") + thisDate] = {};
					targetObj[ targets[i].product_id.replace(/\s/g, "") + thisDate] = targets[i].val;
				}
			}

			var chartData = new google.visualization.DataTable();
			chartData.addColumn('string', 'Month');
			chartData.addColumn('number', '');
			chartData.addColumn('number', 'YTD Returns');
			chartData.addColumn({type:'string', role:'style'});

			var lastYear = sameYear - 1;
			if( retDppmTitle == 'DPPM' || retDppmTitle == 'Dynamic'){
				var ytdLastYear = Math.round( parseInt( targetObj[productLine + lastYear] ) / numMonths );
				var ytdThisYear = Math.round( parseInt( targetObj[productLine + sameYear] ) / numMonths );
				ytdAct = Math.round( ytdAct / numMonths );
			}
			else {
				var ytdLastYear = parseInt( targetObj[productLine + lastYear].toFixed() ) * numMonths;
				var ytdThisYear = parseInt( targetObj[productLine + sameYear].toFixed() ) * numMonths;
			}


			if ( ytdAct < ytdThisYear ) {

				var ytdColor = '#00B050';
				var rgBox = document.getElementById('rgBox' + view + chartCount);
				if( rgBox ){
					rgBox.className = 'greenBox pull-left';	
				} 
				
			}
			else {
				var ytdColor = '#C0504D';
			}
			chartData.addRows([
				[lastYear + ' YTD',0 , ytdLastYear,'#4F81BD'],
				[sameYear + ' Target YTD',0 , ytdThisYear,'#4BACC6'],
				[sameYear + ' Actual YTD',0 , ytdAct, ytdColor],
			]);

			if ( modal ){
				var chartArea1 = { top: 5, height: '50%', right: 120 }
			}
			// else {
			// 	// var chartArea1 = { top: 45, height: '50%', width: '30%', left: 0 }
			// 	chartArea1 = { top: 45, height: '50%', width: '50%', left: 10 }
			// }

			var options = {
				chartArea: chartArea1,
				colors:[ ytdColor ],
				
				title : '',
				hAxis: { 
					slantedText:true, 
					slantedTextAngle:90,
					textStyle : {
						fontSize: 9
					}
				},
				height: thisHeight,
				legend : 'none',
				seriesType: 'line', 
				series: { 0: {targetAxisIndex: 1, title: 'Monthly Returns (Qty)', visibleInLegend: false, pointSize: 0, lineWidth: 0, enableInteractivity: false, tooltip: 'none'},
						  1: {targetAxisIndex: 1, type: 'bars'}
				},
				vAxes:  {
					  0: {textPosition: 'left',title: '', ticks: 'none'},
					  1: {textStyle: { fontSize: 9 },textPosition: 'right', title: 'Monthly ' + retDppmTitle + ' (Cumulitive)', gridlines: { color: 'transparent' }}
				},
				width: width[1]

			};
			
			if ( modal ) {
				var chartdiv2 = document.getElementById('chart_divModb');
			}
			else {
				var chartdiv2 = document.getElementById('chart_div' + view + chartCount + 'b');
			}
			var chart = new google.visualization.ComboChart( chartdiv2 );
			if( chartCount == 14){
				google.visualization.events.addListener(chart, 'ready', function () {
					// the view on the dashboard page must be hidden here
					// this is because the charts on that page do not load properly
					// when loaded into a hidden div
				    document.getElementById('dppmView').classList.add( 'hideView' );

				});
			}
			chart.draw( chartData, options);
			if ( modal ) {
				loadPNG( document.getElementById('chart_div' + chartCount + 'bpng'), options, chartData, 'combo' );
			}
		}
		else {
			if ( modal ) {
				var chartdiv2 = document.getElementById('chart_divModb');
			}
			else {
				var chartdiv2 = document.getElementById('chart_div' + view + chartCount + 'b');
			}
			chartdiv2.innerHTML = '';
		}
}

function printChart( chart, chart2, currPage, rgBoxClasses, atitle ) {

	var d = new Date();
	var thisYear = d.getFullYear();
	var mywindow = window.open('', 'PRINT', 'height=800,width=1200');
	if ( atitle ) {
		var thisTitle = atitle;
	}
	else { var thisTitle = document.title; }
	if ( currPage == 'summary' ) {
	    mywindow.document.write('<html><head><title>' + document.title  + '</title>' + 
	    						'<style>' +
	    							'.legendContainer {display: block;z-index: 99; font-size: 10px; top: 980px; position: absolute; width: 100%; left: 700px;}' +
	    							'.greenBox {width: 90px;height: 35px;border-top: 35px solid #00b050!important; -webkit-print-color-adjust: exact; margin: 2px 5px 2px 8px;}' +
	    							'.redBox {width: 90px;height: 35px;border-top: 35px solid #C0504D!important; -webkit-print-color-adjust: exact;  margin: 2px 5px 2px 8px;}'+
	    							'.pull-left {float: left !important;}'+
	    							'.legendText {font: 25px Arial !important;}'+
	    							'@media print {@page {size: landscape;} }' +
	    						'</style>');
	    mywindow.document.write('</head><body >');
	    mywindow.document.write('<h1 style="padding-bottom: 50px;font:bold 30px Arial !important;">' + document.title  + '</h1>');
	    mywindow.document.write( '<div>' + chart.innerHTML + '</div>' );
	    mywindow.document.write('<div class="legendContainer">' + 
	    							'<div class="greenBox pull-left"></div><div class="pull-left legendText">OOW</div>' +
	            					'<div class="redBox pull-left"></div><div class="pull-left legendText">IW</div>' +
	          					'</div>')
	}
	if ( currPage == 'performance' ) {
	 	mywindow.document.write('<html><head><title>' + document.title  + '</title>' + 
	    						'<style>' +
	    							'.legendContainer {display: block;z-index: 99; font-size: 10px; top: 800px; position: absolute; width: 100%; left: 350px;}' +
	    							'.blueDotted {border: none;border-top: 3px dashed #4975AA;color: #fff;background-color: #fff;width: 2%;margin: 5px;}' +
	    							'.greenBox {width: 18px;height: 9px;border-top: 9px solid #00b050!important; -webkit-print-color-adjust: exact;margin: 7px 4px 0px 8px;}' +
	    							'.redBox {width: 18px;height: 9px;border-top: 9px solid #C0504D!important; -webkit-print-color-adjust: exact;margin: 7px 4px 0px 8px;}' +
	    							'.darkBlueBox {width: 18px;height: 9px;border-top: 9px solid #4F81BD!important; -webkit-print-color-adjust: exact;margin: 7px 4px 0px 8px;}' +
	    							'.lightBlueBox {width: 18px;height: 9px;border-top: 9px solid #4BACC6!important; -webkit-print-color-adjust: exact;margin: 7px 4px 0px 8px;}' +
	    							'.pull-left {float: left!important;font-size: 20px;}'+
	    						'</style>');
	    mywindow.document.write('</head><body >');
	    mywindow.document.write('<h1 style="padding-bottom: 50px;font: bold 30px Arial;">' + thisTitle  + '</h1>');
	    mywindow.document.write( '<div class="pull-left">' + chart.innerHTML + '</div>' );
	    mywindow.document.write( '<div class="pull-left" style="margin-left:80px">' + chart2.innerHTML + '</div>' );
	    mywindow.document.write('<div class="legendContainer">' + 
									'<div class="greenBox pull-left"></div><div class="pull-left">Returns ' + thisYear + '</div>' +
									'<div class="darkBlueBox pull-left"></div><div class="pull-left">' + (thisYear - 1) + ' YTD</div>' +
									'<div class="lightBlueBox pull-left"></div><div class="pull-left">' + thisYear + ' Target (YTD)</div>' +
									'<div class="' + rgBoxClasses + '"></div><div class="pull-left">' + thisYear + ' Actual (YTD)</div>' +
									'<div class="blueDotted pull-left"></div><div class="pull-left">Returns ' + (thisYear - 1) + '</div>' +
	          					'</div>')
	}
	if ( currPage == 'tracker' ) {
	    mywindow.document.write('<html><head><title>' + document.title  + '</title>' + 
	    						'<style>' +
	    							'.legendContainer {display: block;z-index: 99; font-size: 10px; top: 980px; position: absolute; width: 100%; left: 475px;}' +
	    							'.greenLine {border: none;border-top: 3px solid #00B050;color: #fff;background-color: #fff;width: 5%;margin: 5px;}' +
	    							'.yelDot {border: none;border-top: 3px dashed #F79646;color: #fff;background-color: #fff;width: 5%;margin: 5px;}' +
	    							'.redLine {border: none;border-top: 3px solid #FF0000;color: #fff;background-color: #fff;width: 5%;margin: 5px;}' +
	    							'.pull-left {float: left!important;font-size: 20px;}' +
	    						'</style>');
	    mywindow.document.write('</head><body >');
	    mywindow.document.write('<h1 style="padding-bottom: 50px">' + document.title  + '</h1>');
	    mywindow.document.write( '<div>' + chart.innerHTML + '</div>' );
	    mywindow.document.write('<div class="legendContainer">' +
									'<div class="greenLine pull-left"></div><div class="pull-left">Qty Repaired</div>' +
									'<div class="yelDot pull-left"></div><div class="pull-left">3 per. Mov. Avg. (Components)</div>' +
									'<div class="redLine pull-left"></div><div class="pull-left">Target Value</div>' +
								'</div>')
	}
	mywindow.document.write('</body></html>');
    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/

   mywindow.print();
   mywindow.close();

    return true;

}

function loadPNG ( el, options, chartData, chartType ) {

	options.hAxis.textPosition = 'bottom';
	options.hAxis.textStyle.fontSize = 20;
	if ( options.vAxes != undefined ){
		options.vAxes[0].textStyle = {};
		options.vAxes[0].textStyle['fontSize'] = 20;

		options.vAxes[0].textFontSize = 25;
	}
	else {
		options.vAxis.textStyle.fontSize = 20;
		options.vAxis.titleFontSize = 20;
	}

	options.titleTextStyle = {}
	options.titleTextStyle['fontSize'] = 30;


	var adiv = document.getElementById('adiv');
	if ( chartType == 'combo' ){
		options['height'] = 835;
		options['width'] = 650;
		options.chartArea.height = '55%';
		options.chartArea.top = 10;
		if ( el.id.match('apng') ) {
			options.vAxes[0].titleTextStyle = {};
			options.vAxes[0].titleTextStyle['fontSize'] = 20; 
			options.chartArea.width = '90%';
			options.chartArea.left = 150;
			var chart = new google.visualization.ComboChart( adiv );
		}
		else {
			options.vAxes[1].titleTextStyle = {};
			options.vAxes[1].titleTextStyle['fontSize'] = 20;
			options.vAxes[1].textStyle['fontSize'] = 20;
			options.chartArea.width = '70%';
			options.chartArea.left = 0;
		}
		var chart = new google.visualization.ComboChart( adiv );
	}
	if ( chartType == 'column' ){ 
		options['height'] = 950;
	 	options['width'] = 1800;
		options.chartArea.width = '70%';
		options.chartArea.left = 200;
		options.chartArea.height = '70%';
		options.chartArea.top = 100;
		var chart = new google.visualization.ColumnChart( adiv );
	}
	if ( chartType == 'line' ){ 
		options['height'] = 950;
	 	options['width'] = 1800;
		options.chartArea.width = '70%';
		options.chartArea.left = 200;
		options.chartArea.height = '70%';
		options.chartArea.top = 100;
		var chart = new google.visualization.LineChart( adiv );
	}

	google.visualization.events.addListener(chart, 'ready', function() {
		el.innerHTML = '<img src="' + chart.getImageURI() + '">';
	});
	chart.draw(chartData, options);

}
function getReturnsDPPMperformance( json ) {

	var products = {};
	var productsdppm = {};
	var productsDynamic = {};



	var allReturns = {};
	var allReturnsdppm = {};
	var allReturnsArr = [];
	var allReturnsArrdppm = [];
	var allReturnsArrRet = [];

	//var dppm = {};
	var dppmProd = {};
	for (var i = 0; i < json.dppmProd.length; i++) {
		dppmProd[ json.dppmProd[i].shipment_summary_date + '' + json.dppmProd[i].productLine ] = Math.round( json.dppmProd[i].qty );
	}

	for( var i = 0; i < json.products.length; i++ ){

		if ( typeof products[ json.products[i].product_id ] == "undefined" ) {
			products[ json.products[i].product_id ] = [];
			productsdppm[ json.products[i].product_id ] = [];
		}
		products[ json.products[i].product_id ].push( { 'yymm': json.products[i].yymm, 'product_value': json.products[i].product_value } );
		// var prodValdppm = json.products[i].product_value * dppmGlobal[ 'global' + json.products[i].yymm.slice(0,4) ];
		var lastYear = parseInt( json.products[i].yymm.slice(0,4) ) - 1;
		var prodValdppm = dppmProd[ lastYear + '' + json.products[i].product_id ] * json.products[i].product_value;
		productsdppm[ json.products[i].product_id ].push( { 'yymm': json.products[i].yymm, 'product_value': Math.round( prodValdppm ) } );
		if ( typeof allReturns[ json.products[i].yymm ] == "undefined" ) {
			allReturns[ json.products[i].yymm ] = { 'product_value': 0 };
			allReturnsdppm[ json.products[i].yymm ] = { 'product_value': 0 };
		}
		allReturns[ json.products[i].yymm ].product_value += json.products[i].product_value;
		// allReturnsdppm[ json.products[i].yymm ].product_value += prodValdppm;
		//allReturnsdppm[ json.products[i].yymm ].product_value += parseInt(prodValdppm.toFixed(1));


	}

	for( var i = 0; i < json.dynamics.length; i++ ){

		if ( typeof productsDynamic[ json.dynamics[i].productLine ] == "undefined" ) {
			productsDynamic[ json.dynamics[i].productLine ] = [];
		}
		var lastYear = parseInt( json.dynamics[i].shipment_summary_date.slice(0,4) ) - 1;
		var prodValDynamic = dppmProd[ lastYear + '' + json.dynamics[i].productLine ] * json.dynamics[i].shipment_summary_returns;
		productsDynamic[ json.dynamics[i].productLine ].push( { 'yymm': json.dynamics[i].shipment_summary_date, 'product_value': Math.round( prodValDynamic ) } );
	}

	for ( var yymm in allReturns ){
		allReturnsArr.push( { 'yymm': yymm, 'product_value': allReturns[yymm].product_value } );
		// json.actual_dppm is dppm calculated in the db
		allReturnsArrdppm.push( { 'yymm': yymm, 'product_value': Math.round( json.actual_dppm[ 'value'+yymm ] ) } );
		allReturnsArrRet.push( { 'yymm': yymm, 'product_value': Math.round( json.actual_ret[ 'value'+yymm ] ) } );
	}

	var dppmtargetSaveData = JSON.parse(JSON.stringify(json.targets));
	for(var i = 0; i < dppmtargetSaveData.length; i++){
		var lastYear = parseInt( dppmtargetSaveData[i].date.slice(0,4) ) - 1;
		var prodID = dppmtargetSaveData[i].product_id.replace(/ /g,'');
		dppmtargetSaveData[i].val = dppmProd[ lastYear + '' + prodID ] * dppmtargetSaveData[i].val;
		dppmtargetSaveData[i].val = Math.round( dppmtargetSaveData[i].val );
	}
	var prod_data = { 'products': products, 'productsdppm': productsdppm, 'productsDynamic': productsDynamic, 'allReturnsArr': allReturnsArr, 'allReturnsArrdppm': allReturnsArrdppm, 'allReturnsArrRet': allReturnsArrRet, 'dppmtargetSaveData': dppmtargetSaveData };
	return prod_data;
}

function getReturnsDPPMdashboard( json ) {


	var loadData = {};
	loadData['lineChart'] = [];
	loadData['global'] = [];
	loadData['PL'] = [];
	loadData['UK'] = [];
	loadData['OT'] = [];

	var loadDatadppm = {};
	loadDatadppm['global'] = [];
	loadDatadppm['PL'] = [];
	loadDatadppm['UK'] = [];
	loadDatadppm['OT'] = [];

	var dppm = {};
	for (var i = 0; i < json.dppm.length; i++) {
		dppm[json.dppm[i].new_countrycode + json.dppm[i].shipment_summary_date] = parseFloat( json.dppm[i].qty );
	}
	var dppmGlobal = {};
	for (var i = 0; i < json.dppmGlobal.length; i++) {
		dppmGlobal[ 'global' + json.dppmGlobal[i].shipment_summary_date] = 1000000/( json.dppmGlobal[i].qty/ 12 );
	}
	var products2dppm = [];
	for ( var i=0; i < json.products2.length; i++ ) {
		loadData[json.products2[i].countrycode].push([ json.products2[i].yymm.slice(2,7), json.products2[i].oow, json.products2[i].iw  ]);

		var shipYear = json.products2[i].yymm.slice(0,4) -1;
		var oowVal = json.products2[i].oow * dppm[ json.products2[i].countrycode + shipYear];
		var iwVal = json.products2[i].iw * dppm[ json.products2[i].countrycode + shipYear];
		oowVal = parseInt( oowVal.toFixed() );
		iwVal = parseInt( iwVal.toFixed() );

		loadDatadppm[ json.products2[i].countrycode ].push([ json.products2[i].yymm.slice(2,7), oowVal, iwVal ]);

		products2dppm.push( { 'id': json.products2[i].id, 'yymm': json.products2[i].yymm, 'countrycode': json.products2[i].countrycode, 'oow': oowVal, 'iw': iwVal })
	}
	var productsdppm = [];
	for ( var i=0; i < json.products.length; i++ ) {

		loadData['global'].push([ json.products[i].id.slice(2,7) , json.products[i].sumoow, json.products[i].sumiw ]); 

		var shipYear = json.products[i].id.slice(0,4) -1;
		var oowVal =Math.round( json.products[i].sumoow * dppmGlobal[ 'global' + shipYear] );
		var iwVal = Math.round( json.products[i].sumiw  * dppmGlobal[ 'global' + shipYear] );
		loadDatadppm['global'].push([ json.products[i].id.slice(2,7) , oowVal, iwVal ]); 
		productsdppm.push( { 'id': json.products[i].id, 'sumoow': oowVal, 'sumiw': iwVal });
	}
	var prod_data = { 'loadData': loadData, 'loadDatadppm': loadDatadppm, 'productsdppm': productsdppm, 'products2dppm': products2dppm };
	return prod_data;
}
function loadDropDown( thisID, jsonArr ) {

	var el = document.getElementById( thisID );
	var elList = '';
	for ( var i = 0; i < jsonArr.length; i++ ){
		var a = "filterData( '" + thisID + "', '" + jsonArr[i].value +  "' ) "; 
		elList +='<li class="custom_link_one"><a onClick="' + a + '">' + jsonArr[i].name + '</a></li>';
	}
	el.innerHTML = elList;
}
function getUrlParameter(sParam) {
	var sPageURL = decodeURIComponent(window.location.search.substring(1)),
		sURLVariables = sPageURL.split('&'),
		sParameterName,
		i;

	for (i = 0; i < sURLVariables.length; i++) {
		sParameterName = sURLVariables[i].split('=');

		if (sParameterName[0] === sParam) {
			return sParameterName[1] === undefined ? true : sParameterName[1];
		}
	}
};
function monthDiff( sd, ed ){
	var sdArr = sd.split('-');
	var sdTemp = 0;
	var num_mnth = 1;
	while( sdTemp != endDate ){
		if( sdArr[1] == 12 ){
			sdArr[1] = 1;
			sdArr[0] = parseInt(sdArr[0]) + 1;
		}
		else{
			sdArr[1] = parseInt(sdArr[1]) + 1;
		}				
		num_mnth += 1;
		sdArr[1] = ('0' + sdArr[1]).slice(-2) 
		sdTemp = sdArr[0] + '-' + sdArr[1] + '-' + sdArr[2];

	}
	return num_mnth;
}

/* ACCORDION */
$(function() {
    $( ".accordion" ).accordion({
        collapsible: true,
        heightStyle: "content"
    });
}); 