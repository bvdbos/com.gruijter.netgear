'use strict';

const Homey = require('homey');
const NetgearRouter = require('../../netgear.js');
//const util = require('util');

class NetgearDevice extends Homey.Device {

	async updateRouterDeviceState() {
		try {
			// init some values
			const lastCurrentSetting = this.readings.currentSetting || {};
			const lastInternetConnectionStatus = lastCurrentSetting.InternetConnectionStatus || 'Up';
			const lastTrafficMeter = this.readings.trafficMeter || {};
			const lastTimestamp = this.readings.timestamp || {};
			if (lastTrafficMeter === {} || lastTimestamp === {} ) {
				lastTrafficMeter.newTodayDownload = 0;
				lastTrafficMeter.newTodayUpload = 0;
				lastTimestamp = new Date ();
			}
			// get new readings from router
			this.readings = await this._driver.getRouterData.call(this);
			// calculate speed
			const downloadSpeed = Math.round(100 * 1000 * 8 * (lastTrafficMeter.newTodayDownload - this.readings.trafficMeter.newTodayDownload) / (lastTimestamp - this.readings.timestamp)) / 100;
			const uploadSpeed = Math.round(100 * 1000 * 8 * (lastTrafficMeter.newTodayUpload - this.readings.trafficMeter.newTodayUpload) / (lastTimestamp - this.readings.timestamp)) / 100;
			// update capability values and flowcards
			this.setCapabilityValue('internet_connection_status', this.readings.currentSetting.InternetConnectionStatus==='Up');
			if (this.readings.currentSetting.InternetConnectionStatus != lastInternetConnectionStatus) {
				if (this.readings.currentSetting.InternetConnectionStatus==='Up') {
					this.internetConnectedTrigger
					    .trigger(this)
			        .catch(this.error);
			        // .then( this.log )
				} else {
					this.internetDisconnectedTrigger
					    .trigger(this)
			        .catch(this.error);
			        // .then( this.log )
				}
			}
			this.setCapabilityValue('attached_devices', this.readings.attachedDevices.length);
			if (downloadSpeed >= 0 && uploadSpeed >= 0) {	// disregard midnight measurements
				this.setCapabilityValue('download_speed', downloadSpeed);
				this.setCapabilityValue('upload_speed', uploadSpeed);
				// trigger the flowcard
				let tokens = {
				    'upload_speed': uploadSpeed,
				    'download_speed': downloadSpeed
				};
				this.speedChangedTrigger
				    .trigger( this, tokens )
				        .catch(this.error)
	 			        // .then( this.log )
			}
			// update settings info when firmware has changed
			const settings = this.getSettings();
			if (this.readings.info.Firmwareversion != settings.firmware_version) {
				this.setSettings({
				  model_name : this.readings.info.ModelName,
					serial_number : this.readings.info.SerialNumber,
					firmware_version : this.readings.info.Firmwareversion,
					smart_agent_version : this.readings.info.SmartAgentversion
				})
				    .then( this.log('new router firmware detected: ', this.readings.info.Firmwareversion) )
				    .catch( this.error )
			}
		} catch (error) {
			this.log('updateRouterDeviceState error: ', error);
			}

	}

  // this method is called when the Device is inited
	onInit() {
		this.log('device init');
		this.log('name:', this.getName());
		this.log('id:', this.getData().id);

		this._driver = this.getDriver();
		this.readings = {};
		// console.log(util.inspect(this));

		const settings = this.getSettings();
		this.routerSession = new NetgearRouter(settings.password, settings.username, settings.host, settings.port);
		// this._driver.login.call(this)
		// 	.catch(this.error);

		// register trigger flow cards
		this.speedChangedTrigger = new Homey.FlowCardTriggerDevice('uldl_speed_changed');
		this.speedChangedTrigger.register();
		this.internetConnectedTrigger = new Homey.FlowCardTriggerDevice('connection_start');
		this.internetConnectedTrigger.register();
		this.internetDisconnectedTrigger = new Homey.FlowCardTriggerDevice('connection_stop');
		this.internetDisconnectedTrigger.register();

		// register action flow cards
		const blockDevice = new Homey.FlowCardAction('block_device');
		blockDevice.register()
			.on('run', ( args, state, callback ) => {
			// console.log(args);  //args.mac and args.device
			// console.log(state);
				this._driver.blockOrAllow.call(this, args.mac, 'Block');
				callback( null, true );
			});

		const allowDevice = new Homey.FlowCardAction('allow_device');
		allowDevice.register()
			.on('run', ( args, state, callback ) => {
			// console.log(args);
			// console.log(state);
				this._driver.blockOrAllow.call(this, args.mac, 'Allow');
				callback( null, true );
			});

		const reboot = new Homey.FlowCardAction('reboot');
		reboot.register()
			.on('run', ( args, state, callback ) => {
			// console.log(args);  //args.mac and args.device
			// console.log(state);
				this._driver.reboot.call(this);
				callback( null, true );
			});

		// start polling router for info
		this.intervalIdDevicePoll = setInterval( () => {
			try {
				// get new routerdata and update the state
				this.updateRouterDeviceState();
			} catch (error) { this.log('intervalIdDevicePoll error', error); }
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

	// this method is called when the user has changed the device's settings in Homey.
	onSettings( newSettingsObj, oldSettingsObj, changedKeysArr, callback ) {
		// first stop polling the device, then start init after short delay
		clearInterval(this.intervalIdDevicePoll);
		this.setAvailable()
			.catch(this.error);
		setTimeout( () => {
			this.onInit();
		}, 10000);
		// do callback to confirm settings change
		callback( null, true );
	}


}

module.exports = NetgearDevice;
