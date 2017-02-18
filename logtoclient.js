const util = require('util');

module.exports = function() {

	consoleData = [];
	
	return {
		scd: function (data){

			if ( typeof data == 'object') {
				//consoleData.push(util.inspect(data, { showHidden: true, depth: null } ) );
				consoleData.push(util.inspect(data, { showHidden: true, depth: null }));
			}
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