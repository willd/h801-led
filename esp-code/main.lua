tmr.alarm(0, 1000, 1, function()
   if wifi.sta.getip() == nil then
      print("Connecting to AP...")
   else
      print('IP: ',wifi.sta.getip())
      tmr.stop(0)
      dofile("telnet_srv.lua")
      setupTelnetServer()
      dofile("pwm_fade.lua")	
   end
end)
