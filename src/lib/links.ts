import 'server-only';

export function siteUrl(): string {
  return (process.env.SITE_URL || 'http://localhost:3000').replace(/\/+$/, '');
}

export function shareUrl(): string {
  return process.env.SHARE_URL || siteUrl();
}

export function privateLink(token: string): string {
  return `${siteUrl()}/b/${token}`;
}

/** wa.me link that opens a chat with this person, with their private link ready to send. */
export function waSendLink(name: string, phone: string, token: string): string {
  const digits = phone.replace(/\D/g, '');
  if (!digits) return '';
  const msg =
    `வணக்கம் ${name} 🙏\n` +
    'அரசு மேல்நிலைப் பள்ளி, வெள்ளாளங்குளம் முன்னாள் மாணவர் பக்கத்தில், உங்கள் பேட்ச்சில் யாரெல்லாம் இணைந்துள்ளனர் என்று பார்க்க இது உங்கள் தனிப்பட்ட இணைப்பு:\n' +
    `${privateLink(token)}\n\n(இந்த இணைப்பை மற்றவர்களுடன் பகிர வேண்டாம்.)`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(msg)}`;
}
