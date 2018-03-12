#ifndef init_H
#define init_H
#include "const.h"
#include "servoMotor.h"
/*****************************************************************
  Remarks:
  Print authors and project name.
******************************************************************/
void initialPrint();
/*****************************************************************
  Remarks:
  Configure the specified pins to behave either as input or output
  and set the baud rate of Serial.
******************************************************************/
void initApp();
/*****************************************************************
  Remarks:
  Leds and Buzzer control.
******************************************************************/
void initialTest();
/*****************************************************************
  Remarks:
  Print finish of test.
******************************************************************/
void finalPrint();

#endif
