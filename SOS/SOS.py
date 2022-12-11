# Don't forget to update main.py! on your espressif device!
from machine import Pin, SoftI2C, UART
import SSD1306
import time
import sys
import nmea as parser

# ESP32 Pin assignment 
i2c = SoftI2C(scl=Pin(32), sda=Pin(33))

# ESP8266 Pin assignment
#i2c = SoftI2C(scl=Pin(5), sda=Pin(4))

oled_width = 128
oled_height = 64
oled = SSD1306.SSD1306_I2C(oled_width, oled_height, i2c)

gpsModule = UART(2, baudrate=9600, rx=16, tx=17)
print(gpsModule)

gpsModule = UART(2, baudrate=9600)
print(gpsModule)

buff = bytearray(255)

TIMEOUT = False
FIX_STATUS = False

nmea = parser.MicropyGPS()

while True:
    if gpsModule.any():
        data = str(gpsModule.readline())
        for char in data:
            nmea.update(char)
    oled.fill(0)
    oled.text(str(nmea.latitude), 0, 0)
    oled.text(str(nmea.longitude), 0, 10)
    oled.text(str(nmea.timestamp), 0, 20)
    oled.text(str(nmea.date), 0, 30)
    oled.text(str(nmea.speed), 0, 40)
    oled.text(str(nmea.satellites_in_view) + " " + str(nmea.satellites_in_use), 0, 50)
    
    oled.show()
