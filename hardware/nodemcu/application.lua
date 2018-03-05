--[[
--Deve aspettare un ricezione in seriale della stringa contente l'rfid uid (è del tipo "'EE-EE-EE-EE'").
--Presa la stringa, senza i delimitatori, la deve immagazzinare fino a fine iterazione ed immediatamente forwardare al server.
--Attenderà dunque che si verifichi l'evento di ritorno, tramite http, del feedback rfid e time.
--Ricevuto il feedback lo deve mandare ad Arduino stampando in seriale l'apposita stringa.
--Ora Arduino risponderà, in seriale, la stringa per abilitare il tastierino numerico.
--Deve quindi abilitare il tastierino numerico per l'inserimento da parte dell'utente e aspettare l'input.
--Il pin deve essere immagazzinato fino a fine iterazione e subito forwardarlo al server insieme al precedente Rfid uid.
--Attenderà dunque che si verifichi l'evento di ritorno, tramite http, del feedback rfid e pin.
--Deve quindi inviare, in seriale, ad Arduino la stringa per far aprire la porta.
--Alla fine dell'iterazione (sia se va a termine che no) cancellerà i dati rfid e Pin immagazzinati per questa iterazione.]]--
--]]
--[[
--    reference:
--    Lua-matrix-library -->
--    wifi code in init.lua --> nodemcu documentation

--]]
--[[
--Per la trasmissione e ricezione in seriale bisogna usare le porte di default (0) ma viene trasmessa anche
--la seguenza di boot. Per questo motivo si preferisce trasmettere con la seriale 1 e ricevere con la seriale default
--dato che la seriale 1 non può ricevere ma solo trasmettere.
--Utilizzo uart.alt(1) per cambiare la seriale che viene utilizzata di default, quindi posso utilizzare
--uart.write(0, ...) per trasmettere sulla seriale 1. Poi dovrò riutilizzare uart.alt(0) per cambiare porta
--e ricevere sulla seriale 0
--esempio:
--    uart.alt(1)
--    uart.write(0, "CIAO MONDO\n")
--    uart.alt(0)
--    uart.on()
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
local api_url = "http://192.168.43.143:3001"
local token = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YTcyZTY3YjU5ZWEzZDIyNGYzY2MzNWYiLCJpYXQiOjE1MTc0ODAxOTgsImlzcyI6IlRoZUJpZ0JhbmdUZWFtIn0.Q9Zq0T6KN6NuUOJg-SxmecrfekWVf35zgfDhcAtBvAVrhAZifzxPllJaVuFEhwaZHb-8g6pQ5TP4zdj1sPk0oQ"
local response = {
  [1] = "",
  [2] = "<okRT>",
  [3] = "<wRT>",
  [4] = "pin_on",
  [5] = "<okP>",
  [6] = "<wP>"
}

-- TEST
--tmr.alarm(1, 20000, 1, function ()
 --   uart.alt(1)
 --   uart.write(0, "CIAO MONDO\n")
--    print ("Numero caratteri: "..string.len(commandFromArduino))
--    uart.alt(0)
--end)

print("ArchLinux and Fausto Marcantoni are the way")

-- when '\r' is received.
uart.on("data", "\n",
  function(data)
  if data ~= nil then
  print ("receive from uart:"..data.."\r")
  commandFromArduino =  string.match(data, '#%s([%u%w%s%d%-%_]+)%s#')
      if (commandFromArduino == nil) then
        print ("Ci stanno Hackerando la seriale.. stacca, stacca")
       else
       -- qui va inserito qualcosa che previene il crash dato da nil risposto da match
        print (commandFromArduino)
        print ("La lunghezza della stringa ricevuta è: "..string.len(commandFromArduino))
          -- and string.match(commandFromArduino, "%u%u%-%u%u%-%u%u%-%u%u")
        if string.len(commandFromArduino) == 11 then
          -- RFID: EE-EE-EE-EE
            temp_rfid = commandFromArduino
            print ("Invio rfid al server e lo salvo per il successivo invio")
            SendRfidServer() -- invia rfid dati a http servet
        elseif commandFromArduino == response[4] then
            --accendi tastierino numerico
            if (arrived_rfid == true) then
                temp_pin = ""
                print "Accendo il tastierino numerico"
                print "Finchè non passano 10 secondi o i numeri digitati non sono sufficenti cicla"
                insertPin()  -- lancio funzione per l'inserimento del pin
            else
                print ("Rfid is not arrived, please check")
            end
        else
            print "The program has been terminated."
            print "Data in Serial are wrong"
            print "Thank you!"
            print "Program Stop"
        end
       end
   else
      print " Data is nil"
    end
end, 0)


function SendRfidServer()
    req = api_url.."/api/authenticate/"..temp_rfid
    print ("Invio l'rfid: "..temp_rfid.." al server"..api_url.."")
    http.get(req, "Authorization: Bearer "..token.."\r\n", function(code, data)
        if (code < 0) then
            print("HTTP request failed")
        elseif (code == 200) then
            print("HTTP request OK, status 200")
            -- qui va chiamata la funzione che torna una stringa ad arduino
            arrived_rfid = true -- mi salvo il fatto che l'rfid è arrivato
            print("l'rfid è arrivato")
            tmr.delay(4000000)
            uart.alt(1)
            uart.write(0, response[2].."\r\n")
            uart.alt(0)
            print("ok_rfid_or_time to Arduino")
        elseif (code == 401) then
            print("l'rfid non è autorizzato")
            print("wrong_rfid_or_time to Arduino")
            uart.alt(1)
            uart.write(0, response[3].."\r\n")
            uart.alt(0)
        else
            print (string.format("HTTP request failed with error code "..code))
            print(req)
        end
    end)
end

function insertPin ()
    if (temp_rfid == "") then
    print " Non si può chiamare l'inserimento del pin se ancora non è transitato un rfid"
    else

    -- use a timer to scan keys every 800ms and print them
       -- tmr.alarm(1, 800, tmr.ALARM_SINGLE, function()
       -- local key = myKeypad.scan()
         --   if key then print(key) end
       -- end)
       
        mytimer = tmr.create()
        mytimer:register(10000, tmr.ALARM_SINGLE, function(t)
            print("Tempo di inserimento PIN (10sec) terminato")
            uart.alt(1)
            uart.write(0, response[6].."\r\n")
            uart.alt(0);
            t:unregister() end)
        mytimer:start() -- lancio il timer che farà partire l'invio del pin al server

    -- wait for keys
        function processKey(key)
            if key then
                print(string.format("You have pressed '%s'", key))
                temp_pin = tostring(temp_pin..key)
                if (string.len(temp_pin) == 4) then -- se la lunghezza del pin è 4 allora la lunghezza giusta ed esco
                    print "lunghezza pin raggiunta"
                    tmr.unregister(0)
                    mytimer:unregister()
                    sendPinServer()
                    end
                myKeypad.waitForKey(0, processKey, 10, 200)
            else
                print("Timed out!\r\n")
            end
        end


        print("Press keys or wait 10s...\r")
        myKeypad.waitForKey(0, processKey, 10, 200)

-- devo capire se ad ogni pressione di un tasto il contatore dei 30 secondi si riavvia
    end
end


function sendPinServer()
    req = api_url.."/api/authenticate/"..temp_rfid.."/"..temp_pin
    print("La richiesta alla API è:"..req)
    print "Invio rfid + pin al server\r\n"
    print ("Invio il pin: "..temp_pin.." al server: "..api_url.."\r")
    http.get(req, "Authorization: Bearer "..token.."\r\n", function(code, data)
        if (code < 0) then
            print("HTTP request failed")
        elseif (code == 200) then
            print("HTTP request OK, status 200")
            -- qui va chiamata la funzione che torna una stringa ad arduino
            --arrived_rfid = true -- mi salvo il fatto che l'rfid è arrivato
            print("ok_pin to arduino")
            uart.alt(1)
            uart.write(0, response[5].."\r\n")
            uart.alt(0)
            arrived_rfid = false
            temp_rfid = ""
            temp_pin = ""
        elseif (code == 401) then
            print("il pin non è autorizzato o errato")
            print("wrong_pin to Arduino")
            uart.alt(1)
            uart.write(0, response[6].."\r\n")
            uart.alt(0)
        else
            print ("HTTP request failed with error code "..code)
            print(req)
        end
    end)
end
