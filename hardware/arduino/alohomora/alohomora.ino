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


    Reference:
      -Servo Motor(italian) -->  http://bit.ly/2mJYFjd
      -RFID Mifare rc522 library and doc --> https://github.com/miguelbalboa/rfid
  


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
#include <SoftwareSerial.h>

/*------------------ Definizione dei PIN ---------------*/
//  Definisco i PIN del RFID reader
#define SS_PIN 10
#define RST_PIN 9
#define delayRead 1000 // Time of delay 

//  Definisco i PIN dei LED
#define LedG_PIN 7 // Green LED
#define LedR_PIN 8 // RED LED

//  Definisco il PIN del Servo motore
#define Servo_PIN 3

//  Definisco il PIN del Buzzer
#define Buzzer_PIN 2  //Per mancanza di PIN PWM è stato collegato ad uno digitale senza PWM. Verrà attivato come fosse un LED

/*-------------- Creazione Oggetti ---------------------- */
// Creo una istanza della libreria RFID
MFRC522 mfrc522(SS_PIN, RST_PIN); 

// Creo una istanza della libreria Servo
Servo myServo;  //tramite questo oggetto controllerò il mio Servo motore

//  Creo una istanza della libreria SoftwareSerial
SoftwareSerial nodeMCU(5, 6); // RX, TX
int angle = 0;

/*------------------ SETUP ------------------------*/
void setup() {
  Serial.begin(9600); // Initialize serial communications with PC
  SPI.begin(); // MFRC522 Hardware uses SPI protocol
  mfrc522.PCD_Init(); // Initialize MFRC522 Hardware
  mfrc522.PCD_SetAntennaGain(mfrc522.RxGain_max); //If you set Antenna Gain to Max it will increase reading distance
 
  Serial.println("Arduino RFID lock"); 
  Serial.println("");
  myServo.attach(Servo_PIN); //  Setto il pin per il Servo e i limiti entro cui deve agire
  myServo.write(120); // Imposto la posizione di partenza del Servo. 
  /*---------- BUZZER TEST ----- */
  pinMode(Buzzer_PIN, OUTPUT);
  digitalWrite(Buzzer_PIN, HIGH);
  delay(200);
  digitalWrite(Buzzer_PIN, LOW);
  Serial.println("Buzzer Tested");
  Serial.println("");
  /*---------- LED TEST -------- */
  pinMode(LedG_PIN, OUTPUT);
  pinMode(LedR_PIN, OUTPUT);
  digitalWrite(LedG_PIN, HIGH);
  delay(500);
  digitalWrite(LedG_PIN, LOW);
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
  //Look for new cards
  if ( !mfrc522.PICC_IsNewCardPresent() ){
    return;
  }
  //Select one of the cards
  if ( !mfrc522.PICC_ReadCardSerial() ) {
    return;
  }

  Serial.println("####### Card Detected ########");

  mfrc522.PICC_DumpDetailsToSerial(&(mfrc522.uid));
  
  String rfidCode= "";
  byte letter;
  // Viene caricato il codice della tessera, all'interno di una Stringa
  for( byte i = 0; i < mfrc522.uid.size; i++ ){
     rfidCode.concat(String(mfrc522.uid.uidByte[i], HEX));
     if( i < mfrc522.uid.size-1 ) rfidCode+="-";
  }
  rfidCode.toUpperCase();
  Serial.println("");
  Serial.println("UID tag :");
  Serial.println("'"+ rfidCode + "'");

//in questa parte bisogna inserire il codice che aprirà la porta una volta che nodeMCU ci ha detto che anche il PIN va bene
  if( rfidCode == "2C-7D-7F-39" ){
    Serial.println("Authorized access");
    digitalWrite(LedG_PIN, HIGH);
    delay(1000);
    myServo.write( 30 );
    delay(15000);
    myServo.write( 120 );
    digitalWrite(LedG_PIN, LOW);
  }else{
    Serial.println("Access denied");
    digitalWrite(LedR_PIN, HIGH);
    delay(1000);
    digitalWrite(LedR_PIN, LOW);
  }
  
  delay(1000);
  /*---------- SERVO RESET ----- */
  /*myServo.write(120);
  delay(2000);
  myServo.write(30);
  delay(2000);  
  Serial.println("Servo tested and sets to the default position");
  Serial.println("");
  */

  
}
