#include "init.h"

void initApp()
{
  pinMode(LedG_PIN, OUTPUT);
  pinMode(LedR_PIN, OUTPUT);
  pinMode(Servo_PIN, OUTPUT);
  pinMode(Buzzer_PIN, OUTPUT);
  pinMode(NODEMCU_RX_PIN, INPUT);
  pinMode(NODEMCU_TX_PIN, OUTPUT);

  servoDefaultPosition();                                                       // See servoMotor.h
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

void initialPrint()
{
  Serial.begin(SERIAL_BAUD_RATE);                                               // Initialize serial communications with PC
  
  Serial.println("Alohomora 3FA");
  Serial.println("A smart IoT based entrance unlock system");
  Serial.println("");
}

void finalPrint()
{
  Serial.println("Test OK");
  Serial.println("");
}
