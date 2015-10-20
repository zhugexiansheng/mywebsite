var log4js = require("log4js");

log4js.configure({
	appenders:[{
		type:'console',
	},{
		type:"file",
		filename:"logs/access.log",
		maxLogSize:1024,
		backups:3,
		category:'normal'
	}],
	replaceConsole:true,
});

function setNewLogger(name){
	var logger = log4js.getLogger(name);
	logger.setLevel('auto');

	return logger;
}

module.exports = {
	log4js:log4js,
	logger:setNewLogger
}