import 'server-only';
import nodemailer from 'nodemailer';

const esc = (s: string) => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!));

/** Sends the "your private link" email through Gmail. Returns false if email isn't set up. */
export async function sendLinksEmail(to: string, items: { name: string; year: number; link: string }[]): Promise<boolean> {
  const user = process.env.GMAIL_USER, pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) { console.warn('[recover] GMAIL_USER / GMAIL_APP_PASSWORD not set; email not sent'); return false; }

  const transport = nodemailer.createTransport({ service: 'gmail', auth: { user, pass } });
  const list = items.map(i =>
    `<p><b>${esc(i.name)}</b> (${i.year})<br><a href="${esc(i.link)}">${esc(i.link)}</a></p>`).join('');
  await transport.sendMail({
    from: `GHSS Vellalankulam Alumni <${user}>`,
    to,
    subject: 'GHSS Vellalankulam Alumni – உங்கள் தனிப்பட்ட இணைப்பு / Your private link',
    html:
      '<p>வணக்கம் 🙏</p><p>உங்கள் பேட்ச் பக்கத்தைத் திறக்க கீழே உள்ள இணைப்பைப் பயன்படுத்தவும். இதை மற்றவர்களுடன் பகிர வேண்டாம்.</p>' +
      "<p>Use the link below to open your batch page. Please don't share it with others.</p>" + list +
      '<p>– அரசு மேல்நிலைப் பள்ளி, வெள்ளாளங்குளம் முன்னாள் மாணவர் வலையமைப்பு</p>'
  });
  return true;
}
