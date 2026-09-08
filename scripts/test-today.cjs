/* Optional browser regression check for the Growth Intelligence Today redesign. */
/* eslint-disable @typescript-eslint/no-require-imports */
const { chromium } = require("playwright");
const assert = require("node:assert/strict");

(async () => {
  const browser = await chromium.launch({
    channel: process.env.TODAY_BROWSER || "msedge",
    headless: true,
  });
  try {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 1000 },
    });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(process.env.TODAY_URL || "http://localhost:3000", {
      waitUntil: "networkidle",
    });

    await page
      .getByRole("heading", {
        name: "Four things changed in your accounts since yesterday.",
        exact: true,
      })
      .waitFor();

    assert.match(
      await page
        .getByRole("link", { name: "Broadridge Growth Intelligence — home" })
        .innerText(),
      /Growth/i,
    );
    assert.equal(await page.locator(".today-ask-portal").count(), 1);
    assert.match(
      await page.locator(".today-priority").innerText(),
      /Fund Communication Solutions/,
    );

    assert.equal(
      await page
        .getByRole("navigation", { name: "Modules", exact: true })
        .getByRole("link")
        .count(),
      10,
    );
    assert.equal(
      await page
        .getByRole("link", { name: "Today", exact: true })
        .getAttribute("aria-current"),
      "page",
    );

    const prepare = page.getByRole("button", {
      name: "Prepare me for this",
      exact: true,
    });
    const prepareBox = await prepare.boundingBox();
    assert(
      prepareBox.y + prepareBox.height < 900,
      "Primary action is visible at a 900px desktop height",
    );

    await prepare.click();
    const dialog = page.getByRole("dialog");
    await dialog.waitFor();
    assert(
      await dialog
        .getByRole("button", { name: "Mark preparation complete" })
        .isDisabled(),
    );
    await dialog
      .getByText(/Review evidence/, { exact: false })
      .first()
      .click();
    assert(
      await dialog.getByText("Issuer filing · 7 Sep", { exact: true }).isVisible(),
    );
    for (const check of await dialog.getByRole("checkbox").all()) {
      await check.check();
    }
    await dialog
      .getByRole("textbox", { name: "Your meeting notes" })
      .fill("Ask Elena who owns the operating priorities.");
    await dialog
      .getByRole("button", { name: "Mark preparation complete" })
      .click();
    await page
      .getByRole("button", { name: "Review meeting preparation" })
      .click();
    assert.equal(
      await dialog
        .getByRole("textbox", { name: "Your meeting notes" })
        .inputValue(),
      "Ask Elena who owns the operating priorities.",
    );
    await page.keyboard.press("Escape");
    assert.equal(await page.getByRole("dialog").count(), 0);

    await page
      .getByRole("button", { name: /Schroders/ })
      .first()
      .click();
    assert.match(
      await page.locator(".today-priority").innerText(),
      /Cross-border/,
    );

    await page.getByRole("button", { name: /Open Intelligence/ }).click();
    await page.getByRole("button", { name: "Why does this matter today?" }).waitFor({
      state: "visible",
      timeout: 5000,
    });
    await page.getByRole("button", { name: "Why does this matter today?" }).click();
    assert.match(await page.locator(".today-ask-answer").innerText(), /.+/);

    assert.match(
      await page.locator(".today-map-section").innerText(),
      /Account locations and fund distribution/,
    );

    assert.equal(errors.length, 0, errors.join("\n"));
    console.log("today redesign checks passed");
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
