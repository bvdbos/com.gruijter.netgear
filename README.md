https://github.com/ryanthejuggler/node-netgear

https://github.com/balloob/pynetgear

To use within your Python scripts:

# All four parameters are optional
netgear = Netgear(password, host, username, port)

for i in netgear.get_attached_devices():
    print i


Supported routers

It has been tested with the Netgear R6300 router and the Netgear WNDR4500 router. According to the NETGEAR Genie app description, the following routers should work:

Netgear R7000
Netgear R6300
Netgear R6250
Netgear R6200
Netgear R6100
Netgear Centria (WNDR4700, WND4720)
Netgear WNDR4500
Netgear WNDR4300
Netgear WNDR4000
Netgear WNDR3800
Netgear WNDR3700v3
Netgear WNDR3400v2
Netgear WNR3500Lv2
Netgear WNR2200
Netgear WNR2000v3
Netgear WNR2000v4 (Port 80)
Netgear WNR1500
Netgear WNR1000v2
Netgear WNR1000v3
Netgear WNDRMAC
Netgear WNR612v2
