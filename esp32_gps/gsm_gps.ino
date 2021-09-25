#define MODEM_RST 5
#define MODEM_PWKEY 4
#define MODEM_POWER_ON 23
#define MODEM_TX 27
#define MODEM_RX 26
#define I2C_SDA 21
#define I2C_SCL 22
#define TINY_GSM_MODEM_SIM800
#define SerialMon Serial
#define SerialAT Serial1

#include <Arduino.h>
#include <SoftwareSerial.h>
#include <Wire.h>
#include <Adafruit_ADXL345_U.h>
#include <Adafruit_Sensor.h>
#include <TinyGsmClient.h>
#include <ArduinoHttpClient.h>
Adafruit_ADXL345_Unified accel = Adafruit_ADXL345_Unified();
float a;
// gps
#include <TinyGPS++.h>
long last = 0;
long last2 = 0;
TinyGPSPlus gps;
#define RXPin 2
#define TXPin 15

const char apn[] = "internet";
const char user[] = "";
const char pass[] = "";

const char FIREBASE_HOST[] = "vann-53570.firebaseio.com";
const String FIREBASE_AUTH = "LC6fDYVqNO7VVBfoymADdWtLZVl6jr6WVJxhONrF";
const String FIREBASE_PATH = "/haha/";
const int SSL_PORT = 443;

String months, yeara, days, hours, mi, se;
String lat, lo, sed;

TinyGsm modem(SerialAT);
TinyGsmClientSecure gsm_client_secure_modem(modem, 0);
HttpClient http_client = HttpClient(gsm_client_secure_modem, FIREBASE_HOST, SSL_PORT);
unsigned long previousMillis = 0;
long interval = 10000;
void putToFirebase(const char *method, const String &path, const String &data, HttpClient *http);
void postToFirebase(const char *method, const String &path, const String &data, HttpClient *http);

static const uint32_t GPSBaud = 9600;
SoftwareSerial ss(RXPin, TXPin);
unsigned int move_index = 1;

void ADXL345(); // ham cho gia toc
void checkGPS();
void vitri();
void check_connect();
void get_time();
void setup()
{

  Serial.begin(9600);
    ss.begin(9600);
  delay(10);
  Wire.begin(I2C_SDA, I2C_SCL);
  pinMode(MODEM_PWKEY, OUTPUT);
  pinMode(MODEM_RST, OUTPUT);
  pinMode(MODEM_POWER_ON, OUTPUT);

  digitalWrite(MODEM_PWKEY, LOW);
  digitalWrite(MODEM_RST, HIGH);
  digitalWrite(MODEM_POWER_ON, HIGH);
  SerialAT.begin(115200, SERIAL_8N1, MODEM_RX, MODEM_TX);
  delay(3000);
  SerialMon.println("Initializing modem...");
  modem.restart();
  String modemInfo = modem.getModemInfo();
  SerialMon.print("Modem: ");
  SerialMon.println(modemInfo);
  SerialMon.print("Waiting for network...");
  if (!modem.waitForNetwork(240000L))
  {
    SerialMon.println(" fail");
    delay(10000);
    return;
  }
  SerialMon.println(" OK");

  if (modem.isNetworkConnected())
  {
    SerialMon.println("Network connected");
  }

  SerialMon.print(F("Connecting to APN: "));
  SerialMon.print(apn);
  if (!modem.gprsConnect(apn, user, pass))
  {
    SerialMon.println(" fail");
    delay(10000);
    return;
  }
  SerialMon.println(" OK");

  // ADXL345
  // if (!accel.begin(0x53))
  // {
  //   Serial.println("No ADXL345 sensor detected.");
  //   while (1)
  //     ;
  // }
}
void loop()
{
  Serial.print(F("Connecting to "));
  Serial.print(apn);
  if (!modem.gprsConnect(apn, user, pass))
  {
    Serial.println(" fail");
    delay(1000);
    return;
  }
  Serial.println(" OK");
  http_client.connect(FIREBASE_HOST, SSL_PORT);
  while (true)
  {
    if (!http_client.connected())
    {
      Serial.println();
      http_client.stop(); // Shutdown
      Serial.println("HTTP  not connect");
      break;
    }
    else
    {

    
      checkGPS();
      if (millis() - last >= 50000)
      {
        vitri();

        last = millis();
      }
      if (millis() - last2 >= 1000)

      {
        get_time();
        lat = String(gps.location.lat(), 6);
        lo = String(gps.location.lng(),6);
        sed = gps.speed.kmph();

        String gpsData = "{";
        gpsData += "\"LA\":" +lat+ ",";
        gpsData += "\"LO\":" +lo+",";
        gpsData += "\"TIME\":" + hours + mi + se + ",";
        gpsData += "\"Date\":" + days + months+yeara+",";
        gpsData += "\"SP\":" + sed +"";
        gpsData += "}";
        putToFirebase("/", "/GPS4/", gpsData, &http_client);

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
  }
}

// cam bien gia toc
void ADXL345()
{
  sensors_event_t event;
  accel.getEvent(&event);

  a = sqrt(event.acceleration.x * event.acceleration.x * 0.0078 + event.acceleration.y * event.acceleration.y * 0.0078 + event.acceleration.z * event.acceleration.z * 0.0078);
  if (a > 1.2)
  {
    // json2.set("Latitude", gps.location.lat());
    // json2.set("Longitude", gps.location.lng());
    // json2.set("Time", timeStamp);
    // json2.set("Date", dayStamp);
    // json2.set("Speed", gps.speed.kmph());
    // Firebase.setFloat(firebaseData, "/ecall", a);
    // Firebase.pushJSON(firebaseData, "/GPS2/", json2);

    String gpsData = "{";
    gpsData += "\"Latitude\":" + lat + ",";
    gpsData += "\"Longitude\":" + lo + ",";
    gpsData += "\"Time\":" + hours + mi + se +",";
    gpsData += "\"Date\":" + days + months + yeara+",";
    gpsData += "\"Speed\":" +sed +"";
    gpsData += "}";
    postToFirebase("/", "/GPS2/", gpsData, &http_client);
  }
  Serial.print("giatria");
  Serial.println(a);
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
    Serial.println(longitude);
    String gpsData = "{";
    gpsData += "\"Latitude\":" +lat+ ",";
    gpsData += "\"Longitude\":" +lo+ ",";
    gpsData += "\"Time\":" + hours + mi + se +",";
    gpsData += "\"Date\":" + days + months + yeara +",";
    gpsData += "\"Speed\":" + sed +"";
    gpsData += "}";
    postToFirebase("/", "/GPS3/", gpsData, &http_client);
  }
}

void putToFirebase(const char *method, const String &path, const String &data, HttpClient *http)
{
  String response;
  int statusCode = 0;
  http->connectionKeepAlive(); // Currently, this is needed for HTTPS

  String url;
  if (path[0] != '/')
  {
    url = "/";
  }
  url += path + ".json";
  url += "?auth=" + FIREBASE_AUTH;
  Serial.print("POST:");
  Serial.println(url);
  Serial.print("Data:");
  Serial.println(data);

  String contentType = "CONTENT";
  http->put(url, contentType, data);

  statusCode = http->responseStatusCode();
  Serial.print("Status code: ");
  Serial.println(statusCode);
  response = http->responseBody();
  Serial.print("Response: ");
  Serial.println(response);
  if (!http->connected())
  {
    Serial.println();
    http->stop(); // Shutdown
    Serial.println("HTTP POST disconnected");
  }
}
void postToFirebase(const char *method, const String &path, const String &data, HttpClient *http)
{
  String response;
  int statusCode = 0;
  http->connectionKeepAlive(); // Currently, this is needed for HTTPS

  String url;
  if (path[0] != '/')
  {
    url = "/";
  }
  url += path + ".json";
  url += "?auth=" + FIREBASE_AUTH;
  Serial.print("POST:");
  Serial.println(url);
  Serial.print("Data:");
  Serial.println(data);
  String contentType = "CONTENT";
  http->post(url, contentType, data);
  statusCode = http->responseStatusCode();
  Serial.print("Status code: ");
  Serial.println(statusCode);
  response = http->responseBody();
  Serial.print("Response: ");
  Serial.println(response);
  if (!http->connected())
  {
    Serial.println();
    http->stop(); // Shutdown
    Serial.println("HTTP POST disconnected");
  }
}
void get_time()
{
  String timea = modem.getGSMDateTime(DATE_FULL);
  String loca = modem.getGsmLocation();
  Serial.println(loca);
  int splitT = timea.indexOf(",");
  String dayStamp = timea.substring(0, splitT);
  //day
  int t = dayStamp.indexOf("/");
  months = dayStamp.substring(0, t);
  String d2 = dayStamp.substring(t + 1);
  int t1 = d2.indexOf("/");
  yeara = d2.substring(0, t1);
  days = d2.substring(t1 + 1);
  //time
  String timeaa = timea.substring(splitT + 1);
  int ti = timeaa.indexOf("+");
  String time_a = timeaa.substring(0, ti);
  int ti2 = time_a.indexOf(":");
   hours = time_a.substring(0, ti2);
  String hourss = time_a.substring(ti2 + 1);
  int ti3 = hourss.indexOf(":");
   mi = hourss.substring(0, ti3);
   se = hourss.substring(ti3 + 1);

  Serial.println(hours);
  Serial.println(mi);
  Serial.println(se);
}
