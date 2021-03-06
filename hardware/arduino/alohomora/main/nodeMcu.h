#ifndef nodeMcu_H
#define nodeMcu_H
#include "const.h"
#include "servoMotor.h"
#include "utils.h"
#include "mfrc522.h"
#include "SimpleTimer.h"
#include <SoftwareSerial.h>

/************** subscribeNODEMCU_Data  *******************
  input: function in NODEMCU_Data
  @param *NODEMCU_Data func:
  - enabled when ----;
  - disabled when the previous phase is completed
*******************************************************/
void subscribeNODEMCU_Data(NODEMCU_Data func);
/***************************************    publishNODEMCU_Data   ***************************************************
  Remarks:
  This method, as already mentioned, will be inclued in the 'loop' function of Arduino and will check continuosly
  the pointer content associated with the 'subscribeNODEMCU_Data(NODEMCU_Data func)' subroutine.
 *******************************************************************************************************************/
void publishNODEMCU_Data();
/***************************************    nodeMCUinizialize   ***************************************************
  Remarks:
  This method is called by eventSwitcher for inizialize nodeMCU object and start with this event
 *******************************************************************************************************************/
void nodeMCUinizialize();
/******************** selectActionToBePerformed ********************************
  Remarks:
  This method is used for select action based on the feedback from NodeMCU
 ****************************************************************************/
void selectActionToBePerformed(String nodeMCUfeed);
/******************** recvWithStartEndMarkers ********************************
  Remarks:
  This method is used for read from nodeMCU serial with start and end marker
 ****************************************************************************/
void recvWithStartEndMarkers();
/***************************** writeToNodeMcu  **************************************
  Remarks:
  This method is used for write strings on nodeMCU serial.
  http://forum.arduino.cc/index.php?topic=396450.msg2727727#msg2727727 for reference
 ***********************************************************************************/
void writeToNodeMcu(String stringforwrite);
/****************************** restartEvent  ******************************
  Remarks:
  This method is used to restart Arduino to the First event, in case of error
 ***************************************************************************/
void restartEvent();
/****************************** showNewData  ******************************
  Remarks:
  This method isn't in use. For debugging
 ***************************************************************************/
void showNewData();

#endif
