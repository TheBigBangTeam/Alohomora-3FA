#include "nodeMcu.h"

long serialRfidFeedTime = 6000; // 6 sec Tempo massimo di attesa per la risposta da parte di nodeMCU del feedback RFID
long serialPinFeedTime = 15000; // 15 sec  Tempo massimo di attesa per la risposta da parte di nodeMCU del feedback PIN

const byte numChars = 32;
char receivedChars[numChars];   // an array to store the received data

boolean newData = false;
boolean recvSecondCall = false;

unsigned long setTimeWaitRecvSecondCall;

NODEMCU_Data NODEMCUStream = NULL;
SoftwareSerial nodeMCU(NODEMCU_RX_PIN, NODEMCU_TX_PIN);                       // Create SeftwareSerial Object (RX, TX pins)

void subscribeNODEMCU_Data(NODEMCU_Data func)
{
  NODEMCUStream = func;
}

void publishNODEMCU_Data()
{
  if (NODEMCUStream != NULL)
    NODEMCUStream();
}

void nodeMCUinizialize()
{
  nodeMCU.begin(NODEMCU_BAUD_RATE);                                             // Inizialize communicatins with nodeMCU
  subscribeNODEMCU_Data(recvWithStartEndMarkers);                               // the address of the subroutine "recvWithStartEndMarkers" has been assigned to the pointer
}

void recvWithStartEndMarkers()
{
  static boolean recvInProgress = false;
  static byte ndx = 0;                                                          // Serve per posizionare il carattere arrivato nella giusta posizione nell'array
  char startMarker = '<';
  char endMarker = '>';
  char rc;                                                                      // Carattere letto dalla seriale

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
          receivedChars[ndx] = '\0';                                            // terminate the string
          recvInProgress = false;
          ndx = 0;
          newData = true;
          selectActionToBePerformed(receivedChars);
        }
    }

    else if (rc == startMarker) {
      recvInProgress = true;
    }
  }

  if (recvSecondCall = true){
    do
    {
      recvWithStartEndMarkers();
    } while (setTimeWaitRecvSecondCall + WaitTime > millis());
  }
}

void selectActionToBePerformed(String nodeMCUfeed)
{
if (nodeMCUfeed.equals("okRT")){
    Serial.println("l'Rfid ed il tempo sono corretti");                         // Stampo la risposta, in questo caso corretta
    blink(3, LedG_PIN);                                                         // Accendo il led verde per 2 secondi per dare conferma visiva
    blinkBuzzer(2);
    writeToNodeMcu("# pin_on #");                                               // Dato che l'rfid è OK mando il comando per accendere il PIN
    recvSecondCall = true;                                                      /* Arrivato qui ci troviamo alla seconda iterazione di ricezione dati da nodeMCU.
                                                                                  Quindi dobbiamo dare un tempo massimo di 10 secondi per attendere una risposta.
                                                                                  Potrebbe non venir inserito nessun pin ed in questo caso dovremmo interrompere
                                                                                  l'evento di attesa ricezione */
    setTimeWaitRecvSecondCall = millis();                         //  Variabile per contare il tempo massimo per aspettare una risposta da nodeMCU per conferma PIN
    recvWithStartEndMarkers();
}
if (nodeMCUfeed.equals("wRT")){
    Serial.println(nodeMCUfeed);                                                // Stampo la risposta, in questo caso errata
    digitalWrite(LedR_PIN, HIGH);
    delay(2000);                                                                // Accendo il led Rosso per 2 secondi per dare errore visivo
    digitalWrite(LedR_PIN, LOW);
    Serial.println("Reset");
    subscribeNODEMCU_Data(NULL);                                               // the address of the soubroutine "NODEMCU_Data" has been removed from the pointer
                                                                                // now the function "publishNODEMCU_Data" can't execute the code of the previous subroutine
    event(MFRC522_READ_CARD_EVENT);                                             // Reset event and Launch MFRC522_READ_CARD_EVENT
}
if (nodeMCUfeed.equals("okP")){
    Serial.println("Authorized access");
    subscribeNODEMCU_Data(NULL);                                               // the address of the soubroutine "NODEMCU_Data" has been removed from the pointer
                                                                                // now the function "publishNODEMCU_Data" can't execute the code of the previous subroutine
    event(SERVO_OPEN_EVENT);                                                    // Launch the SERVO open door EVENT
}
if (nodeMCUfeed.equals("wP")){
    Serial.println("Access denied");
    blink(3, LedR_PIN);
    subscribeNODEMCU_Data(NULL);                                               // the address of the soubroutine "NODEMCU_Data" has been removed from the pointer
                                                                                // now the function "publishNODEMCU_Data" can't execute the code of the previous subroutine
    event(MFRC522_READ_CARD_EVENT);                                             // Reset event and Launch MFRC522_READ_CARD_EVENT
}
else{
    Serial.println("serial received error");
    blink(5, LedR_PIN);
    subscribeNODEMCU_Data(NULL);                                               // the address of the soubroutine "NODEMCU_Data" has been removed from the pointer
                                                                                // now the function "publishNODEMCU_Data" can't execute the code of the previous subroutine
    event(MFRC522_READ_CARD_EVENT);                                             // Reset event and Launch MFRC522_READ_CARD_EVENT
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
  nodeMCU.begin(NODEMCU_BAUD_RATE);                                             // Inizialize communicatins with nodeMCU
  Serial.println("6_1_1 l'rfid è:");
  Serial.println(stringForWrite);
  nodeMCU.println("# " + stringForWrite + " #");                                // Stampo nella seriale di nodeMCU l'uid della carta rfid letta
  Serial.println("6_1_2");
}
