'use strict';

const Homey = require('homey');
const NetgearRouter = require('netgear.js');
// const util = require('util');


class MyDriver extends Homey.Driver {

	onInit() {
		console.log('driver init');
		// console.log(util.inspect(this.getDevices()));
	}

	onPair(socket) {
		socket.on('save', (data, callback) => {
			const router = new NetgearRouter(data.password, data.host, data.username, Number(data.port));
			console.log('save data received from frontend');
			console.log(router);
			router.getInfo()
				.then((result) => {
					console.log(result);
					if (result.hasOwnProperty('SerialNumber')) {
						callback(null, JSON.stringify(result));
					} else { callback(true, 'No Netgear Model found'); }
				})
				.catch((error) => {
					console.log(error);
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

module.exports = MyDriver;

// console.log(util.inspect(router));
