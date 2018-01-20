dofile("keypad.lua")

-- configuration
local KEYPAD_ROW_PINS = { 1, 2, 3, 4 }
local KEYPAD_COL_PINS = { 0, 5, 6 }
local KEYPAD_LABELS = "123456789*0#"

-- initialization
local myKeypad = require "keypad"
myKeypad.init(KEYPAD_ROW_PINS, KEYPAD_COL_PINS, KEYPAD_LABELS)

uart.setup(1, 115200, 8, uart.PARITY_NONE, uart.STOPBITS_1, 1)-- setup UART1 i.e. pin GPIO2

-- when '\r' is received.
uart.on("data", "\r",
  function(data)
    print("receive from uart:", data)
    if data=="quit\r" then
      uart.on("data") -- unregister callback function
    end
end, 0)






