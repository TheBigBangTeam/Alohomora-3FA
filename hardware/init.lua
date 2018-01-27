    uart.setup(0, 115200, 8, 0, 1, 0)
    --uart.on(1)
    --uart.write(0, "page 3")

    val = 65

    while 1 do
        uart.write(0, string.char(val), "\r\n")
        val = val + 1
        if val > 90 then
            val = 65
        end
        tmr.delay(1000000)
    end

