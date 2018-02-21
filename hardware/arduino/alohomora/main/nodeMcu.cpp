#include "nodeMcu.h"

long serialRfidFeedTime = 6000; // 6 sec Tempo massimo di attesa per la risposta da parte di nodeMCU del feedback RFID
long serialPinFeedTime = 15000; // 15 sec  Tempo massimo di attesa per la risposta da parte di nodeMCU del feedback PIN

//String nodeMCUfeedRfid = ""; // variabile dove salvare il feedback da nodeMCU per l'rfid
String nodeMCUfeedPin = ""; // Stringa per memorizzare il feedback da nodeMCU per il pin

const byte numChars = 32;
char receivedChars[numChars];   // an array to store the received data

boolean newData = false;

//  Creo una istanza della libreria SoftwareSerial
SoftwareSerial nodeMCU(NODEMCU_RX_PIN, NODEMCU_TX_PIN); // RX, TX pins
nodeMCU.begin(NODEMCU_BAUD_RATE); // Inizialize communicatins with nodeMCU

void recvWithStartEndMarkers()
{
  static boolean recvInProgress = false;
  static byte ndx = 0;                      //  Serve per posizionare il carattere arrivato nella giusta posizione nell'array
  char startMarker = '<';
  char endMarker = '>';
  char rc;                                //  Carattere letto dalla seriale

  while (nodeMCU.available() > 0 && newData == false) {
    rc = nodeMCU.read();

    if (recvInProgress == true) {
      if (rc != endMarker) {
        receivedChars[ndx] = rc;
        ndx++;
        if (ndx >= numChars) {
          ndx = numChars - 1;
          }
      } else {
          receivedChars[ndx] = '\0'; // terminate the string
          recvInProgress = false;
          ndx = 0;
          newData = true;
        }
    }

    else if (rc == startMarker) {
      recvInProgress = true;
    }
  }
}

void selectActionToBePerformed()
{
switch (receivedChars){
  case "okRT":
    Serial.println("l'Rfid ed il tempo sono corretti");  //  Stampo la risposta, in questo caso corretta
    blink(3, LedG_PIN); //  Accendo il led verde per 2 secondi per dare conferma visiva
    blinkBuzzer(2);
    writeToNodeMcu("pin_on");  //  Dato che l'rfid è OK mando il comando per accendere il PIN
    waitFeedPinFromNode();
    break;
  case "wRT":
    Serial.println(nodeMCUfeedRfid);  //  Stampo la risposta, in questo caso errata
    digitalWrite(LedR_PIN, HIGH);
    delay(2000);  //  Accendo il led Rosso per 2 secondi per dare errore visivo
    digitalWrite(LedR_PIN, LOW);
    Serial.println("Reset");
    break;
  case "okP":
    Serial.println("Authorized access");
    openDoor();
  case "wP":
    Serial.println("Access denied");
    blink(5, LedR_PIN);
  default:
  Serial.println("serial received error");
  blink(5, LedR_PIN);
}

  } while (startTime1 + serialRfidFeedTime > millis());
  //  Se è passato il tempo limite per aspettare una risposta dal nodeMCU, resetta e torna all'inizio del loop
  if (startTime1 + serialRfidFeedTime <= millis()) {
    Serial.println("nodeMCU impiega troppo tempo per rispondere la conferma dell'rfid...");
    Serial.println("Reset");
    return;
  }
}

void waitFeedPinFromNode()
{
  /*---- Ora si aspetta finchè il nodeMCU non manda la risposta del controllo pin giusto o errato */
  unsigned long startTime2 = millis();  //  Variabile per contare il tempo massimo per aspettare una risposta da nodeMCU per conferma PIN
  while ( nodeMCU.available() <= 0) { //  Finchè non è disponibile nulla in seriale...
    if (millis() - startTime2 > serialPinFeedTime) { //  Se il tempo massimo scade allora si ricomincerà tutto da capo
      Serial.println("nodeMCU impiega troppo tempo per feedback PIN...");
      Serial.println("Reset");
      break;
    } else {
      Serial.println("Aspetto feedback PIN...");
    }
  }

}

void showNewData()
{
  if (newData == true) {
    Serial.print("This just in ... ");
    Serial.println(receivedChars);
    newData = false;
  }
}

void writeToNodeMcu(String stringForWrite)
{
  nodeMCU.println("# " + stringForWrite + " #");
  Serial.println("Written to nodeMCU")
}
