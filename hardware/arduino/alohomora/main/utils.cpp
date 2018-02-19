#include "utils.h"

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

void blinkBuzzer(int count)
{
  while (count > 0) {
    digitalWrite(Buzzer_PIN, HIGH);
    delay(500);
    digitalWrite(Buzzer_PIN, LOW);
    delay(500);
    count--;
  }
}
