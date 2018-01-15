/*  Authors: The Big Bang Team
    Project: Alohomora-3FA
    date: 15/01/2018
    Version: Alpha 0.1
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

    Pinout:
    RC522 MODULE    Uno/Nano    
      SS/SDA          D10
      SCK             D13
      MOSI            D11
      MISO            D12
      IRQ             N/A
      GND             GND
      RST             D9
      3.3V            3.3V
*/

/*------------------- Librerie -------------------------*/
//  Importo le librerie necessarie
#include <SPI.h>
#include <MFRC522.h>
#include <Servo.h>

/*------------------ Definizione dei PIN ---------------*/
//  Definisco i PIN del RFID reader
#define SS_PIN 10
#define RST_PIN 9
#define delayRead 1000 // Time of delay 

//  Definisco i PIN dei LED
#define LedV_PIN 7
#define LedR_PIN 8

//  Definisco il PIN del Servo motore
#define Servo_PIN 3

//  Definisco il PIN del Buzzer
#define Buzzer_PIN 2  //Per mancanza di PIN PWM è stato collegato ad uno digitale senza PWM. Verrà attivato come fosse un LED

/*-------------- Creazione Oggetti ---------------------- */
// Creo una istanza della libreria RFID
MFRC522 rc522(SS_PIN, RST_PIN); 

// Creo una istanza della libreria Servo
Servo myServo;  //tramite questo oggetto controllerò il mio Servo motore

int angle = 0;

/*------------------ SETUP ------------------------*/
void setup() {
  Serial.begin(9600);
  SPI.begin(); // Abilito SPI
  rc522.PCD_Init(); // Inizializzo RFID reader
  Serial.println("Arduino RFID lock"); 
  Serial.println("");
  myServo.attach(Servo_PIN); //  Setto il pin per il Servo e i limiti entro cui deve agire
  /*---------- BUZZER TEST ----- */
  pinMode(Buzzer_PIN, OUTPUT);
  digitalWrite(Buzzer_PIN, HIGH);
  delay(200);
  digitalWrite(Buzzer_PIN, LOW);
  Serial.println("Buzzer Tested");
  Serial.println("");
  /*---------- LED TEST -------- */
  pinMode(LedV_PIN, OUTPUT);
  pinMode(LedR_PIN, OUTPUT);
  digitalWrite(LedV_PIN, HIGH);
  delay(500);
  digitalWrite(LedV_PIN, LOW);
  digitalWrite(LedR_PIN, HIGH);
  delay(500);
  digitalWrite(LedR_PIN, LOW);
  Serial.println("LED tested");
  Serial.println("");
   
  Serial.println("Setup OK");
  Serial.println("");
  Serial.println("");
}

void loop() {
  
  /*---------- SERVO RESET ----- */
  myServo.write(10);
  delay(10000);
  myServo.write(0);
  delay(10000);  
  Serial.println("Servo tested and sets to the default position");
  Serial.println("");

}
