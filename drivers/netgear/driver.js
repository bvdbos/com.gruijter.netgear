'use strict';

const Homey = require('homey');
const NetgearRouter = require('netgear.js');
// const util = require('util');


class NetgearDriver extends Homey.Driver {

	onInit() {
		this.log('NetgearDriver onInit');
		// console.log(util.inspect(this.getDevices()));
	}

	getRouterData() {		// call with NetgearDevice as this
		let readings = {};
		readings.timestamp = new Date ();
		return new Promise ( async (resolve, reject) => {
			try {
				// get new data from router
				readings.currentSetting = await this.routerSession.getCurrentSetting();
				readings.info = await this.routerSession.getInfo();
				readings.attachedDevices = await this.routerSession.getAttachedDevices();
				readings.trafficMeter = await this.routerSession.getTrafficMeter();
				resolve(readings);
			} catch (error) {
					this.log('getRouterData error', error);
					reject(error);
				}
		});
	}

	async blockOrAllow(mac, action) {   // call with NetgearDevice as this
		try {
			 await this.routerSession.login();
			 await this.routerSession.configurationStarted();
			 await this.routerSession.setBlockDevice(mac, action);
			 await this.routerSession.configurationFinished();
		}
		catch (error) {
			this.log('blockOrAllow error', error);
		}
	}

	async reboot() {   // call with NetgearDevice as this
		try {
			 await this.routerSession.login();
			 await this.routerSession.configurationStarted();
			 await this.routerSession.reboot();
			 await this.routerSession.configurationFinished();
		}
		catch (error) {
			this.log('reboot error', error);
		}
	}

	onPair(socket) {
		socket.on('save', (data, callback) => {
			const router = new NetgearRouter(data.password, data.host, data.username, Number(data.port));
			this.log('save button pressed in frontend', router);
			router.getInfo()
				.then((result) => {
					// console.log(result);
					if (result.hasOwnProperty('SerialNumber')) {
						callback(null, JSON.stringify(result));
					} else { callback(true, 'No Netgear Model found'); }
				})
				.catch((error) => {
					this.log('getInfo error', error);
					callback(error, error);
				});
		});
	}

	// function to add all Netgear attached devices to Homey
	// onPairListDevices(data, callback) {
	// 	const router = new NetgearRouter(data.password, data.host, data.username, data.port);
	// 	router.getAttachedDevices2()
	// 	.then((result) => {
	// 		console.log(result);
	// 		const devicelist = [];
	// 		while (result.length >= 1) {
	// 			const device = result.pop();
	// 			devicelist.push(
	// 				{
	// 					name: `${device.MAC}___${device.Name}`,
	// 					data: {	id: device.MAC },
	// 				}
	// 			);
	// 		}
	// 		console.log(devicelist);
	// 		callback(null, devicelist);
	// 	})
	// 	.catch((error) => {
	// 		console.log(error);
	// 		callback(error, error);
	// 	});
	// }

}

module.exports = NetgearDriver;

// console.log(util.inspect(router));
