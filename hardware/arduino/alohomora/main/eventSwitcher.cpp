#include "eventSwitcher.h"

void event(byte typeOfEvent)
{
  switch (typeOfEvent) {
    case MFRC522_READ_CARD_EVENT:
      Serial.println("Evento mfrc522 sottoscritto");
      MFRC522inizialize();
      break;
    case NODEMCU_READ_EVENT:
      Serial.println("Evento nodemcu sottoscritto");
      nodeMCUinizialize();
      break;
    case SERVO_OPEN_EVENT:
      Serial.println("Evento servo sottoscritto");
      servoInizialize();
      break;
  }
}
