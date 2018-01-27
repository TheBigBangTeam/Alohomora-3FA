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
Alla fine dell'iterazione (sia se va a termine che no) cancellerà i dati rfid e Pin immagazzinati per questa iterazione.]]--
--]]
--[[
    reference:
    Lua-matrix-library -->
    wifi code in init.lua --> nodemcu documentation
   
--]]
--[[
Per la trasmissione e ricezione in seriale bisogna usare le porte di default (0) ma viene trasmessa anche
la seguenza di boot. Per questo motivo si preferisce trasmettere con la seriale 1 e ricevere con la seriale default
dato che la seriale 1 non può ricevere ma solo trasmettere.
Utilizzo uart.alt(1) per cambiare la seriale che viene utilizzata di default, quindi posso utilizzare
uart.write(0, ...) per trasmettere sulla seriale 1. Poi dovrò riutilizzare uart.alt(0) per cambiare porta
e ricevere sulla seriale 0
esempio:
    uart.alt(1)
    uart.write(0, "CIAO MONDO\n")
    uart.alt(0)
    uart.on()
--]]

dofile("keypad.lua")

-- configuration
local KEYPAD_ROW_PINS = { 1, 2, 3, 4 }
local KEYPAD_COL_PINS = { 0, 5, 6 }
local KEYPAD_LABELS = "123456789*0#" -- Provare 

-- initialization
    -- Keypad
local myKeypad = require "keypad"
myKeypad.init(KEYPAD_ROW_PINS, KEYPAD_COL_PINS, KEYPAD_LABELS)

    
-- setup 
    -- UART1 i.e. pin GPIO2
     
uart.setup(1, 115200, 8, 0, 1, 0)

---------------------------------------------------------------------------------------------------
local temp_rfid = ""
local temp_pin = ""
local arrived_rfid = false
local commandFromArduino = ""
local api_url = "http://localhost/"
local response = {
  [1] = "",
  [2] = "ok_rfid_and_time",
  [3] = "wrong_rfid_or_time",
  [4] = "pin_on",
  [5] = "ok_pin",
  [6] = "wrong_pin"
}

-- TEST 
tmr.alarm(1, 20000, 1, function ()
    uart.alt(1)
    uart.write(0, "CIAO MONDO\n")
    print ("Numero caratteri: "..string.len(commandFromArduino))
    uart.alt(0)
end)

-- when '\r' is received.
uart.on("data", "\n",
  function(data)
  if data ~= nil then
  print ("receive from uart:"..data.."\r\n")
        commandFromArduino =  string.match(data, '#%s([%u%w%s%d%-%_]+)%s#')
        print (commandFromArduino)
        print (string.len(commandFromArduino) 
        -- and string.match(commandFromArduino, "%u%u%-%u%u%-%u%u%-%u%u")
        if string.len(commandFromArduino) == 11 then
    -- RFID: EE-EE-EE-EE
            temp_rfid = data
            print ("Invio rfid al server e lo salvo per il successivo invio")
            SendRfidServer() -- invia rfid dati a http servet
        elseif commandFromArduino == response[4] then
            --accendi tastierino numerico
            if (arrived_rfid == true) then
                print " Accendo il tastierino numerico"
                print " Finchè non passano 30 secondi o i numeri digitati non sono sufficenti cicla"
                insertPin() -- lancio funzione per l'inserimento del pin
                print (temp_pin) -- togliere dopo
                sendPinServer()-- invio al server
            else
                print ("Rfid is not arrived, please check")
            end
        else
            print " The program has been terminated."
            print " Data in Serial are wrong"
            print " Thank you!"
            print "Program Stop"
        end
   else
      print " Data is nil"
    end
end, 0)


function SendRfidServer()
    req = api_url.."/api/authenticate/:"..temp_rfid
    print (" Invio l'rfid: "..temp_rfid.." al server\r")
    http.get(req, nil, function(code, data)
        if (code < 0) then
            print("HTTP request failed")
        elseif (code == 200) then
            print("HTTP request OK, status 200")
            -- qui va chiamata la funzione che torna una stringa ad arduino
            arrived_rfid = true -- mi salvo il fatto che l'rfid è arrivato
            uart.alt(1)
            uart.write(0, "ok_rfid_and_time\r\n")
            uart.alt(0)
        else
            print ("HTTP request failed with error code "..code)
            print(req..)
        end
    end)
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
                if temp_pin.len == 4 then -- se la lunghezza del pin è 4 allora la lunghezza giusta ed esco
                    print "lunghezza pin raggiunta"
                    end
                myKeypad.waitForKey(0, processKey, 30, 200)
            else
                print("Timed out!\r\n")
            end
        end
        
        print("Press keys or wait 30s...\r")
        myKeypad.waitForKey(0, processKey, 30, 200)
-- devo capire se ad ogni pressione di un tasto il contatore dei 30 secondi si riavvia
    end
end


function sendPinServer()
    req = api_url.."/api/authenticate/:"..temp_rfid.."/:"..temp_pin
    print (" Invio il pin: "..temp_pin.." al server\r")
    print " invio rfid + pin al server\r\n"
    http.get(req, nil, function(code, data)
        if (code < 0) then
            print("HTTP request failed")
        elseif (code == 200) then
            print("HTTP request OK, status 200")
            -- qui va chiamata la funzione che torna una stringa ad arduino
            arrived_rfid = true -- mi salvo il fatto che l'rfid è arrivato
            uart.alt(1)
            uart.write(0, "ok_rfid_and_time\r\n")
            uart.alt(0)
        else
            print ("HTTP request failed with error code "..code)
            print(req..)
        end
    end)
end






