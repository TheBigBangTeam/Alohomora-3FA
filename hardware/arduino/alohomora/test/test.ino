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
long serialRfidFeedTime = 2000;
long serialPinFeedTime = 3000;

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
String temp = "";

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
  Serial.println("Pronto a ricevere");
}


void loop() {

  // nodeMCU.println("# pin_on #");
  
  if(nodeMCU.available() > 0){
    Serial.println("CIAO");
    temp = nodeMCU.read();
    Serial.println(temp);
    digitalWrite(Buzzer_PIN, HIGH);
    delay(200);
    digitalWrite(Buzzer_PIN, LOW);
  }
    delay(1000);
}
