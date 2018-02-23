#ifndef servo_H
#define servo_H
#include "const.h"
#include "utils.h"
#include "eventSwitcher.h"
#include <Servo.h>
/****************************************   subscribeSERVO  ***************************************************
  input: function in SERVO
  @param *SERVO func:
  - enabled when -----;
  - disabled when the previous phase is completed
 ******************************************************************************************************************/
void subscribeSERVO(SERVO func);
/***************************************    publishSERVO   ******************************************************
  Remarks:
  This method, as already mentioned, will be inclued in the 'loop' function of Arduino and will check continuosly
  the pointer content associated with the 'subscribeSERVO(SERVO func)' subroutine.
 *******************************************************************************************************************/
void publishSERVO();
/***************************************    servoInizialize   ***************************************************
  Remarks:
  This method is called by eventSwitcher for inizialize Servo object and open the door
 *******************************************************************************************************************/
void servoInizialize();
/************ servoDefaultPosition  ********************
Italian
  Remarks:
  Questo metodo è chiamato dalla "fase di init" per controllare
  se il servo è nella posizione di default: porta chiusa.
  Controllerà inizialmente se è fisicamente collegato al pin di Arduino giusto.
  Successivamete se il servo non è in posizione di dafault, verrà spostato.
English
  Remarks:
  This method is called by the "init fase" for control if
  the servo is in default position: door closed.
  Method will check fisical connection to Arduino pin.
  Otherwise if Servo isn't in the default positon, then check what is its angle
  and servo will be moved.
 ***************************************************/
void servoDefaultPosition();
/*********  getPosition *************
  output: open door
  Remarks:
  This function apen the door
**************************************/
void openDoor();
/*********  getPosition *************
  output: Position
  Remarks:
  This function returns the Position(angle).
**************************************/
int getPosition();

#endif
