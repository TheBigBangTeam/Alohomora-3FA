#include "eventSwitcher.h"

void event(byte typeOfEvent)
{
  switch (typeOfEvent) {
    case MFRC522_READ_CARD_EVENT:
      waitForRfidTag();
      break;
    case NODEMCU_READ_EVENT:
      nodeMCUinizialize();
      break;
    case SERVO_OPEN_EVENT:
      servoInizialize();
      break;
  }
}
