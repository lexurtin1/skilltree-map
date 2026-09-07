/* Optional browser regression check. Uses locally installed Playwright and Edge. */
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
    await page.getByRole("heading", { name: "Today.", exact: true }).waitFor();
    assert.equal(await page.locator(".today-account-object").count(), 8);
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
      name: "Prepare meeting",
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
      .getByText("Review evidence · 4 illustrative sources", { exact: true })
      .click();
    assert(
      await dialog
        .getByText("Market update · Today, 08:12", { exact: true })
        .isVisible(),
    );
    for (const check of await dialog.getByRole("checkbox").all())
      await check.check();
    await dialog
      .getByRole("textbox", { name: "Your meeting notes" })
      .fill("Ask Marcus who owns the operating priorities.");
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
      "Ask Marcus who owns the operating priorities.",
    );
    await page.keyboard.press("Escape");
    assert.equal(await page.getByRole("dialog").count(), 0);
    assert(
      await page
        .getByRole("button", { name: "Review meeting preparation" })
        .evaluate((el) => el === document.activeElement),
      "Dialog returns focus to its trigger",
    );

    await page
      .getByRole("button", {
        name: "Select Schroders: Deal blocked · buyer access",
        exact: true,
      })
      .click();
    assert.match(
      await page.locator(".today-selected-story").innerText(),
      /executive economic owner/i,
    );
    await page
      .locator(".today-selected-story")
      .getByRole("button", { name: "View evidence (2)" })
      .click();
    assert.equal(await dialog.locator(".today-source").count(), 2);
    assert.match(await dialog.innerText(), /not verified evidence/);
    await page.keyboard.press("Escape");

    for (const name of [
      "Fidelity International",
      "Nordea Asset Management",
      "Waystone",
      "Schroders",
      "Janus Henderson Investors",
      "M&G",
      "BlackRock",
      "Amundi",
    ]) {
      await page
        .getByRole("button", { name: `Open account: ${name}`, exact: true })
        .first()
        .click();
      assert(
        await dialog.getByRole("heading", { name, exact: true }).isVisible(),
      );
      await page.keyboard.press("Escape");
    }
    await page
      .getByLabel("Account ownership", { exact: true })
      .selectOption("Team accounts");
    assert.equal(await page.locator(".today-account-object").count(), 9);
    assert.match(
      await page.locator(".today-pipeline").innerText(),
      /Advanced this week/,
    );
    await page
      .getByLabel("Account tier", { exact: true })
      .selectOption("Strategic accounts");
    assert.equal(await page.locator(".today-account-object").count(), 7);
    await page
      .getByLabel("Pipeline activity period", { exact: true })
      .selectOption("This month");
    assert.match(
      await page.locator(".today-pipeline").innerText(),
      /Account expansion/,
    );
    await page.locator(".today-focus summary").click();
    await page
      .getByRole("button", { name: "Renewal risk", exact: true })
      .click();
    assert.equal(await page.locator(".today-account-object").count(), 1);
    assert.match(
      await page.locator(".today-selected-story").innerText(),
      /M&G/,
    );
    assert.equal(await page.locator(".today-change").count(), 1);
    await page
      .getByRole("button", { name: "All priorities", exact: true })
      .click();
    await page.locator(".today-focus summary").click();
    await page
      .getByLabel("Account ownership", { exact: true })
      .selectOption("My accounts");
    await page
      .getByLabel("Account tier", { exact: true })
      .selectOption("All accounts");
    await page
      .getByLabel("Pipeline activity period", { exact: true })
      .selectOption("This week");
    await page.locator(".today-page").evaluate((el) => {
      el.scrollTop = 0;
    });
    await page.screenshot({ path: "artifacts/ui-review/today-desktop.png" });
    const contentHeight = await page
      .locator(".today-page")
      .evaluate((el) => el.scrollHeight);
    await page.setViewportSize({ width: 1440, height: contentHeight + 150 });
    await page.screenshot({ path: "artifacts/ui-review/today-full.png" });

    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    const mobileSearch = page.getByRole("combobox", { name: "Search accounts, people and funds" });
    assert(await mobileSearch.isVisible(), "Search remains available on mobile");
    await mobileSearch.fill("Fidelity");
    await page.getByRole("listbox").waitFor();
    assert(await page.getByRole("option").count() > 0, "Mobile search returns account results");
    await page.keyboard.press("Escape");
    await page.locator(".today-page").evaluate((el) => {
      el.scrollTop = 0;
    });
    assert(
      await page
        .locator(".today-page")
        .evaluate((el) => el.scrollWidth <= el.clientWidth),
      "No horizontal page overflow on mobile",
    );
    await page
      .getByRole("button", { name: "Review meeting preparation" })
      .click();
    await dialog.waitFor();
    for (let i = 0; i < 18; i++) {
      await page.keyboard.press("Tab");
      assert(
        await dialog.evaluate((el) => el.contains(document.activeElement)),
        "Keyboard focus stays inside dialog",
      );
    }
    await page.keyboard.press("Escape");
    await page.locator(".today-page").evaluate((el) => {
      el.scrollTop = 0;
    });
    await page.screenshot({ path: "artifacts/ui-review/today-mobile.png" });
    assert.deepEqual(errors, [], "No client runtime errors");
    console.log(
      "PASS: Today navigation, account stories, source provenance, filters, meeting preparation, focus, mobile overflow and reduced-motion workflow.",
    );
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
