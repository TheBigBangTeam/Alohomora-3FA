#include "servo.h"

SERVO servoStream = NULL;                                                       // Pointer to function created in const.h
Servo myServo;

void subscribeSERVO(SERVO func)
{
  servoStream = func;
}

void publishSERVO()
{
  if (servoStream != NULL)
    servoStream();
}

void servoInizialize()
{
  myServo.attach(Servo_PIN);                                                      // Setto il pin per il Servo e i limiti entro cui deve agire
  subscribeSERVO(openDoor);                                                     // the address of the subroutine "SERVO" has been assigned to the pointer
}

void openDoor()
{
  if (getPosition() != 120){
    Serial.println("The Door is just open!!");
  } 
  else{
      myServo.write( 30 );
      blink(5, LedG_PIN);
      blinkBuzzer(5);
      delay(5000);
      myServo.write( 120 );
      subscribeSERVO(NULL);                                                     // the address of the soubroutine "SERVO" has been removed from the pointer
                                                                                // now the function "publishSERVO" can't execute the code of the previous subroutine
      event(MFRC522_READ_CARD_EVENT);                                           // Reset event and Launch MFRC522_READ_CARD_EVENT
  }
}

void servoDefaultPosition()
{
  if (myServo.attach(Servo_PIN) == true){
    if (getPosition() == 120)
    {
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

int getPosition()
{
    return myServo.read();
}
