// const myDate = require('./myDate');
// const myLogger = require('./myLogger');

module.exports = asyncFn => { 
	return (
		async (req, res, next) => { 
			try { 
				return await asyncFn(req, res, next);
			} catch (error) { 
				// myLogger.error(JSON.stringify(error));
				return next(error); 
			} 
		}
	); 
};
