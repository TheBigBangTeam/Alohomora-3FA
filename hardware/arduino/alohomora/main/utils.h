#ifndef utils_H
#define utils_H
#include "const.h"

/****************** blink **********************************************************
Italian
Input: variabili intere
@param  count numero di volte che il led deve lampeggiare
        led   pin del led da far lampeggiare
Remarks:
Questo metodo ci permette di far lampeggiare un led per un numero di volte prestabilito

English
Input:  integer variables
@param  count
        led
Remarks:
*************************************************************************************************/
void blink(int count, int led);
/****************** blinkBuzzer **********************************************************
Italian
Input: variabili intere
@param  count numero di volte che il Buzzer deve suonare
Remarks:
Questo metodo ci permette di far suonare il Buzzer per un numero di volte prestabilito

English
Input:  integer variables
@param  count
Remarks:
*************************************************************************************************/
void blinkBuzzer(int count);

#endif
