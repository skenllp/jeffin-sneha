# Connect the RSVP form to Google Sheets

This adds a Google Sheet as the RSVP database, and emails
**ccunni1968@gmail.com** and **Anish.mathew2@gmail.com** every time
someone submits the form. The WhatsApp button still works exactly as
before — this runs alongside it.

## 1. Create the Google Sheet
1. Go to [sheets.google.com](https://sheets.google.com) and create a new,
   blank spreadsheet. Name it e.g. "Jeffin & Sneha RSVPs".

## 2. Add the script
1. In the Sheet, go to **Extensions → Apps Script**.
2. Delete the placeholder code and paste in the contents of
   `google-apps-script/Code.gs` (included in this folder).
3. Click the **Save** icon (or Ctrl/Cmd+S).

## 3. Deploy it as a web app
1. Click **Deploy → New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Set:
   - **Execute as:** Me
   - **Who has access:** Anyone
4. Click **Deploy**.
5. Google will ask you to authorize the script (it needs permission to
   write to the Sheet and send email on your behalf) — approve it.
6. Copy the **Web app URL** it gives you (ends in `/exec`).

## 4. Connect the site
1. Open `js/script.js`.
2. Find this line near the top of the RSVP section:
   ```js
   var SHEET_ENDPOINT = "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";
   ```
3. Replace the placeholder with the URL you copied, e.g.:
   ```js
   var SHEET_ENDPOINT = "https://script.google.com/macros/s/AKfycb.../exec";
   ```
4. Save and re-upload/redeploy your site.

## How it works
- When a guest submits the RSVP form, their name, attendance, guest
  count, and message are sent to the Apps Script, which:
  - Appends a row to a sheet tab called **RSVPs** (created automatically).
  - Emails a notification to both addresses above.
- The WhatsApp message still opens too, so nothing about the current
  behavior changes for guests.

## Updating the notified emails
Open `google-apps-script/Code.gs` in the Apps Script editor and edit the
`NOTIFY_EMAILS` list at the top, then click **Deploy → Manage deployments
→ Edit → New version → Deploy** to push the change live.

## Troubleshooting: RSVPs not appearing in the Sheet

**Do not add `mode: "cors"` or check `response.ok` on the fetch call.**
Google Apps Script web apps never send back CORS headers, so the browser
blocks the response before your code can read it — `response.ok` will
never be true, even when the row was written successfully. The form
in this project uses `mode: "no-cors"` on purpose: it's a fire‑and‑forget
request, so you can't inspect the result in the browser, but it's the
only reliable way to reach `doPost()` from a page hosted on a different
domain than script.google.com. If you (or an AI tool) ever "fix" a CORS
warning by switching to `mode: "cors"`, the form will look fine but stop
writing to the Sheet — that's exactly what happened here.

If RSVPs still aren't showing up after confirming the above, check:

1. **Test the endpoint directly.** Paste your Web app URL into a browser
   address bar and load it. You should see
   `{"status":"RSVP endpoint is live"}`. If you get a Google sign-in
   page or an error instead, the deployment's "Who has access" isn't
   set to **Anyone** — redeploy with that setting.
2. **Redeploy after any edit.** In Apps Script, clicking Save does *not*
   push changes to the live URL. After editing `Code.gs`, go to
   **Deploy → Manage deployments → Edit (pencil icon) → Version: New
   version → Deploy**.
3. **Check the Executions log.** In the Apps Script editor, open the
   clock icon ("Executions") on the left. Submit a test RSVP from the
   site — a `doPost` execution should appear within a few seconds. If
   nothing shows up, the request isn't reaching the script (double‑check
   the URL pasted into `js/script.js` matches the deployment exactly).
4. **Confirm the URL in `js/script.js`.** It must end in `/exec`, not
   `/dev` (a `/dev` URL only works for you while logged into Apps
   Script, not for guests visiting the site).
