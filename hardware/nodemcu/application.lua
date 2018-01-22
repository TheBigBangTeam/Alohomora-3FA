--[[ 
Deve aspettare un ricezione in seriale della stringa contente l'rfid uid (è del tipo "'EE-EE-EE-EE'").
Presa la stringa, senza i delimitatori, la deve immagazzinare fino a fine iterazione ed immediatamente forwardare al server.
Attenderà dunque che si verifichi l'evento di ritorno, tramite http, del feedback rfid e time.
Ricevuto il feedback lo deve mandare ad Arduino stampando in seriale l'apposita stringa.
Ora Arduino risponderà, in seriale, la stringa per abilitare il tastierino numerico.
Deve quindi abilitare il tastierino numerico per l'inserimento da parte dell'utente e aspettare l'input.
Il pin deve essere immagazzinato fino a fine iterazione e subito forwardarlo al server insieme al precedente Rfid uid.
Attenderà dunque che si verifichi l'evento di ritorno, tramite http, del feedback rfid e pin.
Deve quindi inviare, in seriale, ad Arduino la stringa per far aprire la porta.
Alla fine dell'iterazione (sia se va a termine che no) cancellerà i dati rfid e Pin immagazzinati per questa iterazione.
]]--

--[[
    reference:
    Lua-matrix-library -->
    wifi code in init.lua --> nodemcu documentation
]]--

dofile("keypad.lua")

-- configuration
local KEYPAD_ROW_PINS = { 1, 2, 3, 4 }
local KEYPAD_COL_PINS = { 0, 5, 6 }
local KEYPAD_LABELS = "123456789*0#"

-- initialization
    -- Keypad
local myKeypad = require "keypad"
myKeypad.init(KEYPAD_ROW_PINS, KEYPAD_COL_PINS, KEYPAD_LABELS)

    
-- setup 
    -- UART1 i.e. pin GPIO2
uart.setup(1, 115200, 8, uart.PARITY_NONE, uart.STOPBITS_1, 1)

---------------------------------------------------------------------------------------------------
local temp_rfid = ""  -- ricordarsi di controllare se c'è qualcosa prima andare a ricevere il pin
local temp_pin = ""

local response = {
  [1] = "'",
  [2] = "ok_rfid_and_time",
  [3] = "wrong_rfid_or_time",
  [4] = "pin_on",
  [5] = "ok_pin",
  [6] = "wrong_pin"
}

-- when '\r' is received.
uart.on("data", "\r",
  function(data)
    print("receive from uart:", data)
    if data== response[1] + "\r" then
      --uart.on("data") -- unregister callback function
        temp_rfid = data
        print "Invio rfid al server e lo salvo per il successivo invio"
        SendRfidServer() -- invia rfid dati a http servet
    elseif data == response[4] + "\r" then
        --accendi tastierino numerico
        print " Accendo il tastierino numerico"
        print " Finchè non passano 30 secondi o viene i numeri digitati non sono sono sufficenti cicla"
        insertPin() -- lancio funzione per l'inserimento del pin
        print (temp_pin) -- togliere dopo
        sendPinServer()-- invio al server
    else
        print " The program has been terminated."
        print " Data in Serial are wrong"
        print " Thank you!";
    end
end, 0)

uart.write(1, "Hello, world\n")

function SendFridServer()
    print (" Invio l'rfid al server" + "\n")
end

function insertPin ()
    if (temp_rfid == "") then 
    return (print " Non si può chiamare l'inserimento del pin se ancora non è transitato un rfid")
    else
    -- use a timer to scan keys every 800ms and print them
        tmr.alarm(1, 800, tmr.ALARM_SINGLE, function() 
        local key = myKeypad.scan()
            if key then print(key) end
        end)

    -- wait for keys
        function processKey(key)
            if key then
                print(string.format("You have pressed '%s'", key))
                temp_pin = temp_pin .. key
                myKeypad.waitForKey(0, processKey, 30, 200)
            else
                print("Timed out!")
            end
        end
        
        print("Press keys or wait 30s...")
        myKeypad.waitForKey(0, processKey, 30, 200)
-- devo capire se ad ogni pressione di un tasto il contatore dei 30 secondi si riavvia
    end
end


function sendPinServer()
    print " invio rfid + pin al server"
end






