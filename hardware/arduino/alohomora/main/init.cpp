#include "init.h"

void initApp()
{
  pinMode(LedG_PIN, OUTPUT);
  pinMode(LedR_PIN, OUTPUT);
  pinMode(Servo_PIN, OUTPUT);
  pinMode(Buzzer_PIN, OUTPUT);
  pinMode(NODEMCU_RX_PIN, INPUT);
  pinMode(NODEMCU_TX_PIN, OUTPUT);

  Serial.begin(SERIAL_BAUD_RATE); // Initialize serial communications with PC

  servoDefaultPosition();   // See servo.h
}
void initialTest()
{
  /*-----------
    Buzzer Test
    ------------*/
  digitalWrite(Buzzer_PIN, HIGH);
  delay(200);
  digitalWrite(Buzzer_PIN, LOW);
  Serial.println("Buzzer Tested");
  /*-----------
    Leds Test
    ------------*/
  digitalWrite(LedG_PIN, HIGH);
  delay(500);
  digitalWrite(LedG_PIN, LOW);
  digitalWrite(LedR_PIN, HIGH);
  delay(500);
  digitalWrite(LedR_PIN, LOW);
  Serial.println("LED tested");
}
void finalPrint()
{
  Serial.println("Test OK")
  Serial.println("Setup OK");
  Serial.println("");
}
void initialPrint()
{
  Serial.println("Alohomora 3FA");
  Serial.println("A smart IoT based entrance unlock system which comprises full fledged logging, system security alerts and statistics.")
  Serial.println("Authors: The Big Bang Team " + "Code Version: Alpha 2 " + "Release Date: 28/02/2018")
  Serial.println("");
}
