#include "eventSwitcher.h"

void event(byte typeOfEvent)
{
  switch (typeOfEvent) {
    case MFRC522_READ_CARD_EVENT:
      waitForRfidTag();
      break;
    case evento1:
      start_calibration();
      break;
    case evento2:
      IDnegotiation();
      break;
    case evento3:
      detections();
      break;
  }
}
