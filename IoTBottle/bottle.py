from machine import I2C
from machine import Pin
from machine import sleep
from mpu6050 import accel
print('aosidj')

i2c = I2C(scl=Pin(5), sda=Pin(4))
mpu = accel(i2c)
frm = 0

while True:
    _ = mpu.get_values()
    misaligned = 0
    if not _['GyY'] in range(-100, 400):
        misaligned += 1
    if not _['GyX'] in range(-600, 400):
        misaligned += 1
    if misaligned > 1:
        print(frm)
    frm += 1
