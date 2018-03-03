/*  Authors: The Big Bang Team
    Project: Alohomora-3FA
    date: 28/02/2018
    Version: Alpha 1.2
    Link: https://github.com/TheBigBangTeam/Alohomora-3FA
    Arduino version: Arduino Nano v3 A000005

    Tramite questo sketch si vuole prendere in input il codice ID da schede rfid, tramite lettore Mifare RC522. L'ID deve essere passato via seriale al NodeMCU che lo processerà e ci restituirà(seriale) lo stato 'accept' o 'failed'(se l'rfid è valido o meno).
    Nel caso di ID valido verrà inviato, tramite seriale, il segnale per abilitare nel NodeMCU l'inserimento del Pin e l'evento di successo verrà segnalato tramite accensione del Led Verde per 2 secondi.
    Nel caso di ID non valido non verrà inviato nulla, in seriale, al NodeMCU e l'evento fallito verrà segnalato tramite accensione del Led Rosso per 2 secondi. Si riparte in questo caso dal main di arduino (loop())
    Dopo l'avvenuto input del pin da parte di NodeMCU ci si aspetta che quest'ultimo mandi in input, in seriale, la comanda o meno di apertura porta. Se non arriva nulla entro 3 secondi, lampeggio led Rosso per 3 volte
    Nel caso di PIN valido nel NodeMCU, varrà azionato il Servo motore per l'apertura della porta. L'evento di successo verrà segnalato tramite il lampeggio per 5 volte del led Verde. Passati 15 secondi verrà riazionato il servo motore per la chiusura della porta.
    Nel caso di PIN non valido nel NodeMCU l'evento di fallimento verrà segnalato tramite il lampeggio del Led Rosso per 5 volte.
    
    Reference:
      -Servo Motor(italian) -->  http://bit.ly/2mJYFjd  (pdf in hardware/schematics-doc/doc/GestioneServoITA.pdf)
      -RFID Mifare rc522 library and doc --> https://github.com/miguelbalboa/rfid
      -SPI --> https://www.arduino.cc/en/Reference/SPI

    Pinout RFID module:
      RC522 MODULE    Uno/Nano
        SS/SDA          D10
        SCK             D13
        MOSI            D11
        MISO            D12
        IRQ             N/A
        GND             GND
        RST             D9
        3.3V            3.3V
*/
#include "const.h"
#include "eventSwitcher.h"
#include "init.h"
#include "mfrc522.h"
#include "servoMotor.h"
#include "nodeMcu.h"
#include "utils.h"
#include "MemoryFree.h"

void setup()
{
  initialPrint();
  initApp();
  initialTest();
  finalPrint();
  event(MFRC522_READ_CARD_EVENT);
}

void loop()
{
  publishMFRC522_Data();
  publishNODEMCU_Data();
  publishSERVO();
}
