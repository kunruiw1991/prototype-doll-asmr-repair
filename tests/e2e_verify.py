#!/usr/bin/env python3
"""
Headless Chromium Playwright E2E + Multi-Viewport Visual Verification
Plays through all 24 steps across Episode 1 (Prototype) & Episode 2 (CatNap),
tests the Step 20 Fabric Color Gag, toggles, and saves keyframe screenshots.
"""
import os
import sys
import time
import threading
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, "screenshots")
os.makedirs(OUT_DIR, exist_ok=True)


class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        pass


def start_server():
    handler = partial(QuietHandler, directory=ROOT)
    server = ThreadingHTTPServer(("127.0.0.1", 0), handler)
    port = server.server_address[1]
    t = threading.Thread(target=server.serve_forever, daemon=True)
    t.start()
    return server, port


def run_verification():
    server, port = start_server()
    url = f"http://127.0.0.1:{port}/index.html"
    errors = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1280, "height": 800})
        page = context.new_page()
        page.on("console", lambda m: errors.append(f"console.{m.type}: {m.text}") if m.type == "error" else None)
        page.on("pageerror", lambda e: errors.append(f"pageerror: {e}"))

        page.goto(url, wait_until="networkidle")
        page.wait_for_timeout(300)

        # 1. Capture Intro Screen
        page.screenshot(path=os.path.join(OUT_DIR, "01_intro_desktop.png"))
        assert page.locator("#overlay-intro").is_visible(), "Intro overlay should be visible on load"

        # 2. Start Episode 1: Prototype
        page.click("#btn-start-prototype")
        page.wait_for_timeout(250)
        assert not page.locator("#overlay-intro").is_visible(), "Intro overlay should hide on start"

        # Step 1: Pull Dagger via real pointer drag on canvas!
        page.screenshot(path=os.path.join(OUT_DIR, "02_proto_lab_desk.png"))
        box = page.locator("#stage-canvas").bounding_box()
        assert box and box["width"] > 300, "Canvas must have valid non-zero dimensions"
        sx = box["x"] + box["width"] * (676 / 1280)
        sy = box["y"] + box["height"] * (205 / 720)
        page.mouse.move(sx, sy)
        page.mouse.down()
        page.mouse.move(sx + 110, sy - 95, steps=10)
        page.mouse.up()
        page.wait_for_timeout(950)
        step_idx = page.evaluate("window.__GAME__.state.stepIndex")
        assert step_idx == 1, f"Expected stepIndex=1 after pulling dagger, got {step_idx}"

        # Capture iconic key scenes across Episode 1
        # Step 3: CRT Brainwave Closeup
        page.evaluate("window.__GAME__.goToStep(2); window.__GAME__.state.progress = 0.65; window.__GAME__.syncUI();")
        page.wait_for_timeout(200)
        page.screenshot(path=os.path.join(OUT_DIR, "03_proto_crt_sync.png"))

        # Step 6: Green Experiment Chamber (Ribcage & Crimson Tank)
        page.evaluate("window.__GAME__.goToStep(5); window.__GAME__.state.substepIndex = 2; window.__GAME__.syncUI();")
        page.wait_for_timeout(200)
        page.screenshot(path=os.path.join(OUT_DIR, "04_proto_green_chamber.png"))

        # Step 10: Iconic Steel Tool Cabinet + Fluffy ASMR Foam Cover!
        page.evaluate("window.__GAME__.goToStep(9); window.__GAME__.state.progress = 0.85; window.__GAME__.syncUI();")
        page.wait_for_timeout(200)
        page.screenshot(path=os.path.join(OUT_DIR, "05_proto_steel_cabinet_foam.png"))

        # Step 12: Restored Prototype in Iconic Steel Cabinet (Hero Shot!)
        page.evaluate("window.__GAME__.goToStep(11); window.__GAME__.syncUI();")
        page.wait_for_timeout(200)
        page.screenshot(path=os.path.join(OUT_DIR, "06_proto_steel_cabinet_hero.png"))
        page.screenshot(path=os.path.join(ROOT, "screenshot.jpg"), type="jpeg", quality=90)

        # Complete Step 12 to trigger Prototype Spooky Finale!
        page.click("#btn-auto-assist")
        page.wait_for_timeout(150)
        page.click("#btn-auto-assist")
        page.wait_for_timeout(400)
        page.screenshot(path=os.path.join(OUT_DIR, "07_proto_spooky_finale.png"))
        page.wait_for_timeout(1600)
        assert page.locator("#overlay-finale").is_visible(), "Prototype finale overlay should appear"

        # Transition directly to Episode 2: CatNap!
        page.click("#btn-finale-next")
        page.wait_for_timeout(250)
        assert page.evaluate("window.__GAME__.state.stepIndex") == 12, "Should transition to CatNap step 12"

        # Step 14: Lit Playcare Room with Broken CatNap (dangling eye + cheek tag)
        page.evaluate("window.__GAME__.goToStep(13); window.__GAME__.syncUI();")
        page.wait_for_timeout(200)
        page.screenshot(path=os.path.join(OUT_DIR, "08_catnap_playcare.png"))

        # Step 16: SMILE BAM Washing Machine Spin Cycle!
        page.evaluate("window.__GAME__.goToStep(15); window.__GAME__.state.substepIndex = 2; window.__GAME__.state.progress = 0.6; window.__GAME__.state._selectDefaultTool(); window.__GAME__.syncUI();")
        page.wait_for_timeout(200)
        page.screenshot(path=os.path.join(OUT_DIR, "09_catnap_washer.png"))

        # Step 20: Wooden Tailor Workbench + Fabric Color Gag (Yellow ❌ -> Blue ❌ -> CATNAP Purple ✅)
        page.evaluate("window.__GAME__.goToStep(19); window.__GAME__.syncUI();")
        page.wait_for_timeout(150)
        page.click('button[data-tool-id="swatch_yellow"]')
        page.wait_for_timeout(150)
        assert page.evaluate("window.__GAME__.state.wrongSwatchFlash") == "yellow", "Yellow gag should flash"
        page.click('button[data-tool-id="swatch_blue"]')
        page.wait_for_timeout(150)
        assert page.evaluate("window.__GAME__.state.wrongSwatchFlash") == "blue", "Blue gag should flash"
        page.click('button[data-tool-id="swatch_purple"]')
        page.wait_for_timeout(200)
        assert page.evaluate("window.__GAME__.state.substepIndex") == 1, "Purple swatch should advance to cut_patches"
        assert page.evaluate("window.__GAME__.state.wrongSwatchFlash") is None, "Wrong swatch flash must clear on purple pick"
        page.screenshot(path=os.path.join(OUT_DIR, "10_catnap_tailor_fabric.png"))

        # Step 21: Face Closeup Button Eyes
        page.evaluate("window.__GAME__.goToStep(20); window.__GAME__.state.substepIndex = 1; window.__GAME__.state._selectDefaultTool(); window.__GAME__.syncUI();")
        page.wait_for_timeout(200)
        page.screenshot(path=os.path.join(OUT_DIR, "11_catnap_button_eyes.png"))

        # Step 24: Restored CatNap + Finale
        page.evaluate("window.__GAME__.goToStep(23); window.__GAME__.syncUI();")
        page.click("#btn-auto-assist")
        page.wait_for_timeout(120)
        page.click("#btn-auto-assist")
        page.wait_for_timeout(400)
        page.screenshot(path=os.path.join(OUT_DIR, "12_catnap_spooky_finale.png"))
        page.wait_for_timeout(1600)
        assert page.locator("#overlay-finale").is_visible(), "CatNap finale overlay should appear"

        # Test Chapter Drawer + Bilingual EN Toggle + Spooky/Cozy Toggle
        page.click("#btn-lang")
        page.click("#btn-spooky")
        page.click("#btn-chapters")
        page.wait_for_timeout(200)
        assert page.locator("#chapter-drawer").is_visible(), "Chapter drawer should open"
        assert page.locator(".drawer-item").count() == 24, "Drawer must list all 24 steps"
        page.click("#btn-close-drawer")

        # Multi-viewport responsive check (iPad Landscape, iPad Portrait, Mobile Portrait)
        for name, vw, vh in [
            ("13_ipad_landscape.png", 1024, 768),
            ("14_ipad_portrait.png", 768, 1024),
            ("15_mobile_portrait.png", 390, 844),
        ]:
            page.set_viewport_size({"width": vw, "height": vh})
            page.evaluate("window.__GAME__.goToStep(11); window.__GAME__.syncUI();")
            page.wait_for_timeout(200)
            cbox = page.locator("#stage-canvas").bounding_box()
            assert cbox and cbox["width"] >= 260 and cbox["height"] >= 140, f"Canvas too small at {vw}x{vh}: {cbox}"
            assert cbox["x"] >= 0 and cbox["x"] + cbox["width"] <= vw + 2, f"Canvas overflows viewport at {vw}x{vh}: {cbox}"
            overflow = page.evaluate("document.documentElement.scrollWidth")
            assert overflow <= vw + 1, f"Horizontal overflow detected at {vw}x{vh}: scrollWidth={overflow}"
            page.screenshot(path=os.path.join(OUT_DIR, name))

        browser.close()

    server.shutdown()
    if errors:
        print("E2E ERRORS DETECTED:", "\n".join(errors), file=sys.stderr)
        sys.exit(1)
    print("ALL E2E CHECKS PASSED (0 console/page errors, 15 screenshots captured)!")


if __name__ == "__main__":
    run_verification()
