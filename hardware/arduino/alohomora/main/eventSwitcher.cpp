#include "eventSwitcher.h"

void event(byte typeOfEvent)
{
  switch (typeOfEvent) {
    case GPS_LOCALIZATION_EVENT:
      GPS_localization();
      break;
    case CALIBRATION_EVENT:
      start_calibration();
      break;
    case ID_NEGOTIATION_EVENT:
      IDnegotiation();
      break;
    case DETECTIONS_EVENT:
      detections();
      break;
  }
}
