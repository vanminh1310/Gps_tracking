#include <Arduino.h>
#include <WiFi.h>
#include <WiFiManager.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <SoftwareSerial.h>
#include <Wire.h>
#include <NTPClient.h>
#include <WiFiUdp.h>

// nhip tim
#include "MAX30105.h"
MAX30105 particleSensor;

#define SCREEN_WIDTH 128 // OLED display width, in pixels
#define SCREEN_HEIGHT 64 // OLED display height, in pixels
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);
// Gia toc
#include <Adafruit_ADXL345_U.h>
#include <Wire.h>
#include <Adafruit_Sensor.h>
Adafruit_ADXL345_Unified accel = Adafruit_ADXL345_Unified();
float a;
// gps
#include <TinyGPS++.h>
long last = 0;
long last2 = 0;
TinyGPSPlus gps;
#define RXPin 13
#define TXPin 14
static const uint32_t GPSBaud = 9600;
SoftwareSerial ss(RXPin, TXPin);
unsigned int move_index = 1;
//firebase
#include <FirebaseESP32.h>
#define FIREBASE_HOST "vann-53570.firebaseio.com"                // ten host cua firebase
#define FIREBASE_AUTH "LC6fDYVqNO7VVBfoymADdWtLZVl6jr6WVJxhONrF" // ma dôi cái này nữa
FirebaseData firebaseData;                                       // firebase datb
FirebaseJson json;
FirebaseJson json2;
// time

WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "pool.ntp.org", 7 * 3600);
String formattedDate;
String dayStamp;
String timeStamp;

void hello();   // ham cho oled
void ADXL345(); // ham cho gia toc
void max30105();
void checkGPS();
void vitri();
void setup()
{

  Wire.begin(5, 4);
  WiFi.mode(WIFI_STA);
  Serial.begin(9600);
  if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C))
  {
    Serial.println(F("SSD1306 allocation failed"));
    for (;;)
      ;
  }

  delay(1000);
  display.clearDisplay();
  display.setTextColor(WHITE);
  hello();
  WiFiManager wm;
  bool res;
  res = wm.autoConnect("ITS"); // đặt tên wifi // nếu đặt có mật khẩu sẽ có dạng sau  // res = wm.autoConnect("Smarthome","password"); // password protected ap
  hello();
  if (!res)
  {
    Serial.println("Failed to connect");
  }
  else
  {
    //if you get here you have connected to the WiFi
    Serial.println("Connected...yeey :)");
  }
  // ADXL345
  if (!accel.begin(0x53))
  {
    Serial.println("No ADXL345 sensor detected.");
    while (1)
      ;
  }
  //  nhip tim
  if (particleSensor.begin(Wire, I2C_SPEED_FAST) == false) //Use default I2C port, 400kHz speed
  {
    Serial.println("MAX30105 was not found. Please check wiring/power. ");
    while (1)
      ;
  }
  particleSensor.setup(0);
  particleSensor.enableDIETEMPRDY();
  ss.begin(9600);
  timeClient.begin();

  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  last = millis();
  last2 = millis();
}
void loop()
{
  timeClient.update();
   //Firebase.setFloat(firebaseData, "/ecall", a);

  ADXL345();
  max30105();

  timeStamp = timeClient.getFormattedTime();
  formattedDate = timeClient.getFormattedDate();
  int splitT = formattedDate.indexOf("T");
  dayStamp = formattedDate.substring(0, splitT);
  Serial.println(dayStamp);
  Serial.println(timeStamp);

  if (millis() - last >= 50000)
  {
    vitri();

    last = millis();
  }
  if (millis() - last2 >= 1000)
  {
    Firebase.setFloat(firebaseData, "/GPS4/LA", gps.location.lat());
    Firebase.setFloat(firebaseData, "/GPS4/LO", gps.location.lng());
    Firebase.setString(firebaseData, "/GPS4/TIME", timeStamp);
    Firebase.setFloat(firebaseData, "/GPS4/SP", gps.speed.kmph());
    Firebase.setFloat(firebaseData, "/ecall", a);
    last2 = millis();
  }
  while (ss.available() > 0)
  {
    if (gps.encode(ss.read()))
    {
      Serial.println("GPS");
    }
  }
}

void hello()
{
  display.clearDisplay();
  display.setTextSize(1.5);
  display.setCursor(15, 10);
  display.print("GPS TRACKING");
  display.setTextSize(1.5);
  display.setCursor(35, 30);
  display.print("ITS59");
  display.setTextSize(0.5);
  display.setCursor(35, 50);
  display.print("Disconnect");
  display.display();
}
// cam bien gia toc
void ADXL345()
{
  sensors_event_t event;
  accel.getEvent(&event);
  // Serial.print("X: ");
  // Serial.print(event.acceleration.x);
  // Serial.print("  ");
  // Serial.print("Y: ");
  // Serial.print(event.acceleration.y);
  // Serial.print("  ");
  // Serial.print("Z: ");
  // Serial.print(event.acceleration.z);
  // Serial.print("  ");
  // Serial.println("m/s^2 ");
  a = sqrt(event.acceleration.x * event.acceleration.x * 0.0078 + event.acceleration.y * event.acceleration.y * 0.0078 + event.acceleration.z * event.acceleration.z * 0.0078);
  if (a > 1.2)
  {
    json2.set("Latitude", gps.location.lat());
    json2.set("Longitude", gps.location.lng());
    json2.set("Time", timeStamp);
    json2.set("Date", dayStamp);
    json2.set("Speed", gps.speed.kmph());
Firebase.setFloat(firebaseData, "/ecall", a);
    Firebase.pushJSON(firebaseData, "/GPS2/", json2);
  }    
  Serial.print("giatria");
  Serial.println(a);
}
void max30105()
{
  float temperature = particleSensor.readTemperature();
  Serial.print("temperatureC=");
  Serial.print(temperature, 4);

  display.clearDisplay();

  // display temperature
  display.setTextSize(1);
  display.setCursor(0, 0);
  display.print("Temperature: ");
  display.setTextSize(2);
  display.setCursor(0, 10);
  display.print(temperature);
  display.print(" ");
  display.setTextSize(1);
  display.cp437(true);
  display.write(167);
  display.setTextSize(2);
  display.print("C");

  // display Heartbeat
  display.setTextSize(1);
  display.setCursor(0, 35);
  display.print("Speed: ");
  display.setTextSize(2);
  display.setCursor(0, 45);
  display.print(gps.speed.kmph());
  display.print(" ");
  display.display();
}
void checkGPS()
{
  if (gps.charsProcessed() < 10)
  {
    Serial.println(F("No GPS detected: check wiring."));
  }
}
void vitri()
{
  if (gps.location.isValid())
  {
    float latitude = (gps.location.lat()); //Storing the Lat. and Lon.
    float longitude = (gps.location.lng());
    Serial.println(latitude);
    json.set("Latitude", latitude);
    json.set("Longitude", longitude);
    json.set("Time", timeStamp);
    json.set("Date", dayStamp);
    json.set("Speed", gps.speed.kmph());
    Firebase.pushJSON(firebaseData, "/GPS3/", json);
  }
}