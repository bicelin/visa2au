#!/usr/bin/env python3
"""
Playwright test script for Visa2AU website validation.
Uses HTTP server to properly test the built files.
"""
import asyncio
import sys
import os
import threading
import http.server
import socketserver
from pathlib import Path
from playwright.async_api import async_playwright

# Simple HTTP server
class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        pass  # Suppress logging

def start_server(port, directory):
    os.chdir(directory)
    with socketserver.TCPServer(("", port), QuietHandler) as httpd:
        httpd.serve_forever()

async def test_visa2au():
    errors = []
    media_failures = []

    # Paths to check
    dist_dir = Path("/workspace/visa2au/dist")
    imgs_dir = dist_dir / "imgs"

    # Expected images
    expected_images = [
        "hero-sydney.jpg",
        "uluru.jpg",
        "australian-beach.jpg",
        "melbourne.jpg",
        "kangaroo.jpg"
    ]

    print("=" * 60)
    print("Visa2AU Website Validation Test")
    print("=" * 60)

    # Check image files exist
    print("\n1. Checking image files...")
    for img in expected_images:
        img_path = imgs_dir / img
        if img_path.exists():
            size_kb = img_path.stat().st_size / 1024
            print(f"   [OK] {img} ({size_kb:.1f} KB)")
        else:
            errors.append(f"Missing image: {img}")
            print(f"   [FAIL] {img} - NOT FOUND")

    # Start HTTP server in background
    print("\n2. Starting HTTP server...")
    server_thread = threading.Thread(target=start_server, args=(8080, str(dist_dir)), daemon=True)
    server_thread.start()
    print("   [OK] Server started on port 8080")

    # Test with Playwright
    print("\n3. Testing page with Playwright...")

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        # Collect console errors
        console_errors = []
        page.on("console", lambda msg: console_errors.append(msg) if msg.type == "error" else None)

        # Collect failed requests (404s)
        failed_requests = []
        page.on("requestfailed", lambda request: failed_requests.append(request.url))

        try:
            # Load the page
            await page.goto("http://localhost:8080", wait_until="networkidle", timeout=30000)

            print(f"   [OK] Page loaded successfully")
            print(f"   [INFO] Title: {await page.title()}")

            # Check for key elements
            print("\n4. Checking key elements...")

            # Check navbar
            navbar = await page.query_selector("nav")
            if navbar:
                print("   [OK] Navbar present")
            else:
                errors.append("Navbar not found")
                print("   [FAIL] Navbar not found")

            # Check hero section
            hero = await page.query_selector("section")
            if hero:
                print("   [OK] Hero section present")
            else:
                errors.append("Hero section not found")
                print("   [FAIL] Hero section not found")

            # Check footer
            footer = await page.query_selector("footer")
            if footer:
                print("   [OK] Footer present")
            else:
                errors.append("Footer not found")
                print("   [FAIL] Footer not found")

            # Check h1 text
            h1 = await page.query_selector("h1")
            if h1:
                h1_text = await h1.inner_text()
                print(f"   [OK] Hero headline: {h1_text[:50]}...")

            # Report console errors
            if console_errors:
                print(f"\n5. Console errors found: {len(console_errors)}")
                for err in console_errors[:5]:
                    print(f"   [ERROR] {err}")
                    errors.append(f"Console error: {err}")
            else:
                print("\n5. [OK] No console errors")

            # Report failed requests (filter out localhost)
            external_failures = [r for r in failed_requests if "localhost" not in r]
            if external_failures:
                print(f"\n6. Failed external requests: {len(external_failures)}")
                for req in external_failures[:5]:
                    print(f"   [FAIL] {req}")
                    media_failures.append(req)
            else:
                print("\n6. [OK] No failed external requests")

        except Exception as e:
            errors.append(f"Playwright error: {str(e)}")
            print(f"   [ERROR] {e}")

        await browser.close()

    # Summary
    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)

    if not errors and not media_failures:
        print("[SUCCESS] All tests passed!")
        return 0
    else:
        if errors:
            print(f"[FAIL] {len(errors)} error(s) found")
        if media_failures:
            print(f"[FAIL] {len(media_failures)} media failure(s)")
        return 1

if __name__ == "__main__":
    exit_code = asyncio.run(test_visa2au())
    sys.exit(exit_code)
