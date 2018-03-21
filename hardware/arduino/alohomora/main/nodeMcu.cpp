#include "nodeMcu.h"

const byte numChars = 7;
char receivedChars[numChars];                                                 // an array to store the received data

boolean newData = false;

SimpleTimer timer;                                                            // the timer object
int timer_id;

NODEMCU_Data NODEMCUStream = NULL;
SoftwareSerial nodeMCU(NODEMCU_RX_PIN, NODEMCU_TX_PIN);                       // Create SeftwareSerial Object (RX, TX pins)

void subscribeNODEMCU_Data(NODEMCU_Data func)
{
  NODEMCUStream = func;
}

void publishNODEMCU_Data()
{
  if (NODEMCUStream != NULL){
    NODEMCUStream();
  }
}

void restartEvent()
{
  subscribeNODEMCU_Data(NULL);                                                /** the address of the soubroutine "NODEMCU_Data" has been removed from the pointer
                                                                              now the function "publishNODEMCU_Data" can't execute the code of the previous subroutine **/
  Serial.println("Restart EVENT");
  event(MFRC522_READ_CARD_EVENT);                                            // Reset event and Launch MFRC522_READ_CARD_EVENT
}


void nodeMCUinizialize()
{
  timer_id = timer.setInterval(10000, restartEvent);
  timer.run();
  subscribeNODEMCU_Data(recvWithStartEndMarkers);                               // the address of the subroutine "recvWithStartEndMarkers" has been assigned to the pointer
}

void writeToNodeMcu(String stringForWrite)
{
  nodeMCU.begin(NODEMCU_BAUD_RATE);                                             // Inizialize communicatins with nodeMCU
  Serial.print("Al nodeMCU scrivo:\t");
  Serial.println(stringForWrite);
  nodeMCU.println("# " + stringForWrite + " #");                                // Stampo nella seriale di nodeMCU l'uid della carta rfid letta
}

void recvWithStartEndMarkers()
{
  static boolean recvInProgress = false;
  static byte ndx = 0;                                                          // Serve per posizionare il carattere arrivato nella giusta posizione nell'array
  char startMarker = '<';
  char endMarker = '>';
  char rc;                                                                      // Carattere letto dalla seriale

  while (nodeMCU.available() && newData == false) {
    rc = nodeMCU.read();
    Serial.println(rc);                                                         // For debugging. Print each char in serial

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
    } else if (rc == startMarker) {
      recvInProgress = true;
    }
  }

}

void selectActionToBePerformed(String nodeMCUfeed)
{
if (nodeMCUfeed.equals("okrt")){                                                // okrt is OK Rfid and Time
    newData = false;
    Serial.println("l'Rfid ed il tempo sono corretti");                         // Stampo la risposta, in questo caso corretta
    blink(2, LedG_PIN);                                                         // Accendo il led verde per 2 secondi per dare conferma visiva
    rfidCode = "";                                                              // Ripulisco la variabile globale dove era salvato l'rfid
    writeToNodeMcu("pin_on");                                                   // Dato che l'rfid è OK mando il comando per accendere il PIN
    timer.restartTimer(timer_id);
}
else if (nodeMCUfeed.equals("wrt")){                                            // wrt is Wrong Rfid and Time
    newData = false;
    timer.deleteTimer(timer_id);
    Serial.println(nodeMCUfeed);                                                // Stampo la risposta, in questo caso errata
    Serial.println("L'Rfid\t" + rfidCode + "\tè errato o non in database");     //Stampo quale code rfid non è corretto
    rfidCode = "";                                                              // Ripulisco la variabile globale dove era salvato l'rfid
    digitalWrite(LedR_PIN, HIGH);
    delay(2000);                                                                // Accendo il led Rosso per 2 secondi per dare errore visivo
    digitalWrite(LedR_PIN, LOW);
    Serial.println("Reset");
    restartEvent();
}
else if (nodeMCUfeed.equals("okp")){                                            // okp is OK PIN
    newData = false;
    timer.deleteTimer(timer_id);
    Serial.println("Authorized access");
    subscribeNODEMCU_Data(NULL);                                               // the address of the soubroutine "NODEMCU_Data" has been removed from the pointer
                                                                                // now the function "publishNODEMCU_Data" can't execute the code of the previous subroutine
    event(SERVO_OPEN_EVENT);                                                    // Launch the SERVO open door EVENT
}
else if (nodeMCUfeed.equals("wp")){                                             // wp is Wrong PIN
    newData = false;
    timer.deleteTimer(timer_id);
    Serial.println("Access denied");
    blink(3, LedR_PIN);
    restartEvent();
}
else if (nodeMCUfeed.equals("err")){
    newData = false;
    timer.deleteTimer(timer_id);
    Serial.println("Server request error");
    rfidCode = "";                                                              // Ripulisco la variabile globale dove era salvato l'rfid
    blink(3, LedR_PIN);
    restartEvent();
}
else {
    newData = false;
    rfidCode = "";                                                              // Ripulisco la variabile globale dove era salvato l'rfid
    timer.deleteTimer(timer_id);
    Serial.println("serial received error");
    blink(5, LedR_PIN);
    Serial.print("Il dato errato è:");
    Serial.println(nodeMCUfeed);
    restartEvent();
  }
}

void showNewData()                                                              // Not in use, for debugging
{
  if (newData == true) {
    Serial.print("This just in ... ");
    Serial.println(receivedChars);
  }
}
