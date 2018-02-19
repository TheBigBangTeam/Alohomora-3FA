#ifndef mfrc522_H
#define mfrc522_h
#include "const.h"
#include "nodeMcu.h"
#include "utils.h"
#include <SPI.h>
#include <MFRC522.h>

/*********************** waitForRfidTag  ************************
  Remarks:
  This method is called by "main" for wait TAG on mfrc522 module
 ****************************************************************/
void waitForRfidTag();
/******************* readTag  *****************************
  Remarks:
  This method is called by "main" for read unique code from Rfid TAG
 **********************************************************/
void readTag();

#endif
