'use strict';

const Homey = require('homey');
const util = require('util');
const NetgearRouter = require('netgear.js');

class MyApp extends Homey.App {

	onInit() {
		this.log('Netgear App is running!');
	}

}

module.exports = MyApp;

// ==================================================================

// const router = new NetgearRouter(pssword, hst, usrname, 5000);	// password, [host], [user], [port]
// console.log(util.inspect(router));
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
// .then((result) => {
// 	console.log(result);
// })
// .catch((error) => {
// 	console.log(error);
// });

// router.setBlockDevice('68:A4:0E:04:B1:0F', 'Block')
// .then((result) => {
// 	console.log(result);
// })
// .catch((error) => {
// 	console.log(error);
// });
