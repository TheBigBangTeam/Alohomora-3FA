#include "nodeMcu.h"

static boolean recvInProgress = false;

const byte numChars = 32;
char receivedChars[numChars];                                                 // an array to store the received data

boolean newData = false;
boolean recvSecondCall = false;

SimpleTimer timer;                                                            // Timer object
int wd_timer_id;                                                              // timer ID

NODEMCU_Data NODEMCUStream = NULL;
SoftwareSerial nodeMCU(NODEMCU_RX_PIN, NODEMCU_TX_PIN);                       // Create SeftwareSerial Object (RX, TX pins)

void subscribeNODEMCU_Data(NODEMCU_Data func)
{
  NODEMCUStream = func;
  Serial.println("8");
}

void publishNODEMCU_Data()
{
  if (NODEMCUStream != NULL){
    NODEMCUStream();
    Serial.println("10");
  }
}

void nodeMCUinizialize()
{
  wd_timer_id = timer.setInterval(10000, restartEvent);
  timer.run();
  subscribeNODEMCU_Data(recvWithStartEndMarkers);                               // the address of the subroutine "recvWithStartEndMarkers" has been assigned to the pointer
  Serial.println("9");
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
  static byte ndx = 0;                                                          // Serve per posizionare il carattere arrivato nella giusta posizione nell'array
  char startMarker = '<';
  char endMarker = '>';
  char rc;                                                                      // Carattere letto dalla seriale
  Serial.println("11");
  
  while (nodeMCU.available() > 0 && newData == false) {
    timer.restartTimer(restartEvent);
    Serial.println("12");
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
          timer.deleteTimer(wd_timer_id);
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
    writeToNodeMcu("pin_on");                                                   // Dato che l'rfid è OK mando il comando per accendere il PIN
    wd_timer_id = timer.setInterval(10000, restartEvent);
    timer.run();
}
else if (nodeMCUfeed.equals("wrt")){                                            // wrt is Wrong Rfid and Time
    newData = false;
    Serial.println(nodeMCUfeed);                                                // Stampo la risposta, in questo caso errata
    digitalWrite(LedR_PIN, HIGH);
    delay(2000);                                                                // Accendo il led Rosso per 2 secondi per dare errore visivo
    digitalWrite(LedR_PIN, LOW);
    Serial.println("Reset");
    restartEvent();
}
else if (nodeMCUfeed.equals("okp")){                                            // okp is OK PIN
    newData = false;
    Serial.println("Authorized access");
    subscribeNODEMCU_Data(NULL);                                               // the address of the soubroutine "NODEMCU_Data" has been removed from the pointer
                                                                                // now the function "publishNODEMCU_Data" can't execute the code of the previous subroutine
    event(SERVO_OPEN_EVENT);                                                    // Launch the SERVO open door EVENT
}
else if (nodeMCUfeed.equals("wp")){                                             // wp is Wrong PIN
    newData = false;
    Serial.println("Access denied");
    blink(3, LedR_PIN);
    restartEvent();
}
else if (nodeMCUfeed.equals("err")){
    newData = false;
    Serial.println("Server request error");
    blink(3, LedR_PIN);
    restartEvent();
}
else {
    newData = false;
    Serial.println("serial received error");
    blink(5, LedR_PIN);
    Serial.print("Il dato errato è:");
    Serial.println(nodeMCUfeed);
    restartEvent();
  }
}

void restartEvent()
{
  subscribeNODEMCU_Data(NULL);                                                /** the address of the soubroutine "NODEMCU_Data" has been removed from the pointer
                                                                              now the function "publishNODEMCU_Data" can't execute the code of the previous subroutine **/
  event(MFRC522_READ_CARD_EVENT);                                             // Reset event and Launch MFRC522_READ_CARD_EVENT
}

void showNewData()
{
  if (newData == true) {
    Serial.print("This just in ... ");
    Serial.println(receivedChars);
  }
}
