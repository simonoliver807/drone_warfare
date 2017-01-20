const util = require('util');

module.exports = function() {

	consoleData = [];
	
	return {
		scd: function (data){
			console.log('type of data *************************')
			console.log(typeof data); 

			if ( typeof data == 'object') {
				//consoleData.push(util.inspect(data, { showHidden: true, depth: null } ) );
				consoleData.push(util.inspect(data, { showHidden: true }));
			}
			console.log(typeof data);
			if( typeof data == 'string' ) {
				console.log( 'the data is ' + data);
				consoleData.push(data);
			}
		},
		gcd: function (){
			return consoleData;
		}
	};
}