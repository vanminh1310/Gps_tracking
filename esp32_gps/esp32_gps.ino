// Interfacing Arduino with NEO-6M GPS module

#include <TinyGPS++.h>           // Include TinyGPS++ library

#define RXD2 16
#define TXD2 17
#include<WiFi.h>
const int touchPin = 12;
int touchValue;
#include <FirebaseESP32.h>



#define FIREBASE_HOST "vann-53570.firebaseio.com" // ten host cua firebase
#define FIREBASE_AUTH "LC6fDYVqNO7VVBfoymADdWtLZVl6jr6WVJxhONrF" // ma dôi cái này nữa
#define WIFI_SSID "joy" //cái này nữa
#define WIFI_PASSWORD "12345678"// đây nữa
FirebaseData firebaseData; // firebase datb
long last = 0;

TinyGPSPlus gps;

HardwareSerial gps_serial(2);
FirebaseJson json;

void setup(void) {

  Serial.begin(9600);
  Serial2.begin(9600, SERIAL_8N1, RXD2, TXD2);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");

  }
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  last = millis();

}

void loop() {


  touchValue = touchRead(touchPin);
  Serial.print(touchValue);

  if (gps.encode(Serial2.read())) {

    if (gps.location.isValid()) {





      Serial.print("Latitude   = ");

      Serial.println(gps.location.lat(), 6);
      // Firebase.setFloat(firebaseData, "GPS/LOC", gps.location.lat());

      Serial.print("Longitude  = ");

      Serial.println(gps.location.lng(), 6);
      //Firebase.setFloat(firebaseData, "GPS/LOC2", gps.location.lng());

      json.set("Latitude", gps.location.lat());
      json.set("Longitude", gps.location.lng());

    }

    else

      Serial.println("Location Invalid");

    if (gps.altitude.isValid()) {

      Serial.print("Altitude   = ");


      Serial.print(gps.altitude.meters());
      json.set("Altitude", gps.altitude.meters());


      Serial.println(" meters");

    }

    else

      Serial.println("Altitude Invalid");

    if (gps.speed.isValid()) {

      Serial.print("Speed      = ");

      Serial.print(gps.speed.kmph());
      json.set("Speed", gps.speed.kmph());

      Serial.println(" kmph");

    }

    else

      Serial.println("Speed Invalid");

    if (gps.time.isValid()) {

      Serial.print("Time (GMT) : ");

      if (gps.time.hour() < 10)     Serial.print("0");

      Serial.print(gps.time.hour() + 7);
      json.set("Time", (gps.time.hour() + 7));

      Serial.print(":");

      if (gps.time.minute() < 10)   Serial.print("0");

      Serial.print(gps.time.minute());
      json.set("minute", (gps.time.minute() + 0));

      Serial.print(":");

      if (gps.time.second() < 10)   Serial.print("0");

      Serial.println(gps.time.second());

      json.set("Second", (gps.time.second() + 0));
    }

    else

      Serial.println("Time Invalid");

    if (gps.date.isValid()) {

      Serial.print("Date       : ");

      if (gps.date.day() < 10)      Serial.print("0");

      Serial.print(gps.date.day());

      Serial.print("/");

      if (gps.date.month() < 10)    Serial.print("0");

      Serial.print(gps.date.month());

      Serial.print("/");

      Serial.println(gps.date.year());

      json.set("Date", gps.date.day() + 0);
      json.set("month", gps.date.month() + 0);
      json.set("year", gps.date.year() + 0);


    }

    else

      Serial.println("Date Invalid");

    if (gps.satellites.isValid()) {

      Serial.print("Satellites = ");

      Serial.println(gps.satellites.value());

    }

    else

      Serial.println("Satellites Invalid");



    Serial.println("gui du lieu");
    if (touchValue < 20) {
      Firebase.pushJSON(firebaseData, "/GPS2/", json);
      Firebase.setInt(firebaseData, "/ecall/", touchValue);

    } 
    else {
      Firebase.pushJSON(firebaseData, "/GPS/", json);
       Firebase.setInt(firebaseData, "/ecall/", touchValue);
    }

  }




}
