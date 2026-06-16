import asyncio
from playwright.async_api import async_playwright

async def test_visa2au():
    errors = []
    pages_checked = []

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context()
        page = await context.new_page()

        # Listen for console errors
        page.on("console", lambda msg: errors.append(f"Console {msg.type}: {msg.text}") if msg.type == "error" else None)

        # Test routes
        routes = [
            "/",
            "/visas",
            "/visas/visitor-visa-600",
            "/visas/skills-in-demand-482",
            "/visas/employer-nomination-186",
            "/visas/partner-visa-820",
            "/visas/partner-visa-309",
            "/visas/prospective-marriage-300",
            "/visas/parent-visa-103",
            "/employers",
            "/services/skills-assessments",
            "/services/citizenship",
            "/services/visa-refusals",
            "/about",
            "/team",
            "/pricing",
            "/contact",
        ]

        for route in routes:
            try:
                print(f"Testing: {route}")
                response = await page.goto(f"file:///workspace/visa2au/dist/index.html{route}", wait_until="domcontentloaded", timeout=10000)
                pages_checked.append(route)
                print(f"  OK: {route}")
            except Exception as e:
                print(f"  ERROR: {route} - {str(e)}")

        await browser.close()

    print(f"\n=== Summary ===")
    print(f"Pages checked: {len(pages_checked)}")
    print(f"Console errors: {len(errors)}")
    if errors:
        for err in errors:
            print(f"  - {err}")

if __name__ == "__main__":
    asyncio.run(test_visa2au())