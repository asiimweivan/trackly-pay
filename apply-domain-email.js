// apply-domain-email.js - run in the root of EACH repo (mobile, backend, admin, pay). It only touches files it finds.
// Public contact: contact.ivanexo@gmail.com -> support@ivanexo.com. Sender default: noreply@trackly.rw -> noreply@ivanexo.com.
const fs = require('fs'), path = require('path');
const G = 'contact.ivanexo@gmail.com', S = 'support@ivanexo.com';
const J = (...p) => path.join(...p);
// [file, needle, replacement, exact count or 0 for "at least one"]
const EDITS = [
  // mobile
  [J('src','screens','settings','SettingsScreen.tsx'), G, S, 0],
  [J('src','screens','subscription','LockedAccountScreen.tsx'), G, S, 0],
  [J('src','screens','subscription','SubscriptionScreen.tsx'), G, S, 0],
  [J('src','screens','sales','InvoiceHistoryScreen.tsx'), 'trackly.rw &bull; ', '', 1],
  [J('src','screens','sales','QuotationsScreen.tsx'), 'trackly.rw &bull; ', '', 1],
  [J('src','screens','sales','ReceiptScreen.tsx'), 'trackly.rw</Text>', 'Ivanexo Ltd</Text>', 1],
  // backend
  [J('src','main','java','rw','trackly','admin','service','AccountLifecycleService.java'), G, S, 0],
  [J('src','main','java','rw','trackly','auth','service','AuthService.java'), G, S, 0],
  [J('src','main','java','rw','trackly','subscription','service','PayTexts.java'), G, S, 0],
  [J('src','main','java','rw','trackly','support','dto','SupportDtos.java'), G, S, 0],
  [J('src','main','java','rw','trackly','support','entity','SupportTicket.java'), G, S, 0],
  [J('src','main','java','rw','trackly','auth','service','EmailService.java'), 'noreply@trackly.rw', 'noreply@ivanexo.com', 1],
  [J('src','main','java','rw','trackly','subscription','service','PayMailer.java'), 'noreply@trackly.rw', 'noreply@ivanexo.com', 1],
  [J('src','main','resources','application.properties'), 'noreply@trackly.rw', 'noreply@ivanexo.com', 1],
  [J('src','main','java','rw','trackly','staff','service','StaffInviteService.java'), 'https://app.trackly.rw/invite', 'https://trackly.ivanexo.com/invite', 1],
  // admin
  [J('src','pages','Support.tsx'), G, S, 0],
  // pay pages
  ['delete-account.html', G, S, 0],
  ['index.html', G, S, 0],
  ['privacy.html', G, S, 0],
];
// NOT touched on purpose: SupportService.java (internal ticket notification inbox stays the Gmail address).
function fail(m) { console.log('FAIL: ' + m); process.exit(1); }
const todo = []; let found = 0;
for (const [f, needle, rep, exact] of EDITS) {
  if (!fs.existsSync(f)) continue;
  found++;
  const s = fs.readFileSync(f, 'latin1');
  const n = s.split(needle).length - 1;
  if (n === 0) { if (s.includes(rep) || rep === '') continue; fail(f + ': "' + needle + '" not found; nothing changed'); }
  if (exact && n !== exact) fail(f + ': "' + needle + '" found ' + n + ' times, expected ' + exact + '; nothing changed');
  todo.push([f, s.split(needle).join(rep), n]);
}
if (!found) fail('none of the expected files found; run this in the root of a Trackly repo');
if (!todo.length) { console.log('Already applied'); process.exit(0); }
for (const [f, out, n] of todo) { fs.writeFileSync(f, out, 'latin1'); console.log('patched ' + f + ' (' + n + ')'); }
