#include <ArduinoWebsockets.h>
#include <ESP8266WiFi.h>

const char* ssid = "Kusina 2.0";                       //Enter SSID
const char* password = "jydgwapo";                     //Enter Password
const char* websockets_server_host = "192.168.86.21";  //Enter server adress
const uint16_t websockets_server_port = 8080;          // Enter server port
const String clientId = "UNIT_01";
const String name = "Unit 1";

using namespace websockets;

WebsocketsClient client;

#define SENSOR A0
#define BUZZER D5
#define VALVE D6

const int MAX_ALARM_COUNTER = 3;
const int SENSOR_THRESHOLD = 500;

int sensorValue = 0;
int counter;                    // Turns serverConnected into false when value is less than 1
int alarmCounter = 0;           // Activates the buzzer when it reaches 3 (MAX_ALARM_COUNTER)
bool serverConnected = false;   // Flag for the connection of the unit to the server
bool valveStatus = true;        // Since the solenoid valve is normally closed, it will be initialized to be opened

void onMessageCallback(WebsocketsMessage message) {
  Serial.print("Got Message: ");
  Serial.println(message.data());
}

void onEventsCallback(WebsocketsEvent event, String data) {
  if (event == WebsocketsEvent::ConnectionOpened) {
    serverConnected = true;
    counter = 10;
    Serial.println("Connnection Opened");
    client.send("{'type':'register', 'data':{'clientId':'" + clientId + "', 'type':'arduino', 'name':'" + name + "', 'sensorValue':0}}");
  } else if (event == WebsocketsEvent::ConnectionClosed) {
    Serial.println("Connnection Closed");
    serverConnected = false;
    connectServer();
  } else if (event == WebsocketsEvent::GotPing) {
    Serial.println("Got a Ping!");
    counter = 10;
  } else if (event == WebsocketsEvent::GotPong) {
    Serial.println("Got a Pong!");
  }
}

void connectWiFi() {
  Serial.println("Connecting to WiFi");

  // Connect to wifi
  WiFi.begin(ssid, password);

  // Wait some time to connect to wifi
  for (int i = 0; i < 10 && WiFi.status() != WL_CONNECTED; i++) {
    Serial.print(".");
    delay(1000);
  }

  // Check if connected to wifi
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("Can't connect to WiFi");
    Serial.println("Retrying");
    connectWiFi();
  }
}

void connectServer() {
  Serial.println("Connected to Wifi, Connecting to server.");

  if (!serverConnected) {
    client.connect(websockets_server_host, websockets_server_port, "/");
  }

  for (int i = 0; i < 10 && !serverConnected; i++) {
    Serial.print(".");
    delay(1000);
  }

  if (!serverConnected) {
    Serial.println("Can't connect to the server");
    Serial.println("Retrying");
    connectServer();
  }
}

void setup() {
  Serial.begin(115200);

  connectWiFi();

  client.onMessage(onMessageCallback);

  client.onEvent(onEventsCallback);

  connectServer();
}

void loop() {
  if (WiFi.status() != WL_CONNECTED) {
    connectWiFi();
  }

  // let the websockets client check for incoming messages
  if (client.available()) {
    client.poll();
  }

  sensorValue = analogRead(SENSOR);
  if(sensorValue > SENSOR_THRESHOLD) {
    alarmCounter--;
  }

  if(alarmCounter >= MAX_ALARM_COUNTER) {
    digitalWrite(BUZZER, HIGH);
    digitalWrite(VALVE, LOW);
  }

  counter--;
  if (counter < 1) {
    serverConnected = false;
    connectServer();
  }

  String message = "{'type':'message', 'data':{'clientId':'" + clientId + "', 'type':'arduino', 'name':'" + name + "', 'sensorValue':" + sensorValue + "}}";
  client.send(message);
  Serial.println(message);
  
  delay(1000);
}