const myLogger = require('./myLogger');

const myValueLog = function(params) {
	if (params.title !== undefined) {
		myLogger.info(params.req.logHeadTail + params.title);
	} else {
		myLogger.info(params.req.logHeadTail + '--- response ---');
	}
	myLogger.info(params.req.logHeadTail + JSON.stringify(params.obj));
	return params.obj;
};


module.exports = myValueLog;