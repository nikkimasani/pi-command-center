#!/usr/bin/env python3
import sys, time
from gpiozero import LED, Button
MODE = sys.argv[1] if len(sys.argv) > 1 else "help"
LED_PIN = 17
BUTTON_PIN = 27
if MODE == "led":
    led = LED(LED_PIN)
    print(f"Blinking LED on GPIO {LED_PIN}. Press Ctrl+C to stop.")
    try:
        while True:
            led.on(); time.sleep(0.5)
            led.off(); time.sleep(0.5)
    except KeyboardInterrupt:
        led.off()
elif MODE == "button":
    button = Button(BUTTON_PIN, pull_up=True, bounce_time=0.05)
    print(f"Watching button on GPIO {BUTTON_PIN}. Press Ctrl+C to stop.")
    button.when_pressed = lambda: print("button pressed")
    button.when_released = lambda: print("button released")
    try:
        while True: time.sleep(1)
    except KeyboardInterrupt:
        pass
else:
    print("Usage: electronics-lab.py led | button")
    print(f"Default LED GPIO: {LED_PIN}; default button GPIO: {BUTTON_PIN}")
