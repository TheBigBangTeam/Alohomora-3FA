#include "nodeMcu.h"

long serialRfidFeedTime = 6000; // 6 sec Tempo massimo di attesa per la risposta da parte di nodeMCU del feedback RFID
long serialPinFeedTime = 15000; // 15 sec  Tempo massimo di attesa per la risposta da parte di nodeMCU del feedback PIN

String nodeMCUfeedRfid = ""; // variabile dove salvare il feedback da nodeMCU per l'rfid
String nodeMCUfeedPin = ""; // Stringa per memorizzare il feedback da nodeMCU per il pin

//  Creo una istanza della libreria SoftwareSerial
SoftwareSerial nodeMCU(NODEMCU_RX_PIN, NODEMCU_TX_PIN); // RX, TX pins
nodeMCU.begin(NODEMCU_BAUD_RATE); // Inizialize communicatins with nodeMCU

void writeToNodeMcu(String stringforwrite)
{
  nodeMCU.println("# " + stringforwrite + " #");
  Serial.println("Written on nodeMCU")
}

void waitFeedRfidFromNode()
{
  /*---- Ciclo per attendere la verifica dell'Rfid e orario per 2 secondi ----------- */
  do { // fino a quando startTime non arriva a 2 secondi trascorsi cicla. QUesto serve per attendere la ricezione del feeedback da parte del nodeMCU
    if (nodeMCU.available() > 0) { //è arrivato qualche carattere?
      nodeMCUfeedRfid = nodeMCU.readString();//  Legge la seriale da nodeMCU

      Serial.println("La stringa arriva dalla seriale così: " + nodeMCUfeedRfid);
      nodeMCUfeedRfid = nodeMCUfeedRfid.substring(1, nodeMCUfeedRfid.length() - 2);
      Serial.println("La stringa dovrebbe essere di lughezza:" + nodeMCUfeedRfid.length());
      Serial.println("La stringa esce dopo essere stata processata: " + nodeMCUfeedRfid);
      Serial.println("Ed è di lunghezza" + String("okRT").length());
      if ( nodeMCUfeedRfid.equals("okRT")) { //  Se arriva la conferma di rfid e orario corretti allora....
        Serial.println("l'Rfid ed il tempo sono corretti");  //  Stampo la risposta, in questo caso corretta
        blink(3, LedG_PIN); //  Accendo il led verde per 2 secondi per dare conferma visiva
        blinkBuzzer(2);
        writeToNodeMcu("pin_on");  //  Dato che l'rfid è OK mando il comando per accendere il PIN
        waitFeedPinFromNode();
      } else if ( nodeMCUfeedRfid == "wRT") {
        Serial.println(nodeMCUfeedRfid);  //  Stampo la risposta, in questo caso errata
        digitalWrite(LedR_PIN, HIGH);
        delay(2000);  //  Accendo il led Rosso per 2 secondi per dare errore visivo
        digitalWrite(LedR_PIN, LOW);
        Serial.println("Reset");
        break;  //  Ricomincio da capo
      } else {
        Serial.println("In seriale è arrivato qualcosa di inaspettato");

      }
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

  nodeMCUfeedPin = nodeMCU.readString();
  Serial.println("La stringa arriva dalla seriale così: " +  nodeMCUfeedPin);
  nodeMCUfeedPin =  nodeMCUfeedPin.substring(1,  nodeMCUfeedPin.length() - 2);
  Serial.println("La stringa esce dopo essere stata processata: " +  nodeMCUfeedPin);

  if (nodeMCUfeedPin == "okP") {
    Serial.println("Authorized access");
    openDoor();
  }
  if (nodeMCUfeedPin == "wP") {
    Serial.println("Access denied");
    blink(5, LedR_PIN);
  }
  else {
    Serial.println("serial received error");
    blink(5, LedR_PIN);
  }
}
