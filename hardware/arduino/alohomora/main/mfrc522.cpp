#include "mfrc522.h"

String rfidCode = "";
byte letter;

SPI.begin(); // MFRC522 Hardware uses SPI protocol
// Creo una istanza della libreria RFID
MFRC522 mfrc522(SS_PIN, RST_PIN);
mfrc522.PCD_Init(); // Initialize MFRC522 Hardware
mfrc522.PCD_SetAntennaGain(mfrc522.RxGain_max); //If you set Antenna Gain to Max it will increase reading distance

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
}

void readTag()
{
  // Viene caricato il codice della tessera diviso in blocchi esadecimali da 2 separati da un "-"(trattino), all'interno di una Stringa
  for ( byte i = 0; i < mfrc522.uid.size; i++ ) {
    rfidCode.concat(String(mfrc522.uid.uidByte[i], HEX));
    if ( i < mfrc522.uid.size - 1 ) rfidCode += "-";
  }
  rfidCode.toUpperCase();
  Serial.println("");
  Serial.println("UID tag :");
  Serial.println("# " + rfidCode + " #");
  writeToNodeMcu(rfidCode)                    // See nodeMcu.h  Stampo nella seriale di nodeMCU l'uid della carta rfid letta
}
