from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
import time
import os

options = Options()
options.add_argument("--headless=new")
options.add_argument("--window-size=1440,960")
options.add_argument("--disable-gpu")
options.add_argument("--no-sandbox")

os.makedirs("presentation_assets", exist_ok=True)

driver = webdriver.Chrome(options=options)
try:
    # 1. Main View
    driver.get("http://127.0.0.1:4173/")
    time.sleep(2)
    driver.save_screenshot("presentation_assets/calc_overview.png")
    print("Saved calc_overview.png")

    # 2. Perform some calculations to populate the display & history tape
    # Find number 7, *, 8, =, +, 5, =, sin, 30, =
    # Or send keyboard keys
    body = driver.find_element(By.TAG_NAME, "body")
    body.send_keys("1")
    body.send_keys("2")
    body.send_keys("*")
    body.send_keys("8")
    body.send_keys("=")
    time.sleep(0.5)

    body.send_keys("s") # sin(
    body.send_keys("3")
    body.send_keys("0")
    body.send_keys(")")
    body.send_keys("=")
    time.sleep(0.5)

    body.send_keys("r") # sqrt
    body.send_keys("1")
    body.send_keys("4")
    body.send_keys("4")
    body.send_keys(")")
    body.send_keys("=")
    time.sleep(0.5)

    driver.save_screenshot("presentation_assets/calc_with_history.png")
    print("Saved calc_with_history.png")

    # 3. Switch to Reference Constants tab
    buttons = driver.find_elements(By.TAG_NAME, "button")
    for b in buttons:
        if "Reference" in b.text:
            b.click()
            break
    time.sleep(1)
    driver.save_screenshot("presentation_assets/calc_constants.png")
    print("Saved calc_constants.png")

    # 4. Open Keyboard Shortcuts Modal
    for b in buttons:
        if b.get_attribute("title") == "Keyboard Shortcuts":
            b.click()
            break
    time.sleep(1)
    driver.save_screenshot("presentation_assets/calc_shortcuts.png")
    print("Saved calc_shortcuts.png")

finally:
    driver.quit()
    print("Done capturing screenshots!")
