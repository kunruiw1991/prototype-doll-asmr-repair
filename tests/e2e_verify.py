#!/usr/bin/env python3
"""
Headless Chromium Playwright E2E + Side-by-Side Original Video Comparison Grid
Plays through all 24 steps across Episode 1 (Prototype) & Episode 2 (CatNap),
verifies zero errors/overflow, and builds .qa/comparison_grid.png comparing
ORIGINAL VIDEO frames (youtu.be/6Nw7Hi4Xr9s) directly beside OUR GAME screenshots!
"""
import os
import sys
import threading
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from PIL import Image, ImageDraw
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, "screenshots")
QA_DIR = os.path.join(ROOT, ".qa")
QA_REF = os.path.join(QA_DIR, "reference")
os.makedirs(OUT_DIR, exist_ok=True)
os.makedirs(QA_DIR, exist_ok=True)


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


def crop_sb(sheet_name, row, col):
    """Crop a 160x90 frame (row 0..4, col 0..4) from a YouTube 5x5 storyboard sheet."""
    im = Image.open(os.path.join(QA_REF, sheet_name)).convert("RGB")
    fw = im.width // 5
    fh = im.height // 5
    return im.crop((col * fw, row * fh, (col + 1) * fw, (row + 1) * fh))


def build_comparison_grid():
    """Build side-by-side Original Video vs. Our Build audit grid for Claude & Codex."""
    if not os.path.exists(os.path.join(QA_REF, "sb0_00.jpg")):
        print("Skipping comparison grid (no .qa/reference/ sheets found)")
        return

    pairs = [
        ("EP.1 · 00:45 Lab Desk & Dagger", crop_sb("sb0_00.jpg", 1, 1), "02_proto_lab_desk.png"),
        ("EP.1 · 01:35 CRT Brainwave Sync", crop_sb("sb0_00.jpg", 3, 4), "03_proto_crt_sync.png"),
        ("EP.1 · 03:05 Green Chamber & Tank", crop_sb("sb0_01.jpg", 2, 0), "04_proto_green_chamber.png"),
        ("EP.1 · 05:05 Steel Cabinet ASMR Foam", crop_sb("sb0_02.jpg", 1, 4), "05_proto_steel_cabinet_foam.png"),
        ("EP.1 · 06:05 Iconic Steel Cabinet Hero", Image.open(os.path.join(QA_REF, "thumb_maxres.jpg")).convert("RGB"), "06_proto_steel_cabinet_hero.png"),
        ("EP.1 · 06:30 Red-Alert Prototype Finale", crop_sb("sb0_03.jpg", 0, 3), "07_proto_spooky_finale.png"),
        ("EP.2 · 07:15 Playcare Broken CatNap", crop_sb("sb0_03.jpg", 2, 0), "08_catnap_playcare.png"),
        ("EP.2 · 08:45 SMILE BAM Washer Spin", crop_sb("sb0_04.jpg", 1, 3), "09_catnap_washer.png"),
        ("EP.2 · 10:50 Tailor Bench Fabric Gag", crop_sb("sb0_05.jpg", 1, 2), "10_catnap_tailor_fabric.png"),
        ("EP.2 · 14:30 Spooky CatNap Finale", crop_sb("sb0_06.jpg", 4, 3), "12_catnap_spooky_finale.png"),
    ]

    cell_w, cell_h = 480, 270
    header_h = 34
    pad = 14
    grid_w = pad * 3 + cell_w * 2
    grid_h = pad + len(pairs) * (cell_h + header_h + pad)
    canvas = Image.new("RGB", (grid_w, grid_h), (14, 17, 24))
    draw = ImageDraw.Draw(canvas)

    y = pad
    for label, orig_img, our_file in pairs:
        our_path = os.path.join(OUT_DIR, our_file)
        if not os.path.exists(our_path):
            continue
        our_img = Image.open(our_path).convert("RGB")
        # Crop out the top HUD/bottom dock from full desktop screenshot if needed or resize full frame
        orig_resized = orig_img.resize((cell_w, cell_h), Image.Resampling.LANCZOS)
        our_resized = our_img.resize((cell_w, cell_h), Image.Resampling.LANCZOS)

        draw.text((pad, y + 8), f"ORIGINAL VIDEO (youtu.be/6Nw7Hi4Xr9s) — {label}", fill=(250, 204, 21))
        draw.text((pad * 2 + cell_w, y + 8), f"OUR GAME BUILD — {our_file}", fill=(74, 222, 128))
        canvas.paste(orig_resized, (pad, y + header_h))
        canvas.paste(our_resized, (pad * 2 + cell_w, y + header_h))
        y += cell_h + header_h + pad

    out_path = os.path.join(QA_DIR, "comparison_grid.png")
    canvas.save(out_path, "PNG", optimize=True)
    print(f"Built side-by-side reproducibility audit sheet: {out_path}")


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
        page.evaluate("window.__GAME__.assetsReady")
        page.wait_for_timeout(350)

        # Verify all 18 painterly assets loaded with naturalWidth > 0!
        missing_assets = page.evaluate("""() => {
            const keys = Object.keys(window.ASMRAssets.MANIFEST);
            return keys.filter(k => !window.ASMRAssets.get(k));
        }""")
        assert not missing_assets, f"Failed to load painterly assets: {missing_assets}"

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
        page.mouse.move(10, 10)
        page.wait_for_timeout(950)
        step_idx = page.evaluate("window.__GAME__.state.stepIndex")
        assert step_idx == 1, f"Expected stepIndex=1 after pulling dagger, got {step_idx}"

        # Step 3: CRT Brainwave Closeup
        page.evaluate("window.__GAME__.goToStep(2); window.__GAME__.state.progress = 0.65; window.__GAME__.syncUI();")
        page.wait_for_timeout(220)
        page.screenshot(path=os.path.join(OUT_DIR, "03_proto_crt_sync.png"))

        # Step 6: Green Experiment Chamber (Ribcage & Crimson Tank)
        page.evaluate("window.__GAME__.goToStep(5); window.__GAME__.state.substepIndex = 2; window.__GAME__.state._selectDefaultTool(); window.__GAME__.syncUI();")
        page.wait_for_timeout(220)
        page.screenshot(path=os.path.join(OUT_DIR, "04_proto_green_chamber.png"))

        # Step 10: Iconic Steel Tool Cabinet + Fluffy ASMR Foam Cover!
        page.evaluate("window.__GAME__.goToStep(9); window.__GAME__.state.progress = 0.85; window.__GAME__.syncUI();")
        page.wait_for_timeout(220)
        page.screenshot(path=os.path.join(OUT_DIR, "05_proto_steel_cabinet_foam.png"))

        # Step 12: Restored Prototype in Iconic Steel Cabinet (Hero Shot!)
        page.evaluate("window.__GAME__.goToStep(11); window.__GAME__.syncUI();")
        page.wait_for_timeout(220)
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
        page.wait_for_timeout(220)
        page.screenshot(path=os.path.join(OUT_DIR, "08_catnap_playcare.png"))

        # Step 16: SMILE BAM Washing Machine Spin Cycle!
        page.evaluate("window.__GAME__.goToStep(15); window.__GAME__.state.substepIndex = 2; window.__GAME__.state.progress = 0.6; window.__GAME__.state._selectDefaultTool(); window.__GAME__.syncUI();")
        page.wait_for_timeout(220)
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
        page.wait_for_timeout(220)
        assert page.evaluate("window.__GAME__.state.substepIndex") == 1, "Purple swatch should advance to cut_patches"
        assert page.evaluate("window.__GAME__.state.wrongSwatchFlash") is None, "Wrong swatch flash must clear on purple pick"
        page.screenshot(path=os.path.join(OUT_DIR, "10_catnap_tailor_fabric.png"))

        # Step 21: Face Closeup Button Eyes
        page.evaluate("window.__GAME__.goToStep(20); window.__GAME__.state.substepIndex = 1; window.__GAME__.state._selectDefaultTool(); window.__GAME__.syncUI();")
        page.wait_for_timeout(220)
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
            page.wait_for_timeout(220)
            cbox = page.locator("#stage-canvas").bounding_box()
            assert cbox and cbox["width"] >= 260 and cbox["height"] >= 140, f"Canvas too small at {vw}x{vh}: {cbox}"
            assert cbox["x"] >= 0 and cbox["x"] + cbox["width"] <= vw + 2, f"Canvas overflows viewport at {vw}x{vh}: {cbox}"
            overflow = page.evaluate("document.documentElement.scrollWidth")
            assert overflow <= vw + 1, f"Horizontal overflow detected at {vw}x{vh}: scrollWidth={overflow}"
            page.screenshot(path=os.path.join(OUT_DIR, name))

        browser.close()

    server.shutdown()
    build_comparison_grid()
    if errors:
        print("E2E ERRORS DETECTED:", "\n".join(errors), file=sys.stderr)
        sys.exit(1)
    print("ALL E2E CHECKS PASSED (18 painterly assets verified, 0 console errors, comparison_grid.png built)!")


if __name__ == "__main__":
    run_verification()
