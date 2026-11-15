/**
 * OLD LINK → NEW SITE
 * Use this AFTER the new website is live and the data is imported.
 *
 * In the old Apps Script project, replace Code.gs with this file (you can leave Index.html
 * as it is – it's no longer used), then Deploy → Manage deployments → ✏️ Edit → New version.
 *
 * Effect:
 *   • The TinyURL and the old /exec link now open the new site.
 *   • Old private links (…/exec?t=xxxx) open the same person's batch page on the new site.
 */
const NEW_SITE = 'https://ghss-vellalankulam.vercel.app';   // ← change to your Vercel address

function doGet(e) {
  const t = String((e && e.parameter && e.parameter.t) || '').toLowerCase();
  const url = /^[a-f0-9]{32}$/.test(t) ? NEW_SITE + '/b/' + t : NEW_SITE;
  const html =
    '<!DOCTYPE html><html><head><base target="_top"><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width, initial-scale=1"></head>' +
    '<body style="font-family:sans-serif;text-align:center;padding:40px 16px">' +
    '<p>புதிய இணையதளத்திற்குச் செல்கிறது… / Opening the new site…</p>' +
    '<p><a href="' + url + '" target="_top" style="display:inline-block;padding:14px 22px;background:#1a73e8;color:#fff;' +
    'border-radius:10px;text-decoration:none;font-weight:bold">இங்கே அழுத்தவும் / Tap here</a></p>' +
    '<script>try{window.top.location.href=' + JSON.stringify(url) + '}catch(e){}</script>' +
    '</body></html>';
  return HtmlService.createHtmlOutput(html)
    .setTitle('GHSS Vellalankulam Alumni')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
