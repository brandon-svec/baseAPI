    var jsforce = require('jsforce');

    var config = require('config');

    var gusConn = null;
    
    module.exports = {
        Init: fn_external_init,
        EnableMock: enableMock
    }

    function fn_external_init(cb){
        if (!cb || typeof cb !== 'function') {
            throw new Error('No Callback Function Found');
          }


        fn_internal_init(cb);
        return true;
    }

    function fn_internal_init(cb){
        gusConn = new jsforce.Connection(config.get('gus.connection'));

		gusConn.login(config.get('gus.user'), config.get('gus.pwd'), function(err, res) {
			if(err){
				var output = '';
				output += err;

                cb(output);
                return false;
			}else{
                cb();
                return true;
			}
		});
    }

    function fn_internal_init_mock(cb){
        cb();
        return true;
    }

    function enableMock () {
        if (process.env.NODE_ENV === 'production') {
          throw new Error('Error: Cannot enable MOCK in Production');
        }
      
        fn_internal_init = fn_internal_init_mock
      }