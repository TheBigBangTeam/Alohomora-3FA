#ifndef nodeMcu_H
#define nodeMcu_H
#include "const.h"
#include "servo.h"
#include "utils.h"
#include <SoftwareSerial.h>

/******************** writeToNodeMcu  ********************
  Remarks:
  This method is used for write strings on nodeMCU serial
 *********************************************************/
void writeToNodeMcu(String stringforwrite);
/********************************* waitFeedRfidFromNode ****************************
  Remarks:
  This method is used by "main" for wait a feedback of the RFID from nodeMCU serial
 **********************************************************************************/
void waitFeedRfidFromNode();
/******************** waitFeedPinFromNode *****************************************
  Remarks:
  This method is used by "main" for wait a feedback of the PIN from nodeMCU serial
 **********************************************************************************/
void waitFeedPinFromNode();
/******************** recvWithStartEndMarkers ********************************
  Remarks:
  This method is used for read from nodeMCU serial with start and end marker
 ****************************************************************************/
void recvWithStartEndMarkers();
/******************** showNewData *******************************************
  Remarks:
  This method is used for print in serial console the new data from nodeMCU
 ***************************************************************************/
void showNewData();

#endif
