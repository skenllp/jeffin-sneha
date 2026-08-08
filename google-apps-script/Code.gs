/**
 * Sneha & Jeffin — RSVP backend
 * Paste this into Extensions > Apps Script on your Google Sheet.
 * See SETUP_RSVP.md for full deployment instructions.
 */

var NOTIFY_EMAILS = [
  "ccunni1968@gmail.com",
  "Anish.mathew2@gmail.com"
];

var SHEET_NAME = "RSVPs"; // change if you want a different tab name

function doPost(e) {
  var sheet = getOrCreateSheet_();

  var params = e.parameter || {};
  var name = params.name || "";
  var attending = params.attending || "";
  var guests = params.guests || "";
  var message = params.message || "";
  var timestamp = new Date();

  sheet.appendRow([timestamp, name, attending, guests, message]);

  sendNotificationEmail_(name, attending, guests, message, timestamp);

  return ContentService
    .createTextOutput(JSON.stringify({ status: "ok" }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: "RSVP endpoint is live" }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getOrCreateSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(["Timestamp", "Name", "Attending", "Guests", "Message"]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function sendNotificationEmail_(name, attending, guests, message, timestamp) {
  var subject = "New RSVP — " + name + " (" + attending + ")";
  var body =
    "A new RSVP came in for Sneha & Jeffin's wedding:\n\n" +
    "Name: " + name + "\n" +
    "Attending: " + attending + "\n" +
    "Guests: " + guests + "\n" +
    "Message: " + (message || "—") + "\n" +
    "Submitted: " + timestamp.toString() + "\n";

  NOTIFY_EMAILS.forEach(function (email) {
    MailApp.sendEmail(email, subject, body);
  });
}
