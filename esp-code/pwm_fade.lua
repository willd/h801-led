function sign(x)
  return x>0 and 1 or x<0 and -1 or 1
end

function fade(l,pin)
for i = pwm.getduty(pin) , l, sign(l-pwm.getduty(pin)) do
   pwm.setduty(pin, i)
   tmr.delay(200)
   tmr.wdclr()
end
end

function readBrightness(pin)
  return print('brightness:' .. pwm.getduty(pin))
end
