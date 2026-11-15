export type Lang = 'ta' | 'en';

export const T = {
  en: {
    school: 'Government Higher Secondary School, Vellalankulam',
    title: 'Alumni Details Form', subtitle: 'Please fill in your details',
    batchTitle: 'Your Batch', batchSub: 'Find your batchmates',
    name: 'Name of the Student', father: "Father's Name", door: 'Door No.', street: 'Street Name',
    village: 'Village Name', year: 'Passed Out Year', phone: 'Contact Number', email: 'Email', emailErr: 'Enter a valid email address',
    worked: 'Worked As', current: 'Currently Doing',
    optional: '(optional)', select: '— Select —',
    workedPh: 'e.g. Teacher, Driver, Engineer', otherPh: 'Please specify',
    required: 'This field is required', phoneErr: 'Enter a valid 10-digit mobile number', phoneErrIntl: 'Enter a valid phone number with country code', otherCode: 'Other',
    consent: 'Allow my batchmates to see my phone number', consentHint: 'You can change this any time later.',
    submit: 'Submit & see my batch', submitting: 'Submitting…',
    errGeneric: 'Something went wrong. Please try again.',
    errDuplicate: 'This student is already registered with this number. Use your private link, or get it again by email below.',
    errYear: 'Please select a valid year.',
    newTitle: 'New!', newBody: 'After you register, you can instantly see who from your batch (same year) has already joined.',
    returningMsg: 'You have already registered on this phone.', viewMyBatch: 'View my batch',
    lostQ: 'Already registered and lost your link?', lostTitle: 'Get your link again',
    lostBody: 'Enter the email you gave while registering. We will send your private link.', send: 'Send',
    lostSent: 'If this email is registered, your link will arrive in a few minutes. Check spam too.',
    lostNoEmail: 'If you did not give an email, please contact the alumni group admin.',
    badLink: 'This link is not valid. Please register, or get your link again by email.',
    goToForm: 'Go to the form',
    saved: 'Thank you! Your details have been saved.',
    hello: 'Hello, {name}!', yourBatch: 'Your batch',
    joined: '<b>{n}</b> joined so far', joined1: '<b>1</b> joined so far',
    nudgeFirst: "You're the first from {year}! 🎉 Invite your batchmates — they'll appear here.",
    nudgeFew: 'Invite the batchmates you know — they will show up here too!',
    nudgeMany: "Great start! Keep inviting — let's get everyone from {year}.",
    invite: 'Invite my batchmates',
    inviteMsg: "I've joined the alumni list of Government Higher Secondary School, Vellalankulam – {year} batch 🎓\n{n} of our batch have joined so far. Join too and see which of our old friends are here 👇\n{url}",
    inviteMsg1: "I've joined the alumni list of Government Higher Secondary School, Vellalankulam – {year} batch 🎓\nI'm the first from our batch! Join too and let's bring our old friends together 👇\n{url}",
    you: 'You', emptyYear: 'Nobody from {year} has joined yet.', inviteThem: 'Know someone from {year}? Invite them',
    allBatches: 'All batches', totalAlumni: '<b>{n}</b> alumni have joined',
    showMine: 'Show my phone number to batchmates', showMineHint: 'Only then can batchmates call or WhatsApp you.',
    saveTitle: '🔑 Your private link',
    saveBody: 'Save this link to come back to this page any time. Please don’t share it with others.',
    copy: 'Copy link', copied: 'Copied ✓', toMyWa: 'Send to my WhatsApp',
    selfMsg: 'My GHSS Vellalankulam alumni batch page (private link):\n{link}',
    registerAnother: '+ Register someone else',
    hiddenNo: 'Number hidden', call: 'Call', waTip: 'WhatsApp',
    saveFail: 'Could not save. Please try again.',
    introHello: 'Dear Alumni,',
    introLead: 'We are collecting these details to strengthen the alumni network of <b>Government Higher Secondary School, Vellalankulam</b>. This will help us:',
    intro1: 'Reconnect old friends and classmates who have lost touch over the years',
    intro2: 'Guide current students on higher studies and careers through your experience',
    intro3: 'Keep you informed about alumni meets and school events',
    intro4: 'Work together for the growth of our school and our villages',
    introNote: 'Your details are used only for the alumni network. Batchmates see only your name, village and current work; your phone number only if you allow it. 🙏'
  },
  ta: {
    school: 'அரசு மேல்நிலைப் பள்ளி, வெள்ளாளங்குளம்',
    title: 'முன்னாள் மாணவர் விவரப்படிவம்', subtitle: 'உங்கள் விவரங்களை நிரப்பவும்',
    batchTitle: 'உங்கள் பேட்ச்', batchSub: 'உங்கள் பேட்ச் நண்பர்களைக் கண்டறியுங்கள்',
    name: 'மாணவரின் பெயர்', father: 'தந்தையின் பெயர்', door: 'கதவு எண்', street: 'தெருவின் பெயர்',
    village: 'கிராமத்தின் பெயர்', year: 'பள்ளிப் படிப்பை முடித்த ஆண்டு', phone: 'தொடர்பு எண்', email: 'மின்னஞ்சல்', emailErr: 'சரியான மின்னஞ்சல் முகவரியை உள்ளிடவும்',
    worked: 'முன்பு செய்த பணி', current: 'தற்போது செய்வது',
    optional: '(விருப்பம்)', select: '— தேர்ந்தெடுக்கவும் —',
    workedPh: 'எ.கா. ஆசிரியர், ஓட்டுநர், பொறியாளர்', otherPh: 'விவரத்தைக் குறிப்பிடவும்',
    required: 'இதை நிரப்புவது அவசியம்', phoneErr: 'சரியான 10 இலக்க கைபேசி எண்ணை உள்ளிடவும்', phoneErrIntl: 'நாட்டுக் குறியீட்டுடன் சரியான தொலைபேசி எண்ணை உள்ளிடவும்', otherCode: 'மற்றவை',
    consent: 'என் தொலைபேசி எண்ணை என் பேட்ச் நண்பர்கள் பார்க்க அனுமதிக்கிறேன்', consentHint: 'இதை பின்னர் எப்போது வேண்டுமானாலும் மாற்றலாம்.',
    submit: 'சமர்ப்பித்து என் பேட்ச்சைப் பார்', submitting: 'சமர்ப்பிக்கப்படுகிறது…',
    errGeneric: 'ஏதோ தவறு நடந்தது. மீண்டும் முயற்சிக்கவும்.',
    errDuplicate: 'இந்த மாணவர் இந்த எண்ணுடன் ஏற்கனவே பதிவு செய்யப்பட்டுள்ளார். உங்கள் தனிப்பட்ட இணைப்பைப் பயன்படுத்தவும், அல்லது கீழே மின்னஞ்சல் மூலம் மீண்டும் பெறவும்.',
    errYear: 'சரியான ஆண்டைத் தேர்ந்தெடுக்கவும்.',
    newTitle: 'புதியது!', newBody: 'பதிவு செய்ததும், உங்கள் பேட்ச்சில் (அதே ஆண்டு) யாரெல்லாம் ஏற்கனவே இணைந்துள்ளனர் என்று உடனே பார்க்கலாம்.',
    returningMsg: 'இந்த கைபேசியில் நீங்கள் ஏற்கனவே பதிவு செய்துள்ளீர்கள்.', viewMyBatch: 'என் பேட்ச்சைப் பார்க்கவும்',
    lostQ: 'ஏற்கனவே பதிவு செய்து, இணைப்பைத் தொலைத்துவிட்டீர்களா?', lostTitle: 'உங்கள் இணைப்பை மீண்டும் பெற',
    lostBody: 'பதிவின்போது கொடுத்த மின்னஞ்சலை உள்ளிடவும். உங்கள் தனிப்பட்ட இணைப்பை அனுப்புகிறோம்.', send: 'அனுப்பு',
    lostSent: 'இந்த மின்னஞ்சல் பதிவு செய்யப்பட்டிருந்தால், சில நிமிடங்களில் இணைப்பு வரும். Spam பகுதியையும் பார்க்கவும்.',
    lostNoEmail: 'மின்னஞ்சல் கொடுக்கவில்லை என்றால், முன்னாள் மாணவர் குழு நிர்வாகியைத் தொடர்பு கொள்ளவும்.',
    badLink: 'இந்த இணைப்பு செல்லாது. பதிவு செய்யவும், அல்லது மின்னஞ்சல் மூலம் உங்கள் இணைப்பை மீண்டும் பெறவும்.',
    goToForm: 'படிவத்திற்குச் செல்லவும்',
    saved: 'நன்றி! உங்கள் விவரங்கள் சேமிக்கப்பட்டன.',
    hello: 'வணக்கம், {name}!', yourBatch: 'உங்கள் பேட்ச்',
    joined: 'இதுவரை <b>{n}</b> பேர் இணைந்துள்ளனர்', joined1: 'இதுவரை <b>1</b> நபர் இணைந்துள்ளார்',
    nudgeFirst: '{year} பேட்ச்சில் நீங்கள்தான் முதல் நபர்! 🎉 உங்கள் நண்பர்களை அழையுங்கள், அவர்கள் இங்கே தோன்றுவார்கள்.',
    nudgeFew: 'உங்களுக்குத் தெரிந்த பேட்ச் நண்பர்களை அழையுங்கள், அவர்களும் இங்கே தோன்றுவார்கள்!',
    nudgeMany: 'நல்ல தொடக்கம்! {year} பேட்ச்சின் அனைவரையும் இணைக்க தொடர்ந்து அழையுங்கள்.',
    invite: 'என் பேட்ச் நண்பர்களை அழைக்கவும்',
    inviteMsg: 'நான் அரசு மேல்நிலைப் பள்ளி, வெள்ளாளங்குளம் – {year} பேட்ச் முன்னாள் மாணவர் பட்டியலில் இணைந்துவிட்டேன் 🎓\nஇதுவரை நம் பேட்ச்சில் {n} பேர் இணைந்துள்ளனர். நீங்களும் இணைந்து, நம் பழைய நண்பர்கள் யாரெல்லாம் இருக்கிறார்கள் என்று பாருங்கள் 👇\n{url}',
    inviteMsg1: 'நான் அரசு மேல்நிலைப் பள்ளி, வெள்ளாளங்குளம் – {year} பேட்ச் முன்னாள் மாணவர் பட்டியலில் இணைந்துவிட்டேன் 🎓\nநம் பேட்ச்சில் நான்தான் முதல் நபர்! நீங்களும் இணைந்து, நம் பழைய நண்பர்களை ஒன்றிணைப்போம் 👇\n{url}',
    you: 'நீங்கள்', emptyYear: '{year} பேட்ச்சிலிருந்து இன்னும் யாரும் இணையவில்லை.', inviteThem: '{year} பேட்ச்சில் யாரையாவது தெரியுமா? அழையுங்கள்',
    allBatches: 'எல்லா பேட்ச்களும்', totalAlumni: 'மொத்தம் <b>{n}</b> முன்னாள் மாணவர்கள் இணைந்துள்ளனர்',
    showMine: 'என் தொலைபேசி எண்ணை பேட்ச் நண்பர்களுக்குக் காட்டு', showMineHint: 'அப்போதுதான் நண்பர்கள் உங்களை அழைக்கவோ WhatsApp செய்யவோ முடியும்.',
    saveTitle: '🔑 உங்கள் தனிப்பட்ட இணைப்பு',
    saveBody: 'எப்போது வேண்டுமானாலும் இந்தப் பக்கத்திற்குத் திரும்ப வர இந்த இணைப்பைச் சேமித்து வைக்கவும். இதை மற்றவர்களுடன் பகிர வேண்டாம்.',
    copy: 'இணைப்பை நகலெடு', copied: 'நகலெடுக்கப்பட்டது ✓', toMyWa: 'என் WhatsApp-க்கு அனுப்பு',
    selfMsg: 'என் GHSS வெள்ளாளங்குளம் முன்னாள் மாணவர் பேட்ச் பக்கம் (தனிப்பட்ட இணைப்பு):\n{link}',
    registerAnother: '+ மற்றொருவரைப் பதிவு செய்ய',
    hiddenNo: 'எண் மறைக்கப்பட்டுள்ளது', call: 'அழை', waTip: 'WhatsApp',
    saveFail: 'சேமிக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.',
    introHello: 'அன்புள்ள முன்னாள் மாணவர்களே,',
    introLead: 'நமது <b>அரசு மேல்நிலைப் பள்ளி, வெள்ளாளங்குளம்</b> முன்னாள் மாணவர் வலையமைப்பை வலுப்படுத்தும் நோக்கில் உங்கள் விவரங்களைச் சேகரிக்கிறோம். இதன் மூலம்:',
    intro1: 'பல ஆண்டுகளாகத் தொடர்பில் இல்லாத நண்பர்களையும் வகுப்புத் தோழர்களையும் மீண்டும் இணைக்கலாம்',
    intro2: 'இன்றைய மாணவர்களுக்கு உயர்கல்வி, வேலைவாய்ப்பு குறித்த வழிகாட்டுதல் வழங்கலாம்',
    intro3: 'முன்னாள் மாணவர் சந்திப்புகள், பள்ளி விழாக்கள் பற்றிய தகவல்களை உங்களுக்குத் தெரிவிக்கலாம்',
    intro4: 'பள்ளியின் வளர்ச்சிக்கும் நமது கிராமங்களின் முன்னேற்றத்துக்கும் இணைந்து பங்களிக்கலாம்',
    introNote: 'உங்கள் விவரங்கள் முன்னாள் மாணவர் வலையமைப்புக்காக மட்டுமே பயன்படுத்தப்படும். உங்கள் பெயர், ஊர், தற்போதைய பணி மட்டுமே பேட்ச் நண்பர்களுக்குத் தெரியும்; தொலைபேசி எண் உங்கள் அனுமதியுடன் மட்டுமே. 🙏'
  }
} as const;

export type Key = keyof typeof T['en'];

/** Translate with {placeholders}. */
export function tr(lang: Lang, k: Key, vars?: Record<string, string | number>): string {
  let s: string = T[lang][k] ?? T.en[k] ?? k;
  if (vars) for (const v of Object.keys(vars)) s = s.split('{' + v + '}').join(String(vars[v]));
  return s;
}

/** "Currently doing" options – the value saved is always English, for easy filtering. */
export const CURRENT = [
  { v: 'Studying', en: 'Studying', ta: 'படித்துக்கொண்டிருக்கிறேன்' },
  { v: 'Government Job', en: 'Government Job', ta: 'அரசு வேலை' },
  { v: 'Private Job', en: 'Private Job', ta: 'தனியார் வேலை' },
  { v: 'Own Business', en: 'Own Business', ta: 'சொந்தத் தொழில்' },
  { v: 'Farming', en: 'Farming', ta: 'விவசாயம்' },
  { v: 'Working Abroad', en: 'Working Abroad', ta: 'வெளிநாட்டில் வேலை' },
  { v: 'Looking for Job', en: 'Looking for a Job', ta: 'வேலை தேடுகிறேன்' },
  { v: 'Homemaker', en: 'Homemaker', ta: 'இல்லத்தரசி' },
  { v: 'Retired', en: 'Retired', ta: 'ஓய்வு பெற்றவர்' },
  { v: 'Other', en: 'Other', ta: 'மற்றவை' }
] as const;

export function doingLabel(d: string, lang: Lang): string {
  if (/^Other:\s*/i.test(d)) return d.replace(/^Other:\s*/i, '');
  const o = CURRENT.find(c => c.v === d);
  return o ? o[lang] : d;
}

/** Country codes – India first, then where alumni commonly work. */
export const CODES: ReadonlyArray<readonly [string, string]> = [
  ['+91', '🇮🇳'], ['+971', '🇦🇪'], ['+966', '🇸🇦'], ['+974', '🇶🇦'], ['+965', '🇰🇼'], ['+968', '🇴🇲'], ['+973', '🇧🇭'],
  ['+65', '🇸🇬'], ['+60', '🇲🇾'], ['+94', '🇱🇰'], ['+1', '🇺🇸'], ['+44', '🇬🇧'], ['+61', '🇦🇺'], ['+64', '🇳🇿'], ['+49', '🇩🇪']
];
