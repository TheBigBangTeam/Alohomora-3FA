#ifndef eventSwitcher_H
#define eventSwitcher_H
#include "const.h"
#include "mfrc522.h"
#include "servoMotor.h"
#include "nodeMcu.h"
/*****************************************************************************************************************
 Input: the next step (a byte describes the type of event)
 Remarks:
 Our project is divided into a sequence of steps:
 1) MFRC522_READ_CARD_EVENT     --> (in this phase Arduino ......);
 2) NODEMCU_LISTEN_EVENT        --> (.............);
 3) MFRC522_READ_CARD_EVENT     --> (............);
 ******************************************************************************************************************/
void event(byte typeOfEvent);

#endif
