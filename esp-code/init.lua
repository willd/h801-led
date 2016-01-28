print('init.lua ver 1.2')
pwm.setup(5, 1000, 0)
pwm.setup(2, 1000, 0)
pwm.setup(7, 1000, 0)

wifi.setmode(wifi.STATION)
print('set mode=STATION (mode='..wifi.getmode()..')')
print('MAC: ',wifi.sta.getmac())
print('chip: ',node.chipid())
print('heap: ',node.heap())
-- wifi config start
wifi.sta.config("ssid","psk")
-- wifi config end
dofile("main.lua")
