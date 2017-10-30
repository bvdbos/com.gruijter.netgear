# Netgear #

App to make Homey interact with Netgear routers.

It allows you to
* see and act on when the internet connection goes down
* see and act on the internet upload and download speed
* see and act on the number of attached devices
* block and allow an attached device by MAC address
* reboot the router

![image][mobile-card-image]

### Device setup in Homey ###
To setup go to "Devices" and add the Netgear router by filling in the admin password and the IP address. The other fields can be left on default, unless you know what you are doing :). It should be possible to add multiple Netgear routers, but this is untested. After the router device is added successfully you can change the polling interval which is set to 1 minute as default.

### One time setup of the router ###
For Homey to get all the functionality you need to do some one time settings in the router. Depending on the router type and firmware you might not have some of this functionality. Make sure you are on the latest router firmware.
- For up/download speed, enable the traffic statistics: routerlogin.net > advanced setup > traffic meter.
- To be able to block or allow a device, enable access control: routerlogin.net > advanced > security > access control.

### Supported routers ###
In general: If you can use the genie app to manage the router then my app will likely do something. The app has been tested with the Netgear R7000 router with firmware V1.0.9.12_1.2.23 and SOAP version 3.2. You can check your router version by browsing to http://routerlogin.net/currentsetting.htm. According to the NETGEAR Genie app description, the following routers might work:

Wi-Fi Routers: Orbi AC1450 Centria (WNDR4700, WND4720) JNR1010 JNR3210 JR6150 JWNR2010 R6050 R6100 R6200 R6220 R6250 R6300 R6400 R6700 R6900 R7000 R7500 R7500 R7800 R7900 R8000 R8300 R8500 R9000 WNDR3400v2 WNDR3700v3 WNDR3800 WNDR4000 WNDR4300 WNDR4500 WNDRMAC WNR1000v2 WNR1500 WNR2020 WNR2020v2 WNR2000v3 WNR2200 WNR2500 WNR3500Lv2 WNR612v2 WNR614

DSL Modem Gateways: DGN2200B DGND3700B D3600 D6000 D6100 D6200 D6000 D6200B D6300 D6300B D6400 D7000 D7800 DGN1000 DGN2200v3 DGN2200v4 DGND3700v2 DGND3800B DGND4000

Cable Gateway: C7000 C6300 C6250 C3700 C3000 N450

### Donate: ###
If you like the app you can show your appreciation by posting it in the [forum].
If you really like the app you can buy me a beer.

[![Paypal donate][pp-donate-image]][pp-donate-link]

<sup>btc: 14VR1QCpqWUWiSLa1sn3Dpzq3Wrp83zFfC</sup>

<sup>eth: 0xEcF4747203Eba214c071fDAa4825cD867B410d70</sup>

<sup>ltc: LfGJu1AdnPFMoBXwHvf2qG9sCV1onyXDvd</sup>

===============================================================================

Version changelog

```
v0.0.5	2017.10.29 Beta release
to do: trigger "new unknown device", add device presence detection

```
[forum]: https://forum.athom.com/discussion/3532
[pp-donate-link]: https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=VB7VKG5Y28M6N
[pp-donate-image]: https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif
[mobile-card-image]: https://forum.athom.com/uploads/editor/n3/ktcwwkqgvr1p.png
