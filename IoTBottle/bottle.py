from machine import I2C
from machine import Pin
from machine import sleep
from mpu6050 import accel
print('aosidj')

i2c = I2C(scl=Pin(5), sda=Pin(4))
mpu = accel(i2c)
frm = 0

while True:
    print(mpu.get_values()
    frm += 1