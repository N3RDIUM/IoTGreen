from machine import I2C
from machine import Pin
from machine import sleep
from mpu6050 import accel
import time, socket

station = network.WLAN(network.STA_IF)

station.active(True)
station.connect(ssid, password)

while station.isconnected() == False:
  pass

print('Connection successful')
print(station.ifconfig())

led = Pin(2, Pin.OUT)
led.off()

print(station.ifconfig())

i2c = I2C(scl=Pin(5), sda=Pin(4))
mpu = accel(i2c)

def alert():
    pass

def retrieve_data():
    with open("userdata.txt") as file:
        return int(file.read())

def save_data(last_drink):
    with open("userdata.txt", "w") as file:
        file.write(str(last_drink))
        
def web_page():
    return str(retrieve_data())
        
last_drink = retrieve_data()
threshold = 4
print(last_drink)

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.bind(('', 80))
s.listen(5)
s.settimeout(0.2)

def handle_connections():
    conn, addr = s.accept()
    print('Got a connection from %s' % str(addr))
    request = conn.recv(1024)
    request = str(request)
    response = web_page()
    conn.send('HTTP/1.1 200 OK\n')
    conn.send('Content-Type: text/html\n')
    conn.send('Connection: close\n\n')
    conn.sendall(response)
    conn.close()

while True:
    _ = mpu.get_values()
    misaligned = 0
    if not _['GyY'] in range(-100, 400):
        misaligned += 1
    if not _['GyX'] in range(-600, 400):
        misaligned += 1
    if misaligned > 1:
        last_drink = time.time()
        save_data(last_drink)
        last_drink = retrieve_data()
    if time.time() - last_drink > threshold:
        alert()
        
    try:
        handle_connections()
    except OSError: # timeout
        pass
    