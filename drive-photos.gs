/**
 * TWS Job Board → Google Drive photo store.
 * Paste into a new Apps Script project (script.google.com) signed in as luke@totalwelding.com.au.
 * Deploy → New deployment → Web app → Execute as: Me, Who has access: Anyone.
 * Put the web app URL in config.js as PHOTO_SCRIPT_URL.
 *
 * Only people let into the TWS Job Board can use it: every call carries their Firebase sign-in
 * token, and the script checks it by reading the crew list from Firestore with that token
 * (the security rules only allow crew to read it).
 */
const PROJECT_ID = 'tws-job-board';
const ROOT_NAME = 'TWS Job Board Photos';

function doPost(e) {
  try {
    const b = JSON.parse(e.postData.contents);
    if (!isCrew_(b.token)) return out_({ ok: false, error: 'not allowed' });
    const root = root_();
    if (b.action === 'put') {
      let folder = root;
      (b.path || []).forEach(name => { folder = sub_(folder, String(name).replace(/[\\/]/g, '-').slice(0, 80)); });
      const bytes = Utilities.base64Decode(String(b.data).split(',')[1]);
      const file = folder.createFile(Utilities.newBlob(bytes, 'image/jpeg', b.name || ('photo-' + Date.now() + '.jpg')));
      file.setDescription(b.note || '');
      return out_({ ok: true, id: file.getId(), url: file.getUrl() });
    }
    if (b.action === 'get' || b.action === 'del') {
      const file = DriveApp.getFileById(b.id);
      if (!inside_(file, root.getId())) return out_({ ok: false, error: 'not a job board photo' });
      if (b.action === 'del') { file.setTrashed(true); return out_({ ok: true }); }
      return out_({ ok: true, data: 'data:image/jpeg;base64,' + Utilities.base64Encode(file.getBlob().getBytes()) });
    }
    return out_({ ok: false, error: 'unknown action' });
  } catch (err) {
    return out_({ ok: false, error: String(err) });
  }
}

function isCrew_(token) {
  if (!token) return false;
  const cache = CacheService.getScriptCache(), key = 't' + Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, token)).slice(0, 40);
  if (cache.get(key)) return true;
  const r = UrlFetchApp.fetch('https://firestore.googleapis.com/v1/projects/' + PROJECT_ID + '/databases/(default)/documents/access/members',
    { headers: { Authorization: 'Bearer ' + token }, muteHttpExceptions: true });
  const ok = r.getResponseCode() === 200 || r.getResponseCode() === 404; // 404 = allowed but list not made yet (owner)
  if (ok) cache.put(key, '1', 600);
  return ok;
}
function root_() {
  const it = DriveApp.getFoldersByName(ROOT_NAME);
  return it.hasNext() ? it.next() : DriveApp.createFolder(ROOT_NAME);
}
function sub_(parent, name) {
  const it = parent.getFoldersByName(name);
  return it.hasNext() ? it.next() : parent.createFolder(name);
}
function inside_(file, rootId) {
  const seen = {}, stack = [];
  const ps = file.getParents(); while (ps.hasNext()) stack.push(ps.next());
  while (stack.length) {
    const f = stack.pop(); if (f.getId() === rootId) return true; if (seen[f.getId()]) continue; seen[f.getId()] = 1;
    const up = f.getParents(); while (up.hasNext()) stack.push(up.next());
  }
  return false;
}
function out_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
