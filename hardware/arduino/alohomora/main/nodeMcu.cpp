#include "nodeMcu.h"

long serialRfidFeedTime = 6000; // 6 sec Tempo massimo di attesa per la risposta da parte di nodeMCU del feedback RFID
long serialPinFeedTime = 15000; // 15 sec  Tempo massimo di attesa per la risposta da parte di nodeMCU del feedback PIN

//String nodeMCUfeed = ""; // variabile dove salvare il feedback da nodeMCU per l'rfid
String nodeMCUfeed = ""; // Stringa per memorizzare il feedback da nodeMCU per il pin

const byte numChars = 32;
char receivedChars[numChars];   // an array to store the received data

boolean newData = false;

NODEMCU_Data NODEMCUStream = NULL;

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
  SoftwareSerial nodeMCU(NODEMCU_RX_PIN, NODEMCU_TX_PIN);                       // Create SeftwareSerial Object (RX, TX pins)
  nodeMCU.begin(NODEMCU_BAUD_RATE);                                             // Inizialize communicatins with nodeMCU
  writeToNodeMcu(rfidCode);                                                     // Write the rfid code, previously captured, in NodeMCU Serial communication
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
}

void selectActionToBePerformed(nodeMCUfeed)
{
switch (nodeMCUfeed){
  case "okRT":
    Serial.println("l'Rfid ed il tempo sono corretti");                         // Stampo la risposta, in questo caso corretta
    blink(3, LedG_PIN);                                                         // Accendo il led verde per 2 secondi per dare conferma visiva
    blinkBuzzer(2);
    writeToNodeMcu("# pin_on #");                                               // Dato che l'rfid è OK mando il comando per accendere il PIN
    recvWithStartEndMarkers();
  case "wRT":
    Serial.println(nodeMCUfeedRfid);                                            // Stampo la risposta, in questo caso errata
    digitalWrite(LedR_PIN, HIGH);
    delay(2000);                                                                // Accendo il led Rosso per 2 secondi per dare errore visivo
    digitalWrite(LedR_PIN, LOW);
    Serial.println("Reset");
    break;
  case "okP":
    Serial.println("Authorized access");
    subscribeNODEMCU_Data = NULL;                                               // the address of the soubroutine "MFRC522_Data" has been removed from the pointer
                                                                                // now the function "publishMFRC522_Data" can't execute the code of the previous subroutine
    event(SERVO_OPEN_EVENT);                                                    // Launch the SERVO open door EVENT
  case "wP":
    Serial.println("Access denied");
    blink(5, LedR_PIN);
  default:
  Serial.println("serial received error");
  blink(5, LedR_PIN);
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
  nodeMCU.print("# " + stringForWrite + " #");
  Serial.println("  ....Written to nodeMCU");
}
