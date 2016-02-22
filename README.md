# h801-led

This projects autodiscovery on a hardcoded IP (default is 192.168.1.0/24)

This unit uses a ESP8266 for wireless communication, with NodeMCU firmware and a node.js+socket.io frontend.

The H801 uses the secondary TX for UART0 (gpio2), so standard nodeMCU, Arduino etc won't work. Recompiling nodeMCU takes some effort,
but is quite manageable.

This project properly runs on a first generation Raspberry Pi with minimal delays

![Screenshot of interface](https://raw.githubusercontent.com/willd/h801-led/master/ss.png)

TODO:
Actual write-up containing a howto on nodemcu, the h801 and more
