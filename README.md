# PicoDisplay
Show some basic info on a raspberry pi pico via serial

## On the raspberry pi pico

Copy over the 3 scripts in the `pico` directory (Thonny seems to work here) and install a 1602 I2C LCD display

## On your computer

Install nodejs 16 or higher and run `npm install` in the client folder

Fill in the `config.json` file, or if on a Mac leave it as it is

Run `monitor.js`

## Serial data schema

All data should be in the form of:

```
Line_1_text\0Line_2_text\n
```

Note the null `\0` which seperates both of the lines to be displayed on the LCD, and the newline `\n` which dictates the end of the current input over the serial bus.