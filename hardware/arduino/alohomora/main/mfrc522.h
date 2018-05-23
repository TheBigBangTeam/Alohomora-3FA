#ifndef mfrc522_H
#define mfrc522_h
#include "const.h"
#include "eventSwitcher.h"
#include "nodeMcu.h"
#include "utils.h"
#include <SPI.h>
#include <MFRC522.h>
#include <require_cpp11.h>
#include <deprecated.h>
#include <SoftwareSerial.h>

/************** Declaration of global variables **********/
extern String rfidCode;

/****************************************   subscribeMFRC522_Data  ***************************************************
  input: function in MFRC522_Data
  @param *MFRC522_Data func:
  - enabled when the GPS localization phase begins;
  - disabled when the previous phase is completed
  Remarks:
  Questo metodo consente al puntatore di richiamare la funzione passata come argomento.
    In altre parole, se abbiamo precedentemente definito una subroutine che viene chiamata quando si verifica una condizione specifica,
    siamo in grado di eseguire le istruzioni elencate nella subroutine.
    In effetti, l'implementazione più semplice di un puntatore a funzione è una variabile che contiene l'indirizzo della subroutine
    all'interno della memoria eseguibile.
    Grazie a questa caratteristica C, possiamo ottenere un modello di abbonamento-pubblicazione; quindi, la funzione 'loop' di Arduino controllerà
    continuamente il contenuto del puntatore. Se non è stato specificato alcun indirizzo di subroutine, il programma procederà con il successivo
    l'istruzione; in caso contrario, verrà eseguito il codice definito nella funzione.
    Per rendere più comprensibile il processo precedente, abbiamo utilizzato il prefisso 'sub' all'inizio del
    nome della funzione che ha il ruolo di abbonato (come suggerisce il termine).
    Il prefisso 'pub' associato al nome della subroutine indica che la funzione ha il ruolo di editore; il
    quest'ultimo verificherà continuamente il contenuto del puntatore e, se è stato aggiunto un indirizzo di subroutine, verrà eseguito
    il codice corrispondente.


  This method allows the pointer to invoke the function passed as argument.
  In other words, if we have previously defined a subroutine which is called when a specific condition occurs,
  we are able to execute the instructions listed in the subroutine.
  Indeed, the simplest implementation of a function pointer is a variable containing the address of the subroutine
  within executable memory.
  Thanks to this C-feature, we can achieve a publish-subscribe model; thus, the 'loop' function of Arduino will check
  continuosly the pointer content. If no subroutine address has been specified, the program will proceed with the next
  instruction; otherwise, the code defined in the function will be executed.
  In order to make the previous process easier to understand, we used the prefix 'sub' at the beginning of the
  function name which has the role of subscriber (as the term suggests).
  The prefix 'pub' associated with the subroutine name states that the function has the role of publisher; the
  latter will verify continuously the pointer content and, if a subroutine address has been added, it will execute
  the corresponding code.
 ******************************************************************************************************************/
void subscribeMFRC522_Data(MFRC522_Data func);
/***************************************    publishMFRC522_Data   ***************************************************
  Remarks:
  This method, as already mentioned, will be inclued in the 'loop' function of Arduino and will check continuosly
  the pointer content associated with the 'subscribeMFRC522_Data(MFRC522_Data func)' subroutine.
 *******************************************************************************************************************/
void publishMFRC522_Data();
/***************************** MFRC522inizialize   *********************
  Remarks:
  This method is called by eventSwitcher for subscribe MFRC522 function
 ***********************************************************************/
void MFRC522inizialize();
/*********************** waitForRfidTag  ************************
  Remarks:
  This method is called by "main" for wait TAG on mfrc522 module
 ****************************************************************/
void waitForRfidTag();
/******************* readTag  *****************************
  Remarks:
  This method is called for read unique code from Rfid TAG
 **********************************************************/
void readTag();
/******************* showNewDataTag  *****************************
  Remarks:
  This is the last method and it is used for print a Rfid.
  When this method is called the MFRC522 event will be terminated
 *****************************************************************/
void showNewDataTag();

#endif
