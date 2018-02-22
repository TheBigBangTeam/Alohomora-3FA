#ifndef nodeMcu_H
#define nodeMcu_H
#include "const.h"
#include "servo.h"
#include "utils.h"
#include <SoftwareSerial.h>
/************** subscribeNODEMCU_Data  *******************
  input: function in NODEMCU_Data
  @param *NODEMCU_Data func:
  - enabled when ----;
  - disabled when the previous phase is completed
*******************************************************/
void subscribeNODEMCU_Data(NODEMCU_Data func)
/***************************************    publishNODEMCU_Data   ***************************************************
  Remarks:
  This method, as already mentioned, will be inclued in the 'loop' function of Arduino and will check continuosly
  the pointer content associated with the 'subscribeNODEMCU_Data(NODEMCU_Data func)' subroutine.
 *******************************************************************************************************************/
void publishNODEMCU_Data()
/******************** recvWithStartEndMarkers ********************************
  Remarks:
  This method is used for read from nodeMCU serial with start and end marker
 ****************************************************************************/
void recvWithStartEndMarkers();
/******************** writeToNodeMcu  ********************
  Remarks:
  This method is used for write strings on nodeMCU serial
 *********************************************************/
void writeToNodeMcu(String stringforwrite);

#endif
