#include "const.h"
#include "eventSwitcher.h"
#include "init.h"
#include "mfrc522.h"
#include "servoMotor.h"
#include "nodeMcu.h"
#include "utils.h"

void setup()
{
  initialPrint();
  initApp();
  initialTest();
  finalPrint();
  event(MFRC522_READ_CARD_EVENT);
}

void loop()
{
  publishMFRC522_Data();
  publishNODEMCU_Data();
  publishSERVO();
}
