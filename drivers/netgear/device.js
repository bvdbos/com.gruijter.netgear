'use strict';

const Homey = require('homey');
const NetgearRouter = require('netgear.js');
//const util = require('util');

// register trigger flow cards
const speedChangedTrigger = new Homey.FlowCardTriggerDevice('uldl_speed_changed');
speedChangedTrigger.register();
const internetConnectedTrigger = new Homey.FlowCardTriggerDevice('connection_start');
internetConnectedTrigger.register();
const internetDisconnectedTrigger = new Homey.FlowCardTriggerDevice('connection_stop');
internetDisconnectedTrigger.register();


function getRouterData(routerSession) {
	let readings = {};
	readings.timestamp = new Date ();
	return new Promise ( async (resolve, reject) => {
		try {
			// get new data from router
			readings.currentSetting = await routerSession.getCurrentSetting();
			readings.info = await routerSession.getInfo();
			readings.attachedDevices = await routerSession.getAttachedDevices();
			readings.trafficMeter = await routerSession.getTrafficMeter();
			resolve(readings);
		} catch (error) {
			console.log(error);
			reject(error);
			}
	});
}

async function updateRouterState() {   // call with router device as this
	try {
		// init some values
		let lastTrafficMeter = this.readings.trafficMeter || {};
		let lastTimestamp = this.readings.timestamp || {};
		if (lastTrafficMeter === {} || lastTimestamp === {} ) {
			lastTrafficMeter.newTodayDownload = 0;
			lastTrafficMeter.newTodayUpload = 0;
			lastTimestamp = new Date ();
		}

		// get new readings from router
		this.readings = await getRouterData(this.routerSession);

		// calculate speed
		const downloadSpeed = Math.round(100 * 1000 * 8 * (lastTrafficMeter.newTodayDownload - this.readings.trafficMeter.newTodayDownload) / (lastTimestamp - this.readings.timestamp)) / 100;
		const uploadSpeed = Math.round(100 * 1000 * 8 * (lastTrafficMeter.newTodayUpload - this.readings.trafficMeter.newTodayUpload) / (lastTimestamp - this.readings.timestamp)) / 100;

		// update capability values and flowcards
		this.setCapabilityValue('internet_connection_status', this.readings.currentSetting.InternetConnectionStatus==='Up');
		if (this.readings.currentSetting.InternetConnectionStatus==='Up') {
			internetConnectedTrigger
			    .trigger(this)
			        .catch(this.error)
			        // .then( this.log )
		} else {
			InternetDisonnectedTrigger
			    .trigger(this)
			        .catch(this.error)
			        // .then( this.log )
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
			speedChangedTrigger
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
			    // .then( this.log )
			    .catch( this.error )
		}

	} catch (error) {
		console.log(error);
		}

}

async function blockOrAllow(mac, action) {   // call with router device as this
	try {
		 await this.routerSession.login();
		 await this.routerSession.configurationStarted();
		 await this.routerSession.setBlockDevice(mac, action);
		 await this.routerSession.configurationFinished();
	}
	catch (error) {
		console.log(error);
	}
}

class NetgearRouterDevice extends Homey.Device {

  // this method is called when the Device is inited
	onInit() {
		this.log('device init');
		this.log('name:', this.getName());
		this.log('id:', this.getData().id);
		this.readings = {};

		// console.log(util.inspect(this));
		const settings = this.getSettings();
		this.routerSession = new NetgearRouter(settings.password, settings.host, settings.username, settings.port);
		console.log(this.routerSession);

		// register action flow cards
		const blockDevice = new Homey.FlowCardAction('block_device');
		    blockDevice.register()
		        .on('run', ( args, state, callback ) => {
					// console.log(args);  //args.mac and args.device
					// console.log(state);
					blockOrAllow.call(this, args.mac, 'Block');
					callback( null, true );
		            // ...
		        });

		const allowDevice = new Homey.FlowCardAction('allow_device');
		    allowDevice.register()
		        .on('run', ( args, state, callback ) => {
					// console.log(args);
					// console.log(state);
					blockOrAllow.call(this, args.mac, 'Allow');
					callback( null, true );
		            // ...
		        })

		// start polling router for info
		this.intervalIdDevicePoll = setInterval( async () => {

			try {
				// get new routerdata and updat the state
				updateRouterState.call(this);
			} catch (error) { console.log(error); }

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
			setTimeout( () => {
				this.onInit();
			}, 10000);
			// do callback to confirm settings change
	    callback( null, true );
	}

}

module.exports = NetgearRouterDevice;
