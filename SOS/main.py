# Don't forget to update main.py! on your espressif device!
from machine import Pin, SoftI2C, UART
import SSD1306
import time
import sys
import nmea as parser
from details import ssid, password, projectId
import network
import upip
import gc
import time

# ESP32 Pin assignment 
i2c = SoftI2C(scl=Pin(32), sda=Pin(33))

oled_width = 128
oled_height = 64
oled = SSD1306.SSD1306_I2C(oled_width, oled_height, i2c)

oled.fill(0)
oled.text("<boot>", 0, 40)
oled.show()
time.sleep(1)

oled.fill(0)
oled.text("<init comms>", 0, 40)
oled.show()

wlan = network.WLAN(network.STA_IF)
wlan.active(True)
if not wlan.isconnected():
    print('connecting to network...')
    wlan.connect(ssid, password)
    while not wlan.isconnected():
        pass
print('network config:', wlan.ifconfig())

oled.fill(0)
oled.text("<init firebase>", 0, 40)
oled.show()
time.sleep(0.1)

import ufirebase as firebase
firebase.setURL(f"https://{projectId}-default-rtdb.firebaseio.com/")

oled.fill(0)
oled.text("<init pinout>", 0, 40)
oled.show()
time.sleep(0.1)

gpsModule = UART(2, baudrate=9600, rx=16, tx=17)
print(gpsModule)

gpsModule = UART(2, baudrate=9600)
print(gpsModule)

buff = bytearray(255)

TIMEOUT = False
FIX_STATUS = False

oled.fill(0)
oled.text("<inti nmea>", 0, 40)
oled.show()
time.sleep(0.1)

nmea = parser.MicropyGPS()
_data = {
    "latitude": [0, 0.0, "N"],
    "longitude": [0, 0.0, "E"],
    "speed": [0.0, 0.0, 0.0],
    "satellites_in_use": 0,
    "satellites_in_view": 0,
    "emergency": False
}
button = Pin(12, Pin.IN)

oled.fill(0)
oled.text("<init success>", 0, 40)
oled.show()
time.sleep(2)

while True:
    while gpsModule.any():
        try:
            data = str(gpsModule.readline())
            for char in data:
                nmea.update(char)
            print(data)
        except IndexError:
            pass
        oled.fill(0)
        
        timestamp = ""
        for i in range(len(nmea.timestamp)):
            timestamp += str(nmea.timestamp[i])
            if not i == len(nmea.timestamp)-1:
                timestamp += ":"
        
        date = ""
        for i in range(len(nmea.date)):
            date += str(nmea.date[i])
            if not i == len(nmea.date)-1:
                date += "/"
                
        if button.value() > 0.5:
            _data["emergency"] = True
            t = "<emergency>"
        else:
            _data["emergency"] = False
            t = "<normal>"
        
        oled.text(str(_data["latitude"][0]+_data["latitude"][1]/100) + " " + str(_data["latitude"][2]), 0, 0)
        oled.text(str(_data["longitude"][0]+_data["longitude"][1]/100) + " " + str(_data["longitude"][2]), 0, 10)
        oled.text(timestamp, 0, 20)
        oled.text(date, 0, 30)
        oled.text(t, 0, 40)
        oled.text("GPS Debug: " + str(_data["satellites_in_view"]) + " " + str(_data["satellites_in_use"]), 0, 50)
        
        oled.show()
        
        if not nmea.latitude[0] == 0:
            _data["latitude"] = nmea.latitude
        if not nmea.longitude[0] == 0:
            _data["longitude"] = nmea.longitude
        if not nmea.longitude[0] == 0.0:
            _data["speed"] = nmea.speed
        if not nmea.satellites_in_use == 0:
            _data["satellites_in_use"] = nmea.satellites_in_use
        if not nmea.satellites_in_view == 0:
            _data["satellites_in_view"] = nmea.satellites_in_view
        
    gc.collect()
    firebase.put("test_tracker", _data, bg=0)
