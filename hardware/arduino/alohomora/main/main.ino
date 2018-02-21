#include "const.h"
#include "eventSwitcher.h"
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
  event(MFRC522_READ_CARD_EVENT);
}

void loop() {
  publishMFRC522_Data();
  writeToNodeMcu(rfidCode);
  recvWithStartEndMarkers();

}
