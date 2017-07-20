'use strict';

const Homey = require('homey');
const NetgearRouter = require('netgear.js');
const util = require('util');

class MyDevice extends Homey.Device {

  // this method is called when the Device is inited
	onInit() {
		this.log('device init');
		this.log('name:', this.getName());
		this.log('id:', this.getData().id);
		this.readings = {};

		// console.log(util.inspect(this));
		const settings = this.getSettings();
		const router = new NetgearRouter(settings.password, settings.host, settings.username, settings.port);
		console.log(router);

		// start polling router for info
		this.intervalIdDevicePoll = setInterval( async () => {

			// init some values
			let lastTrafficMeter = this.readings.trafficMeter || {};
			let lastTimestamp = this.readings.timestamp || {};
			if (lastTrafficMeter === {} || lastTimestamp === {} ) {
				lastTrafficMeter.newTodayDownload = 0;
				lastTrafficMeter.newTodayUpload = 0;
				lastTimestamp = new Date ();
			}

				try {
				// get new data from router
				this.readings.currentSetting = await router.getCurrentSetting();
				this.readings.info = await router.getInfo();
				this.readings.attachedDevices = await router.getAttachedDevices2();
				this.readings.trafficMeter = await router.getTrafficMeter();
				this.readings.timestamp = new Date ();

				// calculate speed
				const downloadSpeed = Math.round(100 * 1000 * 8 * (lastTrafficMeter.newTodayDownload - this.readings.trafficMeter.newTodayDownload) /
					(lastTimestamp - this.readings.timestamp))/100;
				const uploadSpeed = Math.round(100 * 1000 * 8 * (lastTrafficMeter.newTodayUpload - this.readings.trafficMeter.newTodayUpload) /
					(lastTimestamp - this.readings.timestamp))/100;

				// update capability values
				this.setCapabilityValue('internet_connection_status', this.readings.currentSetting.InternetConnectionStatus==='Up');
				this.setCapabilityValue('attached_devices', this.readings.attachedDevices.length);
				if (downloadSpeed >= 0 && uploadSpeed >= 0) {	// disregard midnight measurements
					this.setCapabilityValue('download_speed', downloadSpeed);
					this.setCapabilityValue('upload_speed', uploadSpeed);
				}

			} catch(err) {
				console.log(err);
			}
		}, 1000 * settings.polling_interval);

	}

	// this method is called when the Device is added
	onAdded() {
		this.log('device added');
	}

	// this method is called when the Device is deleted
	onDeleted() {
		// stop polling
		clearInterval(this.intervalIdDevicePoll);
		this.log('device deleted');
	}

	onSettings( newSettingsObj, oldSettingsObj, changedKeysArr, callback ) {
	    // run when the user has changed the device's settings in Homey.
			// first stop polling the device, then start init after short delay
			clearInterval(this.intervalIdDevicePoll);
			setTimeout( () => {
				this.onInit();
			}, 10000);
			// do callback to confirm settings change
	    callback( null, true );
	}

	// this method is called when the Device has requested a state change (turned on or off)
	onCapabilityOnoff(value, opts, callback) {

		// ... set value to real device

		// Then, emit a callback ( err, result )
		callback(null);

		// or, return a Promise
		return Promise.reject(new Error('Switching the device failed!'));
	}

}

module.exports = MyDevice;
