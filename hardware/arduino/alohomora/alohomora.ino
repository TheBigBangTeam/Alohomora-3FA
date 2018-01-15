/*  Authors: The Big Bang Team
    Project: Alohomora-3FA
    Link: https://github.com/TheBigBangTeam/Alohomora-3FA
    Arduino version(for prototype): Arduino Nano v3 A000005

    Tramite questo sketch si vuole prendere in input il codice ID da schede rfid, tramite lettore Mifare RC522. L'ID deve essere passato via seriale al NodeMCU che lo processerà e ci restituirà(seriale) lo stato 'accept' o 'failed'(se l'rfid è valido o meno).
    Nel caso di ID valido tramite seriale verrà inviato, tramite seriale, il segnale per abilitare nel NodeMCU l'inserimento del Pin e l'evento di successo verrà segnalato tramite accensione del Led Verde per 3 secondi.
    Nel caso di ID non valido non verrà inviato nulla, in seriale, al NodeMCU e l'evento fallito verrà segnalato tramite accensione del Led Rosso per 3 secondi.
    Dopo l'avvenuto input del pin da parte di NodeMCU ci si aspetta che quest'ultimo mandi in input, in seriale, la comanda o meno di apertura porta.
    Nel caso di PIN valido nel NodeMCU, varrà azionato il Servo motore per l'apertura della porta. L'evento di successo verrà segnalato tramite il lampeggio del Led Verde per 3 secondi. Passati 15 secondi verrà riazionato il servo motore per la chiusura della porta.
    Nel caso di PIN non valido nel NodeMCU l'evento di fallimento verrà segnalato tramite il lampeggio del Led Rosso per 3 secondi.



    Opzionali:
    Nell'operazione di segnalazione successo o meno convalida PIN da parte del NodeMCU, si può far suonare il Buzzer.

*/
include 

void setup() {
  // put your setup code here, to run once:

}

void loop() {
  // put your main code here, to run repeatedly:

}
