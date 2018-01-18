uart.setup(0, 115200, 8, uart.PARITY_NONE, uart.STOPBITS_1, 1)
uart.on("data",0 ,function(data) print("receive from uart:", data) end, 1)
uart.write(1, "ok_p")