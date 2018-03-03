#include "servoMotor.h"

SERVO servoStream = NULL;                                                       // Pointer to function created in const.h

Servo myServo;

void subscribeSERVO(SERVO func)
{
  servoStream = func;
}

void publishSERVO()
{
  if (servoStream != NULL){
    servoStream();
  }
}

void servoInizialize()
{
  myServo.attach(Servo_PIN);                                                      // Setto il pin per il Servo e i limiti entro cui deve agire
  subscribeSERVO(openDoor);                                                     // the address of the subroutine "SERVO" has been assigned to the pointer
}

void openDoor()
{
  if ((getPosition()) != 120){
    Serial.println("The Door is just open!!");
  } 
  else{
      myServo.write(30);
      blink(5, LedG_PIN);
      blinkBuzzer(5);
      delay(5000);
      myServo.write(120);
      //myServo.detach();
      subscribeSERVO(NULL);                                                     // the address of the soubroutine "SERVO" has been removed from the pointer
                                                                                // now the function "publishSERVO" can't execute the code of the previous subroutine
      event(MFRC522_READ_CARD_EVENT);                                           // Reset event and Launch MFRC522_READ_CARD_EVENT
  }
}

void servoDefaultPosition()
{
  myServo.attach(Servo_PIN);
  Serial.println(getPosition());                                                // Ritorna 93 all'accensione
  if (myServo.attached()){
    if ((getPosition()) == 120)                                                 // getPosition() restituisce sempre 93 che dovrebbe essere la posizione metà per il servo. Consultare --> http://bit.ly/2mJYFjd
    {
      Serial.println("Servo is in Default Position");
      myServo.detach();
    } else{
      myServo.write(120);                                                       // Imposto la posizione di partenza del Servo
      delay(500);
      Serial.println("Maybe, Servo isn't in default position");                 // Se i println vengono posizinati prima del .write(120) il servo tenta di tornare in posizione 93 per poi essere riforzato a 120
      Serial.println("Positioning Servo in default position....");
      delay(100);
      Serial.println(getPosition());
    }
  } else
  {
    Serial.println("There is a problem with the Servo, maybe isn't connected. Check cables or servo");
    myServo.detach();
  }
}

int getPosition()
{
    return myServo.read();                                                      // see servoMotor.h
}
