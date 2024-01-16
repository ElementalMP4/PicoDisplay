from machine import I2C
from pico_i2c_lcd import I2cLcd

import uselect
import gc
from sys import stdin

TERMINATOR = "\n"
I2C_ADDR = 0x27
I2C_NUM_ROWS = 2
I2C_NUM_COLS = 16


class PicoDisplayRunner:
    def __init__(self):
        i2c = I2C(0, sda=machine.Pin(0), scl=machine.Pin(1), freq=400000)
        self.lcd = I2cLcd(i2c, I2C_ADDR, I2C_NUM_ROWS, I2C_NUM_COLS)
        self.lcd.clear()
        self.lcd.move_to(0, 0)
        self.lcd.putstr("PicoDisplay")
        self.lcd.move_to(0, 1)
        self.lcd.putstr("Waiting for data")
        self.buffered_input = []
        self.new_content = ""
        self.previous_content = ""

    def main(self):
        while True:
            self.new_content = ""
            self.read_serial_input()
            if self.new_content:
                if self.previous_content != self.new_content:
                    lines = self.new_content.split("\0")
                    self.lcd.clear()
                    self.lcd.move_to(0, 0)
                    self.lcd.putstr(lines[0])
                    self.lcd.move_to(0, 1)
                    self.lcd.putstr(lines[1])
                    self.previous_content = self.new_content

    def read_serial_input(self):
        select_result = uselect.select([stdin], [], [], 0)
        while select_result[0]:
            input_character = stdin.read(1)
            self.buffered_input.append(input_character)
            select_result = uselect.select([stdin], [], [], 0)
            if TERMINATOR in self.buffered_input:
                line_ending_index = self.buffered_input.index(TERMINATOR)
                self.new_content = "".join(
                    self.buffered_input[:line_ending_index])
                if line_ending_index < len(self.buffered_input):
                    self.buffered_input = self.buffered_input[line_ending_index + 1:]
                else:
                    self.buffered_input = []
            else:
                self.new_content = ""


if __name__ == "__main__":
    pico = PicoDisplayRunner()
    pico.main()
    gc.collect()
