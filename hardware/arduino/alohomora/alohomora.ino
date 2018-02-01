/*  Authors: The Big Bang Team
    Project: Alohomora-3FA
    date: 18/01/2018
    Version: Alpha 1.1
    Link: https://github.com/TheBigBangTeam/Alohomora-3FA
    Arduino version(for prototype): Arduino Nano v3 A000005

    Tramite questo sketch si vuole prendere in input il codice ID da schede rfid, tramite lettore Mifare RC522. L'ID deve essere passato via seriale al NodeMCU che lo processerà e ci restituirà(seriale) lo stato 'accept' o 'failed'(se l'rfid è valido o meno).
    Nel caso di ID valido verrà inviato, tramite seriale, il segnale per abilitare nel NodeMCU l'inserimento del Pin e l'evento di successo verrà segnalato tramite accensione del Led Verde per 2 secondi.
    Nel caso di ID non valido non verrà inviato nulla, in seriale, al NodeMCU e l'evento fallito verrà segnalato tramite accensione del Led Rosso per 2 secondi. Si riparte in questo caso dal main di arduino (loop())
    Dopo l'avvenuto input del pin da parte di NodeMCU ci si aspetta che quest'ultimo mandi in input, in seriale, la comanda o meno di apertura porta. Se non arriva nulla entro 3 secondi, lampeggio led Rosso per 3 volte
    Nel caso di PIN valido nel NodeMCU, varrà azionato il Servo motore per l'apertura della porta. L'evento di successo verrà segnalato tramite il lampeggio per 5 volte del led Verde. Passati 15 secondi verrà riazionato il servo motore per la chiusura della porta.
    Nel caso di PIN non valido nel NodeMCU l'evento di fallimento verrà segnalato tramite il lampeggio del Led Rosso per 5 volte.

    Opzionali:
    Nell'operazione di segnalazione successo o meno convalida PIN da parte del NodeMCU, si può far suonare il Buzzer.

    Reference:
      -Servo Motor(italian) -->  http://bit.ly/2mJYFjd
      -RFID Mifare rc522 library and doc --> https://github.com/miguelbalboa/rfid
      -SPI --> https://www.arduino.cc/en/Reference/SPI

    Pinout RFID module:
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

/*--------------- Definizione variabili globali --------- */
long serialRfidFeedTime = 6000;
long serialPinFeedTime = 5000;

/*--------------- Metodi ---------------  */
//metodo per il lampeggio
void blink(int count, int led)
{
  while (count > 0) {
    digitalWrite(led, HIGH);
    delay(500);
    digitalWrite(led, LOW);
    delay(500);
    count--;
  }
}

/*------------------ SETUP ------------------------*/
void setup() {
  Serial.begin(9600); // Initialize serial communications with PC
  SPI.begin(); // MFRC522 Hardware uses SPI protocol

  nodeMCU.begin(115200); // Inizialize communicatins with nodeMCU

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
  if ( !mfrc522.PICC_IsNewCardPresent() ) {
    return;
  }
  //Select one of the cards
  if ( !mfrc522.PICC_ReadCardSerial() ) {
    return;
  }

  Serial.println("####### Card Detected ########");

  mfrc522.PICC_DumpDetailsToSerial(&(mfrc522.uid));

  String rfidCode = "";
  byte letter;
  // Viene caricato il codice della tessera diviso in blocchi esadecimali da 2 separati da un "-"(trattino), all'interno di una Stringa
  for ( byte i = 0; i < mfrc522.uid.size; i++ ) {
    rfidCode.concat(String(mfrc522.uid.uidByte[i], HEX));
    if ( i < mfrc522.uid.size - 1 ) rfidCode += "-";
  }
  rfidCode.toUpperCase();
  Serial.println("");
  Serial.println("UID tag :");
  Serial.println("# " + rfidCode + " #");
  nodeMCU.println("# " + rfidCode + " #"); //  Stampo nella seriale di nodeMCU l'uid della carta rfid letta

  unsigned long startTime1 = millis(); // Variabile per tenere il tempo
  String nodeMCUfeedRfid = ""; // variabile dove salvare il feedback da nodeMCU per l'rfid
  String nodeMCUfeedPin = ""; // Stringa per memorizzare il feedback da nodeMCU per il pin

  /*---- Ciclo per attendere la verifica dell'Rfid e orario per 2 secondi ----------- */
  do { // fino a quando startTime non arriva a 2 secondi trascorsi cicla. QUesto serve per attendere la ricezione del feeedback da parte del nodeMCU
    if (nodeMCU.available() > 0) { //è arrivato qualche carattere?
      nodeMCUfeedRfid = nodeMCU.read(); //  Legge la seriale da nodeMCU
      if ( nodeMCUfeedRfid == 'ok_rfid_and_time') { //  Se arriva la conferma di rfid e orario corretti allora....
        nodeMCU.println("# pin_on #");  //  Dato che l'rfid è OK mando il comando per accendere il PIN
        Serial.println(nodeMCUfeedRfid);  //  Stampo la risposta, in questo caso corretta
        digitalWrite(LedG_PIN, HIGH); //  Accendo il led verde per 2 secondi per dare conferma visiva
        delay(2000);
        digitalWrite(LedG_PIN, LOW);
        digitalWrite(Buzzer_PIN, HIGH);
        delay(200);
        digitalWrite(Buzzer_PIN, LOW);
      }
      if ( nodeMCUfeedRfid == 'wrong_rfid_or_time') {
        Serial.println(nodeMCUfeedRfid);  //  Stampo la risposta, in questo caso errata
        digitalWrite(LedR_PIN, HIGH);
        delay(2000);  //  Accendo il led Rosso per 2 secondi per dare errore visivo
        digitalWrite(LedR_PIN, LOW);
        Serial.println("Reset");
        return loop();  //  Ricomincio da capo
      }
    }
  } while (startTime1 + serialRfidFeedTime > millis());
  //  Se è passato il tempo limite per aspettare una risposta dal nodeMCU, resetta e torna all'inizio del loop
  if (startTime1 + serialRfidFeedTime <= millis()) {
    Serial.println("nodeMCU impiega troppo tempo per rispondere la conferma dell'rfid...");
    Serial.println("Reset");
    return loop();  //commentare per test *********

  }
  /*---- Ora si aspetta finchè il nodeMCU non manda la risposta del controllo pin giusto o errato */
  unsigned long startTime2 = millis();  //  Variabile per contare il tempo massimo per aspettare una risposta da nodeMCU per conferma PIN
  while ( !nodeMCU.available() > 0) { //  Finchè non è disponibile nulla in seriale...
    if (millis() - startTime2 > serialPinFeedTime) { //  Se il tempo massimo scade allora si ricomincerà tutto da capo
      Serial.println("nodeMCU impiega troppo tempo per rispondere la conferma pin...");
      Serial.println("Reset");
      blink(3, LedR_PIN);
      return loop();
    } else {
      Serial.println("Aspetto...");
    }
  }

  nodeMCUfeedPin = nodeMCU.read();

  if (nodeMCUfeedPin == "ok_pin") {
    Serial.println("Authorized access");
    myServo.write( 30 );
    blink(5, LedG_PIN);
    delay(10000);
    myServo.write( 120 );
  } else {
    Serial.println("Access denied");
    blink(5, LedR_PIN);
  }

  delay(1000);
  /* // Con questi cicli if avremmo tutto quello stampato in seriale nella seriale del nodemCU e quello che arriva dal nodeMCU stampato in seriale
    if (nodeMCU.available()) {
     Serial.write(nodeMCU.read());
    }
    if (Serial.available()) {
     nodeMCU.write(Serial.read());
    }
  */
}
