'use strict';

const Homey = require('homey');
const util = require('util');
const NetgearRouter = require('./netgear.js');

class MyApp extends Homey.App {

	async talkToRouterExample () {
		try {
			console.log(this.router);
			// first you need to login
			if (!this.router.logged_in) {
				await this.router.login();
			}
			// get the routerInfo
			let routerInfo = await this.router.getInfo();
			console.log(routerInfo);
			// getAttachedDevices
			let attachedDevices = await this.router.getAttachedDevices();
			console.log(attachedDevices);
		 	// getAttachedDevices2
			let attachedDevices2 = await this.router.getAttachedDevices2();
			console.log(attachedDevices2);
			// getTrafficMeter
			let trafficMeter = await this.router.getTrafficMeter();
			console.log(trafficMeter);
			// Block a device
			await this.router.configurationStarted();
			await this.router.setBlockDevice('68:A4:0E:04:B1:0F', 'Block');
			await this.router.configurationFinished();
			// Unblock a device
			await this.router.configurationStarted();
			await this.router.setBlockDevice('68:A4:0E:04:B1:0F', 'Allow');
			await this.router.configurationFinished();
			// reboot
			// this.router.reboot();
		}
		catch (error) {
			console.log('error:', error);
		}
	}

	onInit() {
		this.log('Netgear App is running!');
		process.on('unhandledRejection', error => {
			this.log('unhandledRejection!');
			this.error(error.stack);
		});

		// ==================================================================

		// this.router = new NetgearRouter('password');  	// [password], [user], [host], [port]
		//
		// this.router.getCurrentSetting()	// [host]
		// 	.then((result) => {
		// 		console.log(result);
		// 	})
		// 	.catch((error) => {
		// 		console.log(error.message);
		// 	});

		// this.talkToRouterExample();
	}
}


// const router = new NetgearRouter([password], [user], [host], [port]);

// router.login()	// [password], [user], [host], [port]
// 	.then(
// 		console.log(util.inspect(router))
// 	)
// 	.catch((error) => {
// 		console.log(error);
// 	});
//
// router.getInfo()
// 	.then((result) => {
// 		console.log(result);
// 	})
// 	.catch((error) => {
// 		console.log(error.message);
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
// 		console.log(await router.setBlockDevice('68:A4:0E:04:B1:0F', 'Block'));
// 		console.log(await router.getAttachedDevices());
// 		console.log(await router.setBlockDevice('68:A4:0E:04:B1:0F', 'Allow'));
// 		console.log(await router.getAttachedDevices());
// 		console.log(await router.configurationFinished());
// 	}
// 	catch (error) {
// 	console.log(error);
// 	}
// }

// blockme();

// router.reboot()
// 	.then((result) => {
// 		console.log(result);
// 	})
// 	.catch((error) => {
// 		console.log(error);
// 	});



module.exports = MyApp;
