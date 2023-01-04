// defines pins numbers
#include <NewPing.h>
const int trigPin = 9;
const int echoPin = 8;
int _ = 0;
// defines variables
long duration;
int distance;
NewPing sonar(trigPin, echoPin, 200);
void setup() {
  pinMode(trigPin, OUTPUT); // Sets the trigPin as an Output
  pinMode(echoPin, INPUT); // Sets the echoPin as an Input
  Serial.begin(9600); // Starts the serial communication
}
void loop() {
  delay(50);

  unsigned int uS = sonar.ping();

  digitalWrite(echoPin,LOW);

  pinMode(echoPin,INPUT);

  Serial.print("Ping: ");

  Serial.print(uS / US_ROUNDTRIP_CM);

  Serial.println("cm");
  distance = uS / US_ROUNDTRIP_CM;
  if(distance > 6 or distance < 4){
    _++;
  } else {
    _=0;
  }
  
  if(_>2){
    analogWrite(10, 128);
  } else {
    analogWrite(10, 0);
  }
}