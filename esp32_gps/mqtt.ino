#define TINY_GSM_MODEM_SIM800
#include <SoftwareSerial.h>
#include <TinyGsmClient.h>
#include <PubSubClient.h>
SoftwareSerial SerialAT(7,8); // RX, TX
//Network details
const char apn[]  = "internet";
const char user[] = "";
const char pass[] = "";
// MQTT details
const char* broker = "m16.cloudmqtt.com";
const int mqtt_port = 15879;
const char *mqtt_user = "crlyrryq";
const char *mqtt_pass = "J1fdZXSDRxq5";
const char* topicOut = "guiDl";
const char* topicIn = "nhanDl";
TinyGsm modem(SerialAT);
TinyGsmClient client(modem);
PubSubClient mqtt(client);
void setup()
{
Serial.begin(9600);
SerialAT.begin(9600);
Serial.println("Clb IoT Thành Phố Hồ Chí Minh");
modem.restart();
Serial.println("Modem: " + modem.getModemInfo());
if(!modem.waitForNetwork())
{
Serial.println("loi...!");
while(true);
}
Serial.println("Chất lượng tín hiệu: " + String(modem.getSignalQuality()));
Serial.println("Kết nối mạng Internet!");
if (!modem.gprsConnect(apn, user, pass))
{
Serial.println("Loi...!");
while(true);
}
Serial.println("Kết nối GPRS với Apn nhà mạng: " + String(apn));
mqtt.setServer(broker, mqtt_port);
mqtt.setCallback(mqttCallback);
Serial.println("Kết nối MQTT: " + String(broker));
while(mqttConnect()==false) continue;
Serial.println();
}
void loop()
{
if(Serial.available())
{
delay(10);
String message="";
while(Serial.available()) message+=(char)Serial.read();
mqtt.publish(topicOut, message.c_str());
}
if(mqtt.connected())
{
mqtt.loop();
}
}
boolean mqttConnect()
{
if(!mqtt.connect("mqtt_gsm_client_name", mqtt_user, mqtt_pass))
{
Serial.print(".");
return false;
}
Serial.println("Kết nối thành công!");
mqtt.subscribe(topicIn);
return mqtt.connected();
}
void mqttCallback(char* topic, byte* payload, unsigned int len)
{
Serial.print(topic);
Serial.print(": ");
Serial.write(payload, len);
Serial.println();
}
