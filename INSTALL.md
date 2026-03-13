# Installing Bake Lady on your Mac

These instructions are written for people who have never used Terminal before.
The whole process takes about 5 minutes the first time.

---

## What you will need

- A Mac running macOS 12 or later
- An internet connection for the initial setup

---

## Step 1 — Download the app

1. Go to the Bake Lady page on GitHub (your baker will give you the link).
2. Click the green **Code** button near the top right of the page.
3. Click **Download ZIP**.
4. A file called `bake-lady-main.zip` (or similar) will appear in your Downloads folder.

---

## Step 2 — Unzip the file

1. Open your **Downloads** folder in Finder.
2. Double-click the `bake-lady-main.zip` file.
3. A new folder called `bake-lady-main` will appear next to the zip file.

---

## Step 3 — Open Terminal

Terminal is a built-in Mac app that lets you type instructions to your computer.
You only need to use it once during this setup.

**How to open Terminal:**
1. Press **Command + Space** to open Spotlight Search.
2. Type `Terminal` and press **Enter**.

> Not sure how to open Terminal? Apple has a short guide here:
> https://support.apple.com/guide/terminal/open-or-quit-terminal-apd5265185d-f365-44cb-8b09-71a064a42125/mac

---

## Step 4 — Run the install command

Copy the line below exactly as written, paste it into Terminal, and press **Enter**:

```
cd ~/Downloads/bake-lady-main && bash install.sh
```

The script will:
- Check that the right tools are installed on your Mac (and install them if not — it will ask first)
- Build the app
- Save it to a folder called **Bake Lady** in your home folder
- Open it in your browser automatically

When you see the message **"All done! Bake Lady is open in your browser."**, you are finished.

> The first run may take a few minutes while tools are downloaded. Subsequent runs are much faster.

---

## Step 5 — Open Bake Lady in future

Once installed, you do not need Terminal again.

To open Bake Lady:
1. Open **Finder**.
2. In the left sidebar, click your home folder (the one with your name and a house icon).
3. Open the **Bake Lady** folder.
4. Double-click **index.html**.

Your browser will open with your recipes.

---

## Your recipes stay private

Everything is saved on your Mac only. Nothing is sent to the internet.
Your recipe data lives in your browser's local storage — it stays even if you close the browser.

---

## Updating Bake Lady

When a new version is released:
1. Download the new ZIP from GitHub (Step 1).
2. Unzip it (Step 2).
3. Run the install command again (Steps 3–4).

Your existing recipes will not be affected.

---

## Something went wrong?

If you see a red error message, try:
- Making sure you are connected to the internet
- Running the install command again — most problems fix themselves on a second try

If it still does not work, send a screenshot of the Terminal window to whoever set this up for you.
