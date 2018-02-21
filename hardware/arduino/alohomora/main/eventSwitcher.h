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
 1) primo evento      --> (in this phase Arduino communicates with the GPS module, identifying the coordinates);
 2) secondo evento    --> (we can estimate R0 parameter in clean air);
 3) terzo evento      --> (Arduino receives an identifier from the server);
 4) quarto evento     --> (several gas are detected and their values are sent to the server)
 ******************************************************************************************************************/
void event(byte typeOfEvent);

#endif
