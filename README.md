# h801-led
This unit uses a ESP8266 for wireless communication, with NodeMCU firmware and a node.js+socket.io frontend.

The H801 uses the secondary TX for UART0 (gpio2), so standard nodeMCU, Arduino etc won't work. Recompiling nodeMCU takes some effort,
but is quite manageable.

This project properly runs on a first generation Raspberry Pi with minimal delays
