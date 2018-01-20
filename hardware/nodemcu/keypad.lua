--[[

- Lua matrix-keypad driver for NodeMCU (ESP8266)
- License: GPLv3 https://www.gnu.org/licenses/gpl-3.0.html
- Author: Rafa Couto <caligari@treboada.net>
- Documentation and examples: https://github.com/rafacouto/lua-matrix-keypad

--]]

local keypad = {}
local this = {}

function keypad.init(row_pins, col_pins, labels)
  this.rowPins = row_pins
  this.colPins = col_pins
  this.labels = labels
  for i,pin in pairs(col_pins) do
    gpio.mode(pin, gpio.INPUT, gpio.PULLUP)
  end
  for i,pin in pairs(row_pins) do
    gpio.mode(pin, gpio.OUTPUT)
  end
end

function keypad.scan()   
  for r,pin_row in pairs(this.rowPins) do
    gpio.write(pin_row, gpio.LOW)
    for c,pin_col in pairs(this.colPins) do
      if (gpio.read(pin_col) == gpio.LOW) then
        gpio.write(pin_row, gpio.HIGH)
        local k = ((r - 1) * #this.colPins) + c
        return this.labels:sub(k, k)
      end
    end
    gpio.write(pin_row, gpio.HIGH)
  end
  return false
end

function keypad.waitForKey(tmr_id, callback, seconds, debounce)
  local timeout = seconds * 1000
  tmr.alarm(tmr_id, debounce, tmr.ALARM_AUTO, function()
    local key = keypad.scan()
    timeout = timeout - debounce
    if timeout > 0 and not key then return end
    tmr.unregister(tmr_id)
    if key then 
      callback(key) 
    else
      callback(false) 
    end
  end)
end

return keypad

-- vim: et ts=2 sw=2 ai
