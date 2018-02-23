#ifndef eventSwitcher_H
#define eventSwitcher_H
#include "const.h"
#include "mfrc522.h"
#include "servo.h"
#include "nodeMcu.h"
/*****************************************************************************************************************
 Input: the next step (a byte describes the type of event)
 Remarks:
 Our project is divided into a sequence of steps:
 1) MFRC522_READ_CARD_EVENT     --> (in this phase Arduino communicates with the GPS module, identifying the coordinates);
 2) NODEMCU_LISTEN_EVENT        --> (we can estimate R0 parameter in clean air);
 3) MFRC522_READ_CARD_EVENT     --> (Arduino receives an identifier from the server);
 ******************************************************************************************************************/
void event(byte typeOfEvent);

#endif
