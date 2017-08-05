'use strict';

const Homey = require('homey');
//const util = require('util');
// const NetgearRouter = require('netgear.js');

class MyApp extends Homey.App {

	onInit() {
		this.log('Netgear App is running!');
	}

}

module.exports = MyApp;

// ==================================================================

// const router = new NetgearRouter('password'); //, hst, usrname, 5000);	// password, [host], [user], [port]
//console.log(util.inspect(router));
//
// router.getCurrentSetting()
// 	.then((result) => {
// 		console.log(result);
// 	})
// 	.catch((error) => {
// 		console.log(error);
// 	});

// router.login()
// .then((result) => {
// 	console.log(result);
// })
// .catch((error) => {
// 	console.log(error);
// });

// router.getInfo()
// 	.then((result) => {
// 		console.log(result);
// 	})
// 	.catch((error) => {
// 		console.log(error);
// 	});

// router.getAttachedDevices()
// .then((result) => {
// 	console.log(result);
// })
// .catch((error) => {
// 	console.log(error);
// });

// router.getAttachedDevices2()
// .then((result) => {
// 	console.log(result);
// })
// .catch((error) => {
// 	console.log(error);
// });

// router.getTrafficMeter()
// 	.then((result) => {
// 		console.log(result);
// 	})
// 	.catch((error) => {
// 		console.log(error);
// 	});

// const blockme = async () => {
// 	try {
// 		await router.login();
// 		console.log(await router.configurationStarted());
// 		console.log(await router.setBlockDevice('94:9F:3E:60:E1:8D', 'Block'));
// 		console.log(await router.getAttachedDevices());
// 		console.log(await router.setBlockDevice('94:9F:3E:60:E1:8D', 'Allow'));
// 		console.log(await router.getAttachedDevices());
// 		console.log(await router.configurationFinished());
// 	}
// 	catch (error) {
// 	console.log(error);
// 	}
// }

// blockme();
