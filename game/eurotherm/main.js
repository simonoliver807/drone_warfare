
	"use strict";
	// var conPan = document.getElementById('controlPanel'); 
	// var cpWidth = conPan.offsetWidth;
	// conPan.style.right = '-' + cpWidth + 'px';
	google.charts.load('current', {'packages':['corechart']});
	// google.charts.setOnLoadCallback(reloadOfferDropDowns);
	google.charts.setOnLoadCallback(drawStacked);
	var firstLoad = 1;
	var retDate = [];	
	var svdData;
	var currLv2;
	var disableClick = 0;
	var mthArray=['0', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	var paretoMth = '';
	var max_date = [];
	// $(function() {
	// 	reloadOfferDropDowns();
	// });
	
	
	function drawStacked( ) {

		var rangeFromDate  = $('#rangeFromDate').val();
		var rangeToDate    = $('#rangeToDate').val();
		var offerLine      = $('#offerLine').val();
		var offerGroup     = $('#offerGroup').val();
		var offer          = $('#offer').val();
		var paretoDate1    = $('#paretoAnalysisFromDate').val() + '-00';
		var paretoDate2    = $('#paretoAnalysisToDate').val() + '-00';
		var checkBox 	   = {};
		var allData		   = 0;
		if ( offerLine == '' && offerGroup == '' && offer == '' ){
			allData = 1;
		}
		else {
			allData = 0;
		}
		if ( firstLoad ) {

			//$('#paretoChkd').prop('checked', false);
			$('#res').val('monthly');

			// var rangeFromDate  = '';
			// var rangeToDate    = '';
			// var offerLine      = 2;
			// var offerGroup     = '3';
			// var offer          = '3216';
			// var paretoDate1    =  '2015-10-00';
			// var paretoDate2    =  '2018-03-00';
		}
		if ( yellWarn === undefined ) {
			$('#retChart0').html('');
			$('#retChart1').html('');
			$('#retChart2').html('');
		}
		checkBox['yellWarn'] 		= document.getElementById('yellWarn').checked;
		checkBox['shipChkd'] 		= document.getElementById('shipChkd').checked;
		checkBox['retChkd'] 		= document.getElementById('retChkd').checked;
		checkBox['mtbfChkd'] 		= document.getElementById('mtbfChkd').checked;
		checkBox['ffrChkd'] 		= document.getElementById('ffrChkd').checked;
		checkBox['oobChkd'] 		= document.getElementById('oobChkd').checked;
		checkBox['warrantyChkd']	= document.getElementById('warrantyChkd').checked;
		checkBox['paretoChkd']		= document.getElementById('paretoChkd').checked;

		
		if( ( rangeFromDate == '' || rangeToDate == '' ) && !firstLoad ) {
			alert('Please Enter Date Range For All Values')
		}

		if( ( rangeFromDate != '' && rangeToDate != '' ) || firstLoad ) {
			
			// $.ajax({
			// 	type: "POST",
			// 	url: "<?php echo URL_TO_ROOT; ?>ajax/getOffer_health.php",
			// 	data: {
			// 		'offerLine': offerLine,
			// 		'offerGroup': offerGroup,
			// 		'offer': offer,
			// 		'rangeFromDate': rangeFromDate,
			// 		'rangeToDate': rangeToDate,
			// 		'allData': allData
			// 	},
			// 	success: function(data){
					var data = $('#custId').val();
					var json=JSON.parse(data);
					var loadData = [];
					var qtyVal = 0;
					var shipment_summary_qty = 0;
					var shipment_summary_returns = 0;
					var mtbfTot = 0;
					var total_ship_sum_qty = 0;
					var total_returns = 0;
					var total_ship_sum_qty_3mnth = 0;
					var total_returns_3mnth = 0;
					var actualVals = { 'mtbf': 0, 'ffr': 0, 'oob': 0, 'warranty': 0 };
					retDate = [];	
					if(json.result){
						
						//TODO remove from live
						console.log(json.sql);

						if ( firstLoad ) {
							var startDate = json.shipments[ 0 ].shipment_summary_date.slice( 0, 7);
							var endDate   = json.shipments[ json.shipments.length -1 ].shipment_summary_date.slice( 0, 7);
							$('#rangeFromDate').val( startDate );
							$('#rangeToDate').val( endDate );
							$('#paretoAnalysisFromDate').val( startDate );
							$('#paretoAnalysisToDate').val( endDate );
							if( json.max_date ) {
								var thisDate = json.max_date.split('-');
								for( var i = 0; i < 3; i++ ){
									thisDate[1] = parseInt(thisDate[1]);
									if( thisDate[1] == 0 ){
										thisDate[0] -= 1;
										thisDate[1] = 12;
									}
									if( thisDate[1] < 10 ){ thisDate[1] = '0' + thisDate[1]; }
									max_date.push( thisDate[0] + '-' + thisDate[1] + '-' + thisDate[2] );
									thisDate[1] -= 1;

								}

							}
							// $('#offerLine').val( 2 );
							// $('#offerGroup').val( 3 );
							// $('#offer').val( 3216 );
						}

						for ( var valProd in json.product_mfow[0] )  {
							var typeVal = valProd.split('_');
							if( json.product_mfow[0][valProd] != 0 && typeVal[ typeVal.length - 1 ].toLowerCase() == 'mtbf' ){
								var product_mtbf = parseInt( json.product_mfow[0][valProd] );
								break;
							}
						}
						var tenPermtbf = product_mtbf;
						tenPermtbf += product_mtbf * 0.1;
						var maxVal = Math.max.apply(Math, json.shipments.map(function(o) { return o.shipment_summary_qty; }))
						for (var i = 0; i < json.shipments.length; i++) {
							var thisColor = '';

							shipment_summary_qty = parseInt(json.shipments[i].shipment_summary_qty);
							shipment_summary_returns = parseInt(json.shipments[i].shipment_summary_returns);
							// qtyVal = shipment_summary_qty - shipment_summary_returns;

							total_ship_sum_qty += shipment_summary_qty;
							total_returns += shipment_summary_returns;


							//var d = new Date();
							// b4 live change to today date TODO
							var d1 = new Date('2018-03-01');
							d1.setMonth(d1.getMonth() - 3);
							var ship_date = json.shipments[i].shipment_summary_date.replace('00','01');
							ship_date = new Date( ship_date );
							if ( ship_date > d1 ){
								total_ship_sum_qty_3mnth += shipment_summary_qty;
								total_returns_3mnth += shipment_summary_returns;
							}


							if( checkBox['shipChkd'] ) {
								if ( maxVal >= 10000 ){ shipment_summary_returns *= 25;}
								if ( maxVal >= 3000 && maxVal < 10000 ){ shipment_summary_returns *= 20; }
								if ( maxVal >= 1500 && maxVal < 3000 ){ shipment_summary_returns *= 17; }
								if ( maxVal >= 300 && maxVal < 1500 ) { shipment_summary_returns *= 10; }
								if ( maxVal > 150 && maxVal < 300 ) { shipment_summary_returns *= 5;}
								shipment_summary_qty < shipment_summary_returns ? qtyVal = shipment_summary_returns - shipment_summary_qty : qtyVal = shipment_summary_qty - shipment_summary_returns;
							}

							

							var tempShip_summary_returns;
							json.shipments[i].shipment_summary_returns == 0 ?  tempShip_summary_returns = 1 : tempShip_summary_returns = parseInt(json.shipments[i].shipment_summary_returns);
							//var mtbfVal;
							// if( json.shipments[i].shipment_summary_date != max_date ){
							// 	checkBox['mtbfChkd'] ? mtbfVal = Math.round( ( parseInt( json.shipments[i].shipment_summary_days_live ) / tempShip_summary_returns) * 24 ) : mtbfVal = null;
							// }
							// else { 
							// 	mtbfVal = null; }
							var ffrVal;
							checkBox['ffrChkd'] ? ffrVal = Math.round( ( parseInt(json.shipments[i].shipment_summary_returns) / shipment_summary_qty ) * 1000000 ): ffrVal = null;
							var warrantyVal;
							checkBox['warrantyChkd'] ? warrantyVal = parseFloat( json.shipments[i].shipment_warranty_returns ) : warrantyVal = null;
							var oobVal;
							checkBox['oobChkd'] ? oobVal = parseInt( json.shipments[i].shipment_oob_returns ) : oobVal = null;



							var mtbfVal = Math.round( ( parseInt( json.shipments[i].shipment_summary_days_live ) / tempShip_summary_returns) * 24 );
							checkBox['yellWarn'] ? thisColor = 'stroke-color: #000000; stroke-width: 1; fill-color: #00B050' : thisColor = 'stroke-color: #000000; stroke-width: 1; fill-color: #DAE3F3';

							if ( mtbfVal > product_mtbf && mtbfVal <= tenPermtbf && checkBox['yellWarn'] ) {
								thisColor = 'stroke-color: #000000; stroke-width: 1; fill-color: #ED7D31'
							}
							if ( mtbfVal <= product_mtbf && checkBox['yellWarn'] ) {
								thisColor = 'stroke-color: #000000; stroke-width: 1; fill-color: #FF0000'
							}
							if ( !checkBox['retChkd'] ) { 
								shipment_summary_returns = null;
								qtyVal = shipment_summary_qty;
							}
							if ( !checkBox['shipChkd'] ) {
								qtyVal = null;
							}
							if( max_date.indexOf( json.shipments[i].shipment_summary_date ) !== -1 || !checkBox['mtbfChkd'] ){
								mtbfVal = null;
							}
							var bdate = json.shipments[i].shipment_summary_date.split("-");
							var cdate = mthArray[ parseInt( bdate[1] ) ]  + ' ' + bdate[0].slice( (bdate[0].length - 2), bdate[0].length );
							loadData.push([ cdate, shipment_summary_returns,'stroke-color: #000000; stroke-width: 1; fill-color: #203864','<div style="width:90px">' + json.shipments[i].shipment_summary_date+'<br/>Returns '+ json.shipments[i].shipment_summary_returns + '</div>', qtyVal, '<div style="width:90px">'+json.shipments[i].shipment_summary_date+'<br/>Qty '+json.shipments[i].shipment_summary_qty + '</div>', thisColor, mtbfVal, ffrVal, oobVal, warrantyVal ]);

							if( json.shipments[i].shipment_summary_returns > 0 ){
								retDate.push( cdate );
							}					
						}
						var title = $('#offerLine').find(":selected").text();
						// title1 = title1.split('-');
						var title2 = $('#offerGroup').find(":selected").text();
						var title3 = $('#offer').find(":selected").text();
						title2 != 'Please select' ? title2 = ', ' + title2 : title2 = '';
						title3 != 'Please select' ? title3 = ', ' + title3 : title3 = '';
						// var title = title1[0] + title2 + title3;
						var title = title + title2 + title3;
						if ( checkBox['mtbfChkd'] ){
							var thisVaxis = { 0: {textStyle: { fontSize: 14 },textPosition: 'left',title: 'Quantity (Unity)', gridlines: { color: '#BEC3AF' }},
				  						      1: {textStyle: { fontSize: 14 },textPosition: 'out',title: 'ffr, oob, warranty and mtbf', gridlines: { color: 'transparent' },minValue: 0, viewWindow: { min: 0 }},
				  						      2: {textStyle: { fontSize: 14 },textPosition: 'in',title: '', gridlines: { color: 'transparent' },minValue: 0, viewWindow: { min: 0 }}
										}
							var thisSeries = { 
										  	  0: {type: 'bars'},
											  1: {type: 'bars'},
											  2: {targetAxisIndex: 1, type: 'line', color: '#7030A0'},
											  3: {targetAxisIndex: 2, type: 'line', color: '#7F7F7F'},
											  4: {targetAxisIndex: 2, type: 'line', color: '#C00000'},
											  5: {targetAxisIndex: 2, type: 'line', color: '#FFD966'}
										  }
						}
						else {
							var thisVaxis = { 0: {textStyle: { fontSize: 14 },textPosition: 'left',title: 'Quantity (Unity)', gridlines: { color: '#BEC3AF' }},
				  						      1: {textStyle: { fontSize: 14 },textPosition: 'out',title: 'ffr, oob, warranty', gridlines: { color: 'transparent' },minValue: 0, viewWindow: { min: 0 }}
										}
							var thisSeries = { 
										  	  0: {type: 'bars'},
											  1: {type: 'bars'},
											  2: {targetAxisIndex: 1, type: 'line', color: '#7030A0'},
											  3: {targetAxisIndex: 1, type: 'line', color: '#7F7F7F'},
											  4: {targetAxisIndex: 1, type: 'line', color: '#C00000'},
											  5: {targetAxisIndex: 1, type: 'line', color: '#FFD966'}
										  }
						}
						drawComboChart( loadData, title, thisVaxis, thisSeries );


						if ( json.mtbf.sum_days_live !== null && json.mtbf.sum_returns !== null ){ 
							mtbfTot = parseInt( json.mtbf.sum_days_live ) / parseInt( json.mtbf.sum_returns );
							var ufactor = parseInt($('#utilisationFactor').val()); 
							ufactor /= 100;
							var mtbfhrs = (mtbfTot * ufactor) * 24;
							actualVals['mtbf'] = mtbfhrs;
							var mtbfyrs = (mtbfTot * ufactor) / 365.25;
							$('#mtbfhrs').text( Math.round( mtbfhrs ).toLocaleString() );
							$('#mtbfyrs').text(mtbfyrs.toFixed());
						}
						else {
							$('#mtbfhrs').text(0);
							$('#mtbfyrs').text(0);
						}
						// remove
						// loadRetChart( '2013-01-00', '2016-01-00' );
						// if ( !firstLoad ){
						// 	if ( ( checkBox['paretoChkd'] || ( paretoDate1 != '-00' && paretoDate2 != '-00' && checkBox['paretoChkd'] ) ) ) {
						// 		if ( paretoDate1 == '-00' && paretoDate2 == '-00' ) {
						// 			paretoDate1 = $('#rangeFromDate').val() + '-00';
						// 			paretoDate2 = $('#rangeToDate').val() + '-00';
						// 			document.getElementById( 'paretoAnalysisFromDate' ).value = $('#rangeFromDate').val();
						// 			document.getElementById( 'paretoAnalysisToDate' ).value = $('#rangeToDate').val();
						// 		}
						// 		document.getElementById("paretoChkd").checked = true;
						// 		checkBox['paretoChkd'] = 1;
						// 		loadRetChart( paretoDate1, paretoDate2 );
						// 	}
						// 	if ( !checkBox['paretoChkd'] && paretoMth != '')  {
						// 		loadRetChart( paretoMth, paretoMth );
						// 	}
						// }
						if ( checkBox['paretoChkd'] ) {
							loadRetChart( paretoDate1, paretoDate2 );
						}
						else {
							$('#retChart0').html('');
							$('#retChart1').html('');
							$('#retChart2').html('');
						}
						var mfowChartArr = [];
						actualVals['ffr'] = Math.round( ( total_returns / total_ship_sum_qty ) * 1000000 );
						actualVals['oob'] = Math.round( total_ship_sum_qty_3mnth / total_returns_3mnth );
						actualVals['warranty'] = 1000000;
					
						var mfow = '';
						// var arrPos = -2;
						var arrPos = 0



						// var colorArr = [ '#7030A0', '#FBE5D6', '#7F7F7F', '#7F7F7F', '#C00000', '#C00000', '#FFD966', '#FFD966'];  
						var colorArr = [ '#7030A0', '#7F7F7F', '#C00000', '#FFD966'];  
						for ( var valProd in json.product_mfow[0] )  {
							var thismfow = valProd.split( '_' );
							if ( mfow == '' || mfow != thismfow[ thismfow.length - 1 ] ){
								mfow = thismfow[ thismfow.length - 1 ].toLowerCase();
								 // arrPos += 2;
								var valSet = 0;

								var tenPermtbf = actualVals[ mfow ];
								tenPermtbf += actualVals[ mfow ] * 0.1;

								if ( json.product_mfow[0][ valProd ] !== 0 && !valSet ){
									// mfowChartArr[arrPos][2] = json.product_mfow[0][ valProd ] ;
									var mfowTargetVal = json.product_mfow[0][ valProd ] ;
									valSet = 1;
								}
								var thisColor = '#00B050';
								if ( mfowTargetVal > actualVals[ mfow ]  && mfowTargetVal <= tenPermtbf  ) {
									thisColor = '#ED7D31';
								}
								if ( mfowTargetVal <= actualVals[ mfow ] ) {
									thisColor = '#FF0000';
								}


								mfowChartArr.push( [ mfow.toUpperCase() + ' (Target)', 0, mfowTargetVal, 'stroke-color: #ADAAAA; stroke-width: 1; fill-color:' + colorArr[arrPos] ]);
								mfowChartArr.push( [ mfow.toUpperCase() + ' (Actual)', 0, Math.round( actualVals[ mfow ] ), 'stroke-color: #ACA8A7; stroke-width: 1; fill-color:' + thisColor ] ); 
								arrPos += 1;
							}

							// if ( json.product_mfow[0][ valProd ] !== 0 && !valSet ){
							// 	mfowChartArr[arrPos][2] = json.product_mfow[0][ valProd ] ;
							// 	valSet = 1;
							// }

						}
						drawColumnChart( mfowChartArr );

						firstLoad = 0;

						//remove
						//loadRetChart( "2016-09-00", "2016-09-00" );

					}
				}
	// 		});
	// 	}
	 }

	function extractData() {

		var rangeFromDate  = $('#rangeFromDate').val();
		var rangeToDate    = $('#rangeToDate').val();
		var offerLine      = $('#offerLine').val();
		var offerGroup     = $('#offerGroup').val();
		var offer          = $('#offer').val();
		var paretoDate1    = $('#paretoAnalysisFromDate').val() + '-00';
		var paretoDate2    = $('#paretoAnalysisToDate').val() + '-00';
		var checkBox 	   = {};
		var allData		   = 0;

		if ( offerLine == '' && offerGroup == '' && offer == '' ){
			allData = 1;
		}
		else {
			allData = 0;
		}
		
		if( ( rangeFromDate == '' || rangeToDate == '' ) ) {
			alert('Please Enter Date Range For All Values')
		}

		if( rangeFromDate != '' && rangeToDate != '' ) {
			var link=document.createElement("a");
			link.id = 'extractData_link'; 
			link.href='includes/extract_data.php?offerLine=' + offerLine + '&offerGroup=' + offerGroup + '&offer=' + offer + '&rangeFromDate=' + rangeFromDate + '&rangeToDate=' + rangeToDate + '&allData=' + allData;
			document.body.appendChild(link);
			document.getElementById('extractData_link').click();
			document.body.removeChild( document.getElementById( 'extractData_link' ) );
		}
	}
	
	function loadRetChart( adate1, adate2 ) {



		var offerLine      = $('#offerLine').val();
		var offerGroup     = $('#offerGroup').val();
		var offer          = $('#offer').val();

		// $.ajax({
		// 	type: "POST",
		// 	url: "<?php echo URL_TO_ROOT; ?>ajax/getOffer_healthRet.php",
		// 	data: {
		// 		'offerLine': offerLine,
		// 		'offerGroup': offerGroup,
		// 		'offer': offer,
		// 		'adate1': adate1,
		// 		'adate2': adate2
		// 	},
		// 	success: function(data){

				var data = $('#custId2').val();
				var json=JSON.parse(data);
				if(json.result){
					if( json.shipments.length ) {
						$('#retChart1').html();
						svdData = json.shipments;
						var prod_lvl1cc = [];
						var prod_lvl2cc = [];
						for ( var i = 0; i < svdData.length; i++ ) {
							if ( prod_lvl1cc.indexOf( svdData[i].product_level1CauseCode ) === -1 ) {
								prod_lvl1cc.push( svdData[i].product_level1CauseCode )
							}
							if ( prod_lvl2cc.indexOf( svdData[i].product_level2CauseCode ) === -1 ) {
								prod_lvl2cc.push( svdData[i].product_level2CauseCode )
							}
						}
						for ( var i = 0; i < svdData.length; i++ ) {
							if ( prod_lvl1cc.indexOf( svdData[i].product_level2CauseCode ) !== -1 ) {
								svdData[i].product_level2CauseCode += '_'
							}
							if ( prod_lvl2cc.indexOf( svdData[i].product_level3CauseCode ) !== -1 ) {
								svdData[i].product_level3CauseCode += '__'
							}

						}
						// for ( var i = 0; i < svdData.length; i++ ) {
						// 	if ( svdData[i].product_level1CauseCode == svdData[i].product_level2CauseCode ) {
						// 		svdData[i].product_level2CauseCode += '_'
						// 	}
						// }
						drawRetChart( '', '' );
					}
					else {
						$('#retChart0').html('');
						$('#retChart1').html('<div class="retChartText">No data to chart</div>');
						$('#retChart2').html('');
					}
				}

		// 	}
		// });
	}
	function getLv2Lv3( causeCode1, causeCode2, lv2 ) {
		var lvVal = {};
		for (var i = 0; i < svdData.length; i++) {
			if ( causeCode2 == '' ){
			    if ( typeof lvVal[ svdData[i][causeCode1] ] == "undefined" ) {
					lvVal[ svdData[i][ causeCode1 ] ] = { 'total': 0 };
				}
				lvVal[ svdData[i][causeCode1] ].total += 1;
			}
			if ( causeCode2 != '' ){
			    if ( typeof lvVal[ svdData[i][causeCode2] ] == "undefined" && svdData[i][causeCode1].slice(0,20) == lv2.slice(0,20)  ) {
					lvVal[ svdData[i][ causeCode2 ] ] = { 'total': 0 };
				}
				//if ( svdData[i][causeCode1] == lv2 ) {
				if ( svdData[i][causeCode1].slice(0,20) == lv2.slice(0,20) ) {
					lvVal[ svdData[i][causeCode2] ].total += 1;
				}
			}


		}
		var maxVal = 0;
		for (var val in lvVal) {
			if ( lvVal[val].total > maxVal ){
				var lv = val;
				maxVal = lvVal[val].total
			}
		}
		return lv;
	}

	function drawRetChart( lv2, lv3 ){

		var allReturns = {};
		var loadDataLv1 = [];
		var loadDataLv2 = [];
		var loadDataLv3 = [];
		var lv1Selected;
		if ( lv2 == '' ){
			lv2 = getLv2Lv3( 'product_level1CauseCode', '' );
			currLv2 = lv2;
		}
		if( lv3 == '' ) {
			lv3 = getLv2Lv3( 'product_level1CauseCode', 'product_level2CauseCode', lv2 );
		}
		for( var i = 0; i < svdData.length; i++ ){
			if( svdData[i].product_level1CauseCode != '' ) {
					if ( typeof allReturns[ svdData[i].product_level1CauseCode ] == "undefined" ) {
						allReturns[ svdData[i].product_level1CauseCode ] = { 'total': 0, 'arrPos': loadDataLv1.length };
					}
					allReturns[ svdData[i].product_level1CauseCode ].total += 1;
					loadDataLv1[ allReturns[ svdData[i].product_level1CauseCode ].arrPos ] = [ svdData[i].product_level1CauseCode, allReturns[ svdData[i].product_level1CauseCode ].total ];
			}
			if( svdData[i].product_level1CauseCode.slice(0,20) == lv2.slice(0,20) ) {
				lv2 = svdData[i].product_level1CauseCode;
				if ( typeof allReturns[ svdData[i].product_level2CauseCode ] == "undefined" ) {
					allReturns[ svdData[i].product_level2CauseCode ] = { 'total': 0, 'arrPos': loadDataLv2.length };
				}
				allReturns[ svdData[i].product_level2CauseCode ].total += 1;
				loadDataLv2[ allReturns[ svdData[i].product_level2CauseCode ].arrPos ] = [ svdData[i].product_level2CauseCode, allReturns[ svdData[i].product_level2CauseCode ].total ];
			}
			if( svdData[i].product_level2CauseCode.slice(0,20) == lv3.slice(0,20) ) {

				// if ( svdData[i].product_level3CauseCode == '' ) {

				// 	console.log('no value');

				// }

				lv3 = svdData[i].product_level2CauseCode;

				if ( typeof allReturns[ svdData[i].product_level3CauseCode ] == "undefined" ) {
					allReturns[ svdData[i].product_level3CauseCode ] = { 'total': 0, 'arrPos': loadDataLv3.length };
				}
				allReturns[ svdData[i].product_level3CauseCode ].total += 1;
				loadDataLv3[ allReturns[ svdData[i].product_level3CauseCode ].arrPos ] = [ svdData[i].product_level3CauseCode, allReturns[ svdData[i].product_level3CauseCode ].total ];
			}
		}
		var loadData = [ loadDataLv1, loadDataLv2, loadDataLv3 ];
		var titleArr = [ 'Level 1 Analysis', lv2 + ' Analysis', lv3 + ' Analysis' ]
		for (var i = 0; i < loadData.length; i++) {
			loadData[i].sort(function(a,b) {
			    return b[1]-a[1]
			});
			var sumVal = 0;
			for( var j = 0; j < loadData[i].length; j++ ){
				if( titleArr[i] == 'Level 1 Analysis'){
					loadData[i][j][0] == lv2 ? loadData[i][j].push('stroke-color: #000000; stroke-width: 1; fill-color: #C00000') : loadData[i][j].push('stroke-color: #000000; stroke-width: 1; fill-color: #203864');
				}
				if( titleArr[i] == lv2 + ' Analysis' ){
					loadData[i][j][0] == lv3 ? loadData[i][j].push('stroke-color: #000000; stroke-width: 1; fill-color: #C00000') : loadData[i][j].push('stroke-color: #000000; stroke-width: 1; fill-color: #203864');
				}
				if( titleArr[i] == lv3 + ' Analysis' ){
					j == 0 ? loadData[i][j].push('stroke-color: #000000; stroke-width: 1; fill-color: #C00000') : loadData[i][j].push('stroke-color: #000000; stroke-width: 1; fill-color: #203864');
				}
				sumVal += loadData[i][j][1];				
			}
			drawComboChartRet( loadData[i], i, titleArr[i], sumVal )
		}
		disableClick = 0;

	}

	function drawComboChart( loadData, title, thisVaxis, thisSeries ) {

		title == 'Please select' ? title = 'Eurotherm' : title = title;
		var chartData =  google.visualization.arrayToDataTable([]);
		chartData.addColumn('string', 'Month');
		chartData.addColumn('number', 'Returns');
		chartData.addColumn({type:'string', role:'style'});
		chartData.addColumn({'type': 'string', 'role': 'tooltip', 'p': {'html': true}});
		chartData.addColumn('number', 'Qty');
		chartData.addColumn({'type': 'string', 'role': 'tooltip', 'p': {'html': true}});
		chartData.addColumn({type:'string', role:'style'});
		chartData.addColumn('number', 'mtbf');
		chartData.addColumn('number', 'ffr');
		chartData.addColumn('number', 'OOB');
		chartData.addColumn('number', 'warranty');
		chartData.addRows(
			loadData
		)
		var options = {
	
		  // chartArea: {
		  // 	// left: 115,
		  //   left: 90,
		  // 	width: '85%'
		  // },
		  chartArea: {
		    left: 90,
		  	width: '75%'
		  },
		  curveType: 'function',
		  hAxis: { 
			slantedText:true, 
			slantedTextAngle:90,
			textStyle : {
				fontSize: 9,
				bold: false

			},
			textPosition: 'bottom'
		  },
		  height: 600,
		  isStacked: true,
		  legend: 'none',
		  pointSize: 5,
		  series: thisSeries,
		  titleTextStyle: {
		    fontSize: 14,
		    bold: 'true'
		  },
		  title: title,
		  tooltip: {isHtml: true},
		   vAxes: thisVaxis, 
		  // width: 900
		  width: 800

		}
		if( loadData.length === 0 ){
			options.title = "‘No Data to chart’";
			options.titleTextStyle =  { 'fontSize': 18, 'bold': 'true', 'color': '#ff0000'};
		}



		var chartContainer = document.getElementById('pcChart');
		var chart = new google.visualization.ComboChart( chartContainer );

		google.visualization.events.addListener(chart, 'ready', function () {
			var labels = chartContainer.getElementsByTagName('text');
		    Array.prototype.forEach.call(labels, function(label) {


	    	var s = new XMLSerializer();
			var labelstr = s.serializeToString(label);
			for( var i = 0; i < retDate.length; i++ ){
				if ( labelstr.match( retDate[i] ) ) {
			    	label.style.textDecoration = 'underline';
			    	label.style.cursor = 'pointer';
			    }
			}

		    // if ( retDate.indexOf( thisDate[0] ) !== -1 ) {
		    // 	label.style.textDecoration = 'underline';
		    // 	label.style.cursor = 'pointer';
		    // }
		  });
		});

		chart.draw( chartData, options);
		$('.legendContainerOfferHealth').css({'display':'block'});
	}

	function drawComboChartRet( loadData, chartDiv, title, sumVal ) {


		if ( title.match('_') ) {
			title = title.replace('_','');
		}

		var labelArr = [];
		var tmpSumVal = sumVal;
		for ( var i = 0; i < loadData.length; i++ ) {
			if ( i == 0 ) {
				var cumul = 100;
			}
			else {
				tmpSumVal -= loadData[ i-1 ][ 1 ];
				var cumul = tmpSumVal / sumVal * 100;
			}
			loadData[i].push( parseInt( cumul.toFixed() ) ); 


			if( loadData[i][0].length > 21 ){
				loadData[i][0] = loadData[i][0].slice(0,20) +'..';
			}


			var fstWord = loadData[i][0].split(' ');
			labelArr.push( fstWord[0] );

		}

		var chartData =  google.visualization.arrayToDataTable([]);
		chartData.addColumn('string', 'product');
		chartData.addColumn('number', 'Returns');
		chartData.addColumn({type:'string', role:'style'});
		chartData.addColumn('number', 'Cumulitive');
		chartData.addRows(
			loadData
		)
		var options = {

			chartArea: {
				top: 40,
			  	height: '50%' 
		   },	
		  colors:[ '#203864' ],
		  curveType: 'function',
		  hAxis: { 
				slantedText:true, 
				slantedTextAngle:90,
				textStyle : {
					fontSize: 12,
				}

			},
		  height: 350,
		  isStacked: true,
		  legend: 'none',
		  series: { 
		  	  0: {targetAxisIndex: 0, type: 'bars'},
			  1: {targetAxisIndex: 1, type: 'line', color: '#7030A0'}
		  },
		  titleTextStyle: {
		    fontSize: 14,
		    bold: 'true'
		  },
		  title: title,
		  vAxes:  {
				  0: {textStyle: { fontSize: 14 },textPosition: 'left',title: 'Number of Returns', titleTextStyle: { fontSize: 14}, gridlines: { color: '#BEC3AF' }},
				  1: {textStyle: { fontSize: 14 },textPosition: 'right', title: 'Cumulitive', titleTextStyle: { fontSize: 14}, gridlines: { color: 'transparent' }, minValue: 0, viewWindow: { min: 0 } }
		  },
		  width: 320

		}
		if ( loadData.length === 1) {
			options.series[1] = {targetAxisIndex: 1, type: 'line', color: 'transparent'} ;
		}

		var chartContainer = document.getElementById('retChart' + chartDiv);
		var chart = new google.visualization.ComboChart( chartContainer );

		google.visualization.events.addListener(chart, 'ready', function () {
			// modify x-axis labels
			var labels = chartContainer.getElementsByTagName('text');
			Array.prototype.forEach.call(labels, function(label) {
			//	var fstWord = label.innerHTML.split(' ');


					var s = new XMLSerializer();
					var labelstr = s.serializeToString(label);
					for( var i = 0; i < labelArr.length; i++ ){
						if ( labelstr.match( labelArr[i] ) ) {
					    	label.style.textDecoration = 'underline';
							label.style.cursor = 'pointer';
							//label.innerHTML = label.innerHTML+ '<div style="display:none">clickable</div>';
					    }
					}



					// if ( labelArr.indexOf( fstWord[0] ) !== -1 ){
					// 	label.style.textDecoration = 'underline';
					// 	label.style.cursor = 'pointer';
					// 	label.innerHTML = label.innerHTML+ '<div style="display:none">clickable</div>';
					// }
			});
		});
		chart.draw( chartData, options);
	}

	function drawColumnChart ( loadData ) {


		var chartData =  google.visualization.arrayToDataTable([]);
		chartData.addColumn('string', 'Month');
		chartData.addColumn('number', '');
		chartData.addColumn('number', 'Hours');
		chartData.addColumn({type:'string', role:'style'});
		chartData.addRows(
			loadData
		);
		var options = {

			// chartArea: {
			//   top: 115,
			//   height: '61.75%',
			//   right: 60,
			//   width: '85%'
			// },	
			chartArea: {
			  top: 115,
			  height: '61.75%',
			  right: 80,
			  width: '75%'
			},
			colors:[ '#FBE5D6', '#F4B183' ],
			hAxis: { 
				slantedText:true, 
				slantedTextAngle:90,
				textStyle : {
					fontSize: 9,
					bold: false
				}
			},
			textPosition: { position: 'bottom' },
			height: 600,
			legend: { position: 'none' },
			series: { 0: {targetAxisIndex: 1, title: '', visibleInLegend: false, pointSize: 0, lineWidth: 0, enableInteractivity: false, tooltip: 'none'},
					  1: {textStyle: { fontSize: 14 }, targetAxisIndex: 1, title: 'Hours', type: 'bars'}
			},
			vAxes:  {
				  0: {textPosition: 'none', gridlines: { color: 'transparent', count: 0 } },
				  1: {textStyle: { fontSize: 14 },textPosition: 'right', title: 'Hours', gridlines: { color: '#BEC3AF' }, minValue: 0, viewWindow: { min: 0 } }
			},
			textStyle: {
				fontSize: 9,
				bold: false
			},
			title: '',
			width: 285
		}
		var chart = new google.visualization.ColumnChart(document.getElementById('mtbfChart'));
		chart.draw(chartData, options);

	}

	function handleClickChart ( event ) {

		
		if ( event.target.tagName == 'text' && event.target.style.textDecoration == 'underline' ) {
		  	var product = event.target.textContent;
		  //	product = product[0];
		  	if( event.target.previousElementSibling ) {
		  		product = event.target.previousElementSibling.innerHTML + ' ' + product;
		  		var product1= event.target.previousElementSibling.textContent + ' ' + product;
		  	}
		  	if( event.target.nextElementSibling ) {
		  		product = product + ' ' + event.target.nextElementSibling.innerHTML;
		  		var product1 = product + ' ' + event.target.nextElementSibling.textContent;
		  	}
		  	if( event.currentTarget.id.match( 0 ) ){
		  		currLv2 = product;
		  		drawRetChart( product, '' );
		  	}
		  	if( event.currentTarget.id.match( 1 ) ){
		  		drawRetChart( currLv2, product );
		  	}
		}



		 // if ( event.target.innerHTML.match('clickable') ){
		 //  	var product = event.target.innerHTML.split('<');
		 //  	product = product[0];
		 //  	if( event.target.preventiousElementSibling ) {
		 //  		product = event.target.preventiousElementSibling.innerHTML + ' ' + product;
		 //  	}
		 //  	if( event.target.nextElementSibling ) {
		 //  		product = product + ' ' + event.target.nextElementSibling.innerHTML;
		 //  	}
		 //  	if( event.currentTarget.id.match( 0 ) ){
		 //  		currLv2 = product;
		 //  		drawRetChart( product, '' );
		 //  	}
		 //  	if( event.currentTarget.id.match( 1 ) ){
		 //  		drawRetChart( currLv2, product );
		 //  	}
		 //  }
		
	}
	function reloadOfferDropDowns( filter ){
		var offerVal = '';
		var offerGroup = '';
		var offerLine = '';
		if( filter == 'offerLine') {
			offerLine = $( '#offerLine option:selected' ).text();
		}
		if( filter == 'offerGroup' ) {
			offerGroup = $( '#offerGroup option:selected' ).text();
			offerLine = $( '#offerLine option:selected' ).text();
		}
		if( filter == 'offer' ) {
			offerVal = $('#offer').val();
			offerGroup = $( '#offerGroup option:selected' ).text();
			offerLine = $( '#offerLine option:selected' ).text();
		}
		if( offerGroup == 'Please select' ) {
			offerGroup = '';
		}
		// $.ajax({
		// 	type: "POST",
		// 	url: "<?= URL_TO_ROOT; ?>ajax/getOfferOptions.php",
		// 	data: {
		// 		'offer':offerVal,
		// 		'offerGroup':offerGroup,
		// 		'offerLine':offerLine
		// 	},
		// 	success: function(data){
		// 		var json=JSON.parse(data);
		// 		if(json.productLines){
		// 			$('#offerLine').html('');
		// 			$('#offerLine').append($('<option>').val('').text('Please select'));
		// 			json.productLines.forEach(function(element){
		// 				$('#offerLine').append($('<option>').val(element.id).text(element.name));
		// 			});					
		// 		}
		// 		if(json.productGroups){
		// 			$('#offerGroup').html('');
		// 			$('#offerGroup').append($('<option>').val('').text('Please select'));
		// 			json.productGroups.forEach(function(element){
		// 				$('#offerGroup').append($('<option>').val(element.id).text(element.name));
		// 			});					
		// 		}
		// 		if(json.products){
		// 			$('#offer').html('');
		// 			$('#offer').append($('<option>').val('').text('Please select'));
		// 			json.products.forEach(function(element){
		// 				$('#offer').append($('<option>').val(element.name).text(element.name));
		// 			});					
		// 		}
		// 		$("#offerLine option").each(function (a, b) {
		//             if ($(this).html() == json.offerLine.toUpperCase() ) { $(this).attr("selected", "selected") };
		//         });
		// 		$("#offerGroup option").each(function (a, b) {
		//             if ($(this).html() == json.offerGroup ) { $(this).attr("selected", "selected") };
		//         });
		// 		$('#offer').val(json.offer);

		// 		drawStacked();
		// 	}
		// });
	}

	$( "#retChart0" ).click(function(event) {
		 handleClickChart( event );		
	});
	$( "#retChart1" ).click(function(event) {
		 handleClickChart( event );
	});
	$( "#retChart2" ).click(function(event) {
		handleClickChart( event )
	});
	$( "#pcChart" ).click(function(event) {

		var s = new XMLSerializer();
		var labelstr = s.serializeToString( event.target );
		var mthNum = -1;
		for( var i = 1; i < mthArray.length; i++ ){
			if( labelstr.match( mthArray[i] ) ){
				mthNum = i;
				var strPos = labelstr.indexOf( mthArray[i] );
				strPos += 4;
				var thisYear = labelstr.slice(-9,-7);

				if ( parseInt(mthNum) < 10 ){
					mthNum = '0' + mthNum;
				}
				paretoMth = '20' + thisYear + '-' + mthNum + '-' + '00';
				// document.getElementById("paretoChkd").checked = false;
				var paretoChkd = document.getElementById("paretoChkd").checked;
				if( paretoChkd ) {
					$('#paretoAnalysisToDate').val( '20' + thisYear + '-' + mthNum  );
					$('#paretoAnalysisFromDate').val( '20' + thisYear + '-' + mthNum  );
					loadRetChart( paretoMth, paretoMth );
				}
			}
		}

		//var adate = event.target.innerHTML.split( " " );
		//var mthNum = mthArray.indexOf( adate[0] );
		// if ( mthNum !== -1 ) {
		// 	if ( parseInt(mthNum) < 10 ){
		// 		mthNum = '0' + mthNum;
		// 	}
		// 	paretoMth = '20' + adate[1] + '-' + mthNum + '-' + '00';
		// 	document.getElementById("paretoChkd").checked = false;
		// 	loadRetChart( paretoMth, paretoMth );
		// }
	});


	$('#yellWarn').change( function( ){
	 	drawStacked();
	});
	$('#shipChkd').change( function( ){
		drawStacked();
	});
	$('#retChkd').change( function( ){
		drawStacked();
	});
	$('#mtbfChkd').change( function( ){
		drawStacked();
	});
	$('#ffrChkd').change( function( ){
		drawStacked();
	});
	$('#oobChkd').change( function( ){
		drawStacked();
	});
	$('#warrantyChkd').change( function( ){
		drawStacked();
	});

	// $('#paretoChkd').change( function( ){
	// 	var paretoChkd = document.getElementById('paretoChkd').checked;
	// 	if ( !paretoChkd && paretoMth == ''  ) {
	// 		alert( 'No Month Value Has Been Selected' );
	// 		document.getElementById("paretoChkd").checked = true;
	// 	}
	// 	else {
	// 		drawStacked();
	// 	}
	// });
	$('#paretoChkd').change( function( ){
		drawStacked();
	});
	$('#cpfa').click( function( e ){

		var cpfaClass = e.target.className;
		cpfaClass = cpfaClass.split('-');
		if( cpfaClass[3].match( 'left' ) ) {
			$( '#controlPanel' ).css('right','0px');
			e.target.className = 'fa fa-angle-double-right fa-5x';
		}
		else {
			$( '#controlPanel' ).css('right', '-25%');
			e.target.className = 'fa fa-angle-double-left fa-5x';
		}


		

	} );
	function handleKeyPress( e ){
  		$( '#controlPanel' ).css('right','0px');
  	}

	$(function(){
	   	var datepicker = $.fn.datepicker.noConflict();
	    $.fn.bootstrapDP = datepicker;
	   	$('#rangeFromDate').bootstrapDP({
		    format: 'yyyy-mm',
		    startView: "months", 
    		minViewMode: "months"
		}).on("change", function() {
	    	drawStacked();
	    });
	    $('#rangeToDate').bootstrapDP({
		    format: 'yyyy-mm',
		    startView: "months", 
    		minViewMode: "months"
		}).on("change", function() {
	    	drawStacked();
	    });
	    $('#paretoAnalysisFromDate').bootstrapDP({
		    format: 'yyyy-mm',
		    startView: "months", 
    		minViewMode: "months"
		}).on("change", function() {
	    	drawStacked();
	    });
	    $('#paretoAnalysisToDate').bootstrapDP({
		    format: 'yyyy-mm',
		    startView: "months", 
    		minViewMode: "months"
		}).on("change", function() {
	    	drawStacked();
	    });
	    $("#rangeFromDate").click(function(e){
	    	e.preventDefault();
	    	var date = $('#rangeFromDate').val();
	      	$('#rangeFromDate').bootstrapDP('update', date);
	    });
	     $("#rangeToDate").click(function(e){
	     	e.preventDefault();
	    	var date = $('#rangeToDate').val();
	      	$( '#rangeToDate' ).bootstrapDP( "upDate", date );
	    });
	     $("#paretoAnalysisFromDate").click(function(e){
	     	e.preventDefault();
	    	var date = $('#paretoAnalysisFromDate').val();
	      	$('#paretoAnalysisFromDate').bootstrapDP('update', date);
	    });
	     $("#paretoAnalysisToDate").click(function(e){
	     	e.preventDefault();
	    	var date = $('#paretoAnalysisToDate').val();
	      	$('#paretoAnalysisToDate').bootstrapDP('update', date);
	    });
	});