#include "const.h"
#include "init.h"
#include "mfrc522.h"
#include "servo.h"
#include "nodeMcu.h"
#include "utils.h"

void setup()
{
  initialPrint();
  initApp();
  initialTest();
  finalprint();
}

void loop() {
  waitForRfidTag();
  readTag();
  writeToNodeMcu(rfidCode);
  recvWithStartEndMarkers();

}
