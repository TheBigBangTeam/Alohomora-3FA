#include "mfrc522.h"

String rfidCode = "";
byte letter;
MFRC522_Data mfrc522Stream = NULL;

MFRC522 mfrc522(SS_PIN, RST_PIN);                               // Create an istance from mrfc522 library


void subscribeMFRC522_Data(MFRC522_Data func)
{
  mfrc522Stream = func;
  Serial.println("2");
}

void publishMFRC522_Data()
{
  if (mfrc522Stream != NULL){
    mfrc522Stream();
    Serial.println("3");
  }
}

void MFRC522inizialize()
{
  SPI.begin();                                                                  // MFRC522 Hardware uses SPI protocol
  mfrc522.PCD_Init();                                                           // Initialize MFRC522 Hardware
  mfrc522.PCD_SetAntennaGain(mfrc522.RxGain_max);                 //If you set Antenna Gain to Max it will increase reading distance
  Serial.println("1");
  subscribeMFRC522_Data(waitForRfidTag);
}

void waitForRfidTag()
{
  //Look for new cards
  if ( !mfrc522.PICC_IsNewCardPresent() ) {
    return;
  }
  //Select one of the cards
  if ( !mfrc522.PICC_ReadCardSerial() ) {
    return;
  }
  Serial.println("####### Card Detected ########");
  mfrc522.PICC_DumpDetailsToSerial(&(mfrc522.uid));
  Serial.println("4");
  readTag();

  subscribeMFRC522_Data(NULL);                                  // the address of the soubroutine "MFRC522_Data" has been removed from the pointer
                                                                // now the function "publishMFRC522_Data" can't execute the code of the previous subroutine
  Serial.println("7");
  event(NODEMCU_READ_EVENT);                                    // Launch the NodeMCU serial read EVENT
}

void readTag()
{
  Serial.println("5_1");
  Serial.println("READTAG");
  // Viene caricato il codice della tessera diviso in blocchi esadecimali da 2 separati da un "-"(trattino), all'interno di una Stringa
  for ( byte i = 0; i < mfrc522.uid.size; i++ ) {
    rfidCode.concat(String(mfrc522.uid.uidByte[i], HEX));
    if ( i < mfrc522.uid.size - 1 ) rfidCode += "-";
  }
  rfidCode.toUpperCase();
  Serial.println("5_2");
  showNewDataTag();
}

void showNewDataTag()
{
  Serial.println("");
  Serial.print("UID tag :");
  Serial.println("# " + rfidCode + " #");
  writeToNodeMcu(rfidCode);                                     // Write the rfid code, previously captured by MFRC522, in NodeMCU Serial communication
  Serial.println("6");
}
