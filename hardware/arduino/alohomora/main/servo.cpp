#include "servo.h"
#include "utils.h"
// Creo una istanza della libreria Servo
Servo myServo;  //tramite questo oggetto controllerò il mio Servo motore

myServo.attach(Servo_PIN); //  Setto il pin per il Servo e i limiti entro cui deve agire


void servoDefaultPosition()
{
  if (myServo.attach() == true){
    if (getPosition()) == 120){
      Serial.println("Servo is in Default Position");
    } else{
      Serial.println("Actual position of the Servo is: " + myServo.read());
      Serial.println("Positioning Servo in default position....");
      myServo.write(120); // Imposto la posizione di partenza del Servo
    }
  } else
  {
    Serial.println("There is a problem with the Servo, maybe isn't connected. Check cables or servo");
  }
}

void openDoor()
{
  if (getPosition() != 120){
    Serial.println("The Door is just open!!")
  } else{
      myServo.write( 30 );
      blink(5, LedG_PIN);
      blinkBuzzer(5);
      delay(5000);
      myServo.write( 120 );
  }
}

int getPosition()
{
    return myServo.read();
}
