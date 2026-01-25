
import { Guide, Tip, Badge, EmergencyNumber, WeatherAlert } from './types';

export const EMERGENCY_NUMBERS: EmergencyNumber[] = [
  { label: { en: 'Emergency (Unified)', ar: 'الطوارئ الموحد', ur: 'متحدہ ہنگامي نمبر', hi: 'যুনীফাইড এমারجেন্সী', bn: 'একীভূত জরুরি' }, number: '911', region: 'KSA' },
  { label: { en: 'Ambulance', ar: 'الإسعاف', ur: 'ایمبولینس', hi: 'এম্বুলেন্স', bn: 'অ্যাম্বুলেন্স' }, number: '997', region: 'KSA' },
  { label: { en: 'Fire Dept', ar: 'الدفاع المدني', ur: 'فائر ڈیپارٹمنٹ', hi: 'দমকল বিভাগ', bn: 'দমকল বিভাগ' }, number: '998', region: 'KSA' },
  { label: { en: 'Police (General)', ar: 'الشرطة', ur: 'پولیس', hi: 'पुलिस', bn: 'पुलिस' }, number: '999', region: 'KSA' },
  { label: { en: 'Global Emergency', ar: 'طوارئ عالمية', ur: 'عالمی ہنگامی نمبر', hi: 'বৈশ্বিক জরুরি', bn: 'বৈশ্বিক জরুরি' }, number: '112', region: 'Global' }
];

export const WEATHER_ALERTS: WeatherAlert[] = [
  {
    id: 'w1',
    type: 'sandstorm',
    severity: 'high',
    title: { en: 'Sandstorm Advisory', ar: 'تنبيه عاصفة رملية', ur: 'ریت کے طوفان کی وارننگ', hi: 'ধূলিঝড় সতর্কতা', bn: 'ধূলিঝড় সতর্কতা' },
    advisory: { 
      en: 'High winds expected. Visibility below 10m. Stay indoors and seal windows.', 
      ar: 'من المتوقع هبوب رياح قوية. الرؤية أقل من 10 أمتار. ابق في الداخل وأغلق النوافذ.', 
      ur: 'تیز ہواؤں کی توقع ہے۔ بصارت 10 میٹر سے کم ہے۔ گھر کے اندر رہیں اور کھڑکیاں بند رکھیں۔', 
      hi: 'तेज हवाओं की उम्मीद है। दृश्यता 10 मीटर से कम। घर के अंदर रहें और खिड़कियां बंद करें।', 
      bn: 'প্রবল বাতাসের সম্ভাবনা। দৃশ্যমানতা ১০ মিটারের নিচে। বাড়ির ভেতরে থাকুন এবং জানালা বন্ধ রাখুন।' 
    }
  },
  {
    id: 'w2',
    type: 'heatwave',
    severity: 'extreme',
    title: { en: 'Extreme Heatwave', ar: 'موجة حر شديدة', ur: 'شدید گرمی کی لہر', hi: 'अत्यधिक गर्मी की लहर', bn: 'প্রচণ্ড তাপপ্রবাহ' },
    advisory: { 
      en: 'Temperatures exceeding 50°C. Avoid direct sun. Drink 500ml water every hour.', 
      ar: 'درجات الحرارة تتجاوز 50 درجة مئوية. تجنب الشمس المباشرة. اشرب 500 مل من الماء كل ساعة.', 
      ur: 'درجہ حرارت 50 ڈگری سینٹی گریڈ سے تجاوز کر رہا ہے۔ براہ راست دھوپ سے بچیں۔ ہر گھنٹے میں 500 ملی لیٹر پانی پییں۔', 
      hi: 'तापमान 50 डिग्री सेल्सियस से अधिक। सीधी धूप से बचें। हर घंटे 500 मिली पानी पिएं।', 
      bn: 'তাপমাত্রা ৫০ ডিগ্রি সেলসিয়াস ছাড়িয়ে যেতে পারে। সরাসরি রোদ এড়িয়ে চলুন। প্রতি ঘণ্টায় ৫০০ মিলি জল পান করুন।' 
    }
  }
];

export const INITIAL_GUIDES: Guide[] = [
  // HEALTH
  {
    id: 'severe-bleeding',
    version: 1,
    category: 'health',
    title: { en: 'Severe Bleeding', ar: 'النزيف الحاد', ur: 'شدید خون بہنا', hi: 'মারাত্মক রক্তপাত', bn: 'মারাত্মক রক্তপাত' },
    content: [
      { en: '1. Apply firm, direct pressure with a clean cloth.', ar: '1. اضغط بقوة ومباشرة بقطعة قماش نظيفة.', ur: '1. صاف کپڑے سے براہ راست دباؤ ڈالیں۔', hi: '১. পরিষ্কার কাপড় দিয়ে সরাসরি চাপ दिन।', bn: '১. পরিষ্কার কাপড় দিয়ে সরাসরি চাপ দিন।' },
      { en: '2. Keep pressure until help arrives. If the cloth is soaked, do not remove it; add more layers on top.', ar: '2. استمر في الضغط حتى وصول المساعدة. إذا امتلأ القماش بالدم، لا تنزعه؛ أضف طبقات أخرى فوقه.', ur: '2. مدد آنے تک دباؤ برقرار رکھیں۔ اگر کپڑا بھیگ جائے تو اسے نہ ہٹائیں؛ اوپر مزید تہیں لگائیں।', hi: '२. मदद आने तक दबाव बनाए रखें। यदि कपड़ा भीग जाए, तो उसे न हटाएँ; ऊपर से और परतें जोड़ें।', bn: '২. সাহায্য না আসা পর্যন্ত চাপ বজায় রাখুন। কাপড় ভিজে গেলে সরাবেন না; উপরে আরও স্তর দিন।' }
    ]
  },
  {
    id: 'cpr',
    version: 1,
    category: 'health',
    title: { en: 'Basic CPR (Adult)', ar: 'الإنعاش القلبي الرئوي', ur: 'سی پی آر', hi: 'सीपीआर (वयस्क)', bn: 'সিপিআর (বয়স্ক)' },
    content: [
      { en: '1. Push hard and fast in the center of the chest.', ar: '1. اضغط بقوة وسرعة في منتصف الصدر.', ur: '1. سینے کے درمیان زور سے اور جلدی دبائیں۔', hi: '१. छाती के बीच में जोर से और तेजी से दबाएं।', bn: '১. বুকের মাঝখানে জোরে এবং দ্রুত চাপ দিন।' },
      { en: '2. Aim for 100-120 compressions per minute and a depth of 5cm (2 inches).', ar: '2. استهدف 100-120 ضغطة في الدقيقة وبعمق 5 سم.', ur: '2. فی منٹ 100-120 بار اور 5 سینٹی میٹر گہرائی تک دبائیں۔', hi: '२. प्रति मिनट १००-१२० संपीड़न और ५ सेमी की गहराई का लक्ष्य रखें।', bn: '২. প্রতি মিনিটে ১০০-১২০ বার চাপ দিন এবং ৫ সেমি গভীরতা বজায় রাখুন।' }
    ]
  },
  {
    id: 'burns',
    version: 1,
    category: 'health',
    title: { en: 'Burn Treatment', ar: 'علاج الحروق', ur: 'جلنے کا علاج', hi: 'जलन का उपचार', bn: 'পোড়া চিকিৎসার গাইড' },
    content: [
      { en: '1. Run cool (not cold) water over the burn for 10-20 minutes.', ar: '1. مرر الماء البارد (ليس المثلج) فوق الحرق لمدة 10-20 دقيقة.', ur: '1. 10-20 منٹ تک جلنے والی جگہ پر ٹھنڈا (برف والا نہیں) پانی ڈالیں۔', hi: '१. जलन पर १०-२० मिनट तक ठंडा (बर्फ नहीं) पानी चलाएं।', bn: '১. পোড়া জায়গার ওপর ১০-২০ মিনিট ঠান্ডা (বরফ নয়) জল ঢালুন।' },
      { en: '2. Cover with a sterile non-stick bandage or clean plastic wrap.', ar: '2. غطِّه بضمادة معقمة غير لاصقة أو غلاف بلاستيكي نظيف.', ur: '2. جراثیم سے پاک پٹی یا صاف پلاسٹک ریپ سے ڈھانپیں۔', hi: '२. एक बाँझ नॉन-स्टिक पट्टी या साफ प्लास्टिक रैप के साथ कवर करें।', bn: '২. জীবাণুমুক্ত নন-স্টিক ব্যান্ডেজ বা পরিষ্কার প্লাস্টিক দিয়ে ঢেকে দিন।' }
    ]
  },
  // SECURITY
  {
    id: 'lost-wallet',
    version: 1,
    category: 'security',
    title: { en: 'Lost Wallet/ID', ar: 'فقدان المحفظة/الهوية', ur: 'بٹوہ یا شناختی کارڈ کھونا', hi: 'खोया हुआ बटुआ/आईडी', bn: 'ওয়ালেট/আইডি হারানো' },
    content: [
      { en: '1. Immediately freeze all cards via banking apps.', ar: '1. جمد جميع البطاقات عبر تطبيقات البنك فوراً.', ur: '1. فوری طور پر بینک ایپس کے ذریعے تمام کارڈز منجمد کریں۔', hi: '१. तुरंत बैंकिंग ऐप के माध्यम से सभी कार्ड फ्रीज करें।', bn: '১. অবিলম্বে ব্যাংকিং অ্যাপের মাধ্যমে সমস্ত কার্ড ব্লক করুন।' },
      { en: '2. Report lost IDs via Absher (KSA) or local police stations.', ar: '2. أبلغ عن الهوية المفقودة عبر أبشر أو مراكز الشرطة.', ur: '2. ابشر یا مقامی پولیس اسٹیشن کے ذریعے گمشدہ شناختی کارڈ کی اطلاع دیں۔', hi: '२. एबशर (KSA) या स्थानीय पुलिस स्टेशनों के माध्यम से खोई हुई आईडी की रिपोर्ट करें।', bn: '২. আবশের বা স্থানীয় পুলিশের কাছে আইডি হারানোর রিপোর্ট করুন।' }
    ]
  },
  {
    id: 'scam-alert',
    version: 1,
    category: 'security',
    title: { en: 'Digital Scams', ar: 'الاحتيال الرقمي', ur: 'ڈیجیٹل دھوکہ دہی', hi: 'डिजिटल घोटाले', bn: 'ডিজিটাল স্ক্যাম সতর্কতা' },
    content: [
      { en: '1. Never share OTP codes or passwords with anyone calling.', ar: '1. لا تشارك أبداً رموز التحقق (OTP) أو كلمات المرور مع أي متصل.', ur: '1. کال کرنے والے کسی بھی شخص کے ساتھ کبھی भी OTP کوڈ یا پاس ورڈ شیئر نہ کریں۔', hi: '१. कॉल करने वाले किसी के भी साथ ओटीपी कोड या पासवर्ड कभी साझा न करें।', bn: '১. ফোনে কাউকেই ওটিপি (OTP) বা পাসওয়ার্ড জানাবেন না।' },
      { en: '2. Verified entities will never ask for sensitive data over the phone.', ar: '2. الجهات الموثوقة لن تطلب أبداً بيانات حساسة عبر الهاتف.', ur: '2. تصدیق شدہ ادارے فون پر کبھی بھی حساس ڈیٹا نہیں مانگیں گے۔', hi: '२. सत्यापित संस्थाएं फोन पर संवेदनशील डेटा कभी नहीं मांगेंगी।', bn: '২. সরকারি বা ব্যাংক কর্মীরা ফোনে কখনো গোপন তথ্য চায় না।' }
    ]
  },
  // AUTO
  {
    id: 'car-overheat',
    version: 1,
    category: 'auto',
    title: { en: 'Car Overheating', ar: 'ارتفاع حرارة السيارة', ur: 'گاڑی کا گرم ہونا', hi: 'कार का ओवरहीटिंग', bn: 'গাড়ি গরম হওয়া' },
    content: [
      { en: '1. Turn off A/C and turn on the interior heater to pull heat from the engine.', ar: '1. أطفئ التكييف وشغل التدفئة الداخلية لسحب الحرارة من المحرك.', ur: '1. اے سی بند کریں اور انجن سے گرمی نکالنے کے لیے اندرونی ہیٹر آن کریں۔', hi: '१. एसी बंद करें और इंजन से गर्मी खींचने के लिए इंटीरियर हीटर चालू करें।', bn: '১. এসি বন্ধ করুন এবং ইঞ্জিন থেকে তাপ সরাতে ইন্টারিয়র হিটার চালু করুন।' },
      { en: '2. Pull over safely. Wait at least 30 mins before opening the radiator cap.', ar: '2. توقف بأمان. انتظر 30 دقيقة على الأقل قبل فتح غطاء الراديتر.', ur: '2. گاڑی محفوظ طریقے سے روکیں۔ ریڈی ایٹر کیپ کھولنے سے پہلے کم از کم 30 منٹ انتظار کریں۔', hi: '२. सुरक्षित रूप से रुकें। रेडिएटर कैप खोलने से पहले कम से कम ३० मिनट प्रतीक्षा करें।', bn: '২. নিরাপদে গাড়ি থামান। রেডিয়েটর ক্যাপ খোলার আগে অন্তত ৩০ মিনিট অপেক্ষা করুন।' }
    ]
  },
  {
    id: 'stuck-in-sand',
    version: 1,
    category: 'auto',
    title: { en: 'Stuck in Sand', ar: 'التعريز في الرمل', ur: 'ریت میں پھنس جانا', hi: 'रेत में फंसा होना', bn: 'বালিতে আটকে যাওয়া' },
    content: [
      { en: '1. Deflate tires to 12-15 PSI for better traction.', ar: '1. قم بتنسيم الإطارات إلى 12-15 PSI لزيادة التماسك.', ur: '1. بہتر گرفت کے لیے ٹائروں کی ہوا 12-15 PSI تک کم کریں۔', hi: '१. बेहतर कर्षण के लिए टायरों को १२-१५ पीएसआई तक फुलाएं।', bn: '১. ভালো ট্র্যাকশনের জন্য টায়ারের হাওয়া ১২-১৫ পিএসআই পর্যন্ত কমিয়ে দিন।' },
      { en: '2. Use floor mats under the tires to help the car climb out.', ar: '2. استخدم دعاسات السيارة تحت الإطارات لمساعدة السيارة على الخروج.', ur: '2. گاڑی کو باہر نکالنے کے لیے ٹائروں کے نیچے فلور میٹ استعمال کریں۔', hi: '२. कार को बाहर निकलने में मदद करने के लिए टायरों के नीचे फर्श मैट का उपयोग करें।', bn: '২. গাড়ি বের করতে টায়ারের নিচে ফ্লোর ম্যাট ব্যবহার করুন।' }
    ]
  },
  // ENVIRONMENT
  {
    id: 'desert-survival',
    version: 1,
    category: 'environment',
    isKsaSpecific: true,
    title: { en: 'Desert Survival', ar: 'البقاء في الصحراء', ur: 'صحرا میں بقا', hi: 'रेगिस्तान में उत्तरजीविता', bn: 'মরুভূমিতে টিকে থাকা' },
    content: [
      { en: '1. Stay with your vehicle. It provides shade and is easier to spot from the air.', ar: '1. ابق مع مركبتك. فهي توفر الظل ويسهل رصدها من الجو.', ur: '1. اپنی گاڑی کے پاس رہیں۔ یہ سایہ فراہم کرتی ہے اور اسے فضا سے دیکھنا آسان ہے۔', hi: '१. अपने वाहन के साथ रहें। यह छाया प्रदान करता है और हवा से पहचानना आसान है।', bn: '১. গাড়ির সাথেই থাকুন। এটি ছায়া দেয় এবং আকাশ থেকে উদ্ধারকারীদের জন্য খুঁজে পাওয়া সহজ।' },
      { en: '2. Ration your water. Drink only when necessary and stay covered.', ar: '2. اقتصد في استهلاك الماء. اشرب عند الضرورة فقط وابقى مغطى.', ur: '2. پانی بچا کر استعمال کریں۔ صرف ضرورت پڑنے پر پییں اور جسم کو ڈھانپ کر رکھیں۔', hi: '२. अपने पानी को राशन करें। केवल आवश्यक होने पर ही पिएं और ढके रहें।', bn: '২. জল মেপে খরচ করুন। শুধু প্রয়োজনেই পান করুন এবং শরীর ঢেকে রাখুন।' }
    ]
  },
  {
    id: 'sandstorm-safety',
    version: 1,
    category: 'environment',
    title: { en: 'Sandstorm Safety', ar: 'سلامة العواصف الرملية', ur: 'ریت کے طوفان سے بچاؤ', hi: 'रेत के तूफान की सुरक्षा', bn: 'ধূলিঝড় সুরক্ষা' },
    content: [
      { en: '1. If driving, pull over and turn off ALL lights (to avoid being hit from behind).', ar: '1. إذا كنت تقود، توقف جانباً وأطفئ جميع الأنوار (لتجنب الاصطدام من الخلف).', ur: '1. اگر ڈرائیونگ کر رہے ہیں تو گاڑی سائیڈ پر روکیں اور تمام لائٹس بند کر دیں۔', hi: '१. यदि गाड़ी चला रहे हैं, तो रुकें और सभी लाइटें बंद कर दें।', bn: '১. গাড়ি চালালে পাশে থামান এবং সমস্ত লাইট বন্ধ করুন (পেছন থেকে ধাক্কা এড়াতে)।' },
      { en: '2. Cover your nose and mouth with a damp cloth or mask.', ar: '2. غطِّ أنفك وفمك بقطعة قماش مبللة أو كمامة.', ur: '2. اپنی ناک اور منہ کو گیلے کپڑے یا ماسک سے ڈھانپیں۔', hi: '२. अपनी नाक और मुंह को एक गीले कपड़े या मास्क से ढक लें।', bn: '২. নাক ও মুখ ভিজে কাপড় বা মাস্ক দিয়ে ঢেকে রাখুন।' }
    ]
  },
  // TECH
  {
    id: 'phone-battery',
    version: 1,
    category: 'tech',
    title: { en: 'Battery Emergency', ar: 'طوارئ البطارية', ur: 'بیٹری ایمرجنسی', hi: 'बैटरी आपातकाल', bn: 'ব্যাটারি এমারজেন্সি' },
    content: [
      { en: '1. Turn on Airplane Mode to save power while not active.', ar: '1. فعل وضع الطيران لتوفير الطاقة عند عدم الاستخدام.', ur: '1. پاور بچانے کے لیے ہوائی جہاز کا موڈ آن کریں۔', hi: '१. सक्रिय न होने पर बिजली बचाने के लिए हवाई जहाज मोड चालू करें।', bn: '১. পাওয়ার বাঁচাতে এয়ারপ্লেন মোড চালু করুন।' },
      { en: '2. Lower brightness to minimum and turn off background apps.', ar: '2. خفض السطوع إلى الحد الأدنى وأغلق تطبيقات الخلفية.', ur: '2. برائٹنس کم سے کم کریں اور بیک گراؤنڈ ایپس بند کریں۔', hi: '२. चमक को न्यूनतम करें और पृष्ठभूमि ऐप्स बंद करें।', bn: '২. ব্রাইটনেস কমান এবং ব্যাকগ্রাউন্ড অ্যাপ বন্ধ করুন।' }
    ]
  },
  // KSA SPECIFIC
  {
    id: 'hajj-heat-stroke',
    version: 1,
    category: 'ksa',
    isKsaSpecific: true,
    title: { en: 'Hajj Heat Safety', ar: 'سلامة الحرارة في الحج', ur: 'حج میں گرمی سے بچاؤ', hi: 'हज हीट सुरक्षा', bn: 'হজ্জ চলাকালীন গরম সুরক্ষা' },
    content: [
      { en: '1. Use a light-colored umbrella and drink electrolyte-rich fluids.', ar: '1. استخدم مظلة ملونة فاتحة واشرب سوائل غنية بالأملاح.', ur: '1. ہلکے رنگ کی چھتری استعمال کریں اور نمکیات والے مشروبات پییں۔', hi: '१. हल्के रंग की छतरी का उपयोग करें और इलेक्ट्रोलाइट युक्त तरल पदार्थ पिएं।', bn: '১. হালকা রঙের ছাতা ব্যবহার করুন এবং ওআরএস বা নুন-চিনির জল পান করুন।' },
      { en: '2. Avoid outdoor rituals during peak sun hours (10 AM - 4 PM) if possible.', ar: '2. تجنب الشعائر الخارجية في ساعات الذروة (10 صباحاً - 4 مساءً) إذا أمكن.', ur: '2. اگر ممکن ہو تو دھوپ کے عروج کے اوقات (صبح 10 سے شام 4 بجے) میں باہر کی رسومات سے پرہیز کریں۔', hi: '२. यदि संभव हो तो चरम धूप के घंटों (सुबह १० बजे - शाम ४ बजे) के दौरान बाहरी अनुष्ठानों से बचें।', bn: '২. সম্ভব হলে কড়া রোদে (সকাল ১০টা - বিকেল ৪টা) বাইরে থাকা এড়িয়ে চলুন।' }
    ]
  },
  {
    id: 'camel-warning',
    version: 1,
    category: 'ksa',
    isKsaSpecific: true,
    title: { en: 'Stray Camel Warning', ar: 'تحذير الإبل السائبة', ur: 'آوارہ اونٹوں سے ہوشیار', hi: 'आवारा ऊंट की चेतावनी', bn: 'রাস্তায় উট সম্পর্কে সতর্কবার্তা' },
    content: [
      { en: '1. Be extremely alert when driving at night on rural highways.', ar: '1. كن متيقظاً للغاية عند القيادة ليلاً في الطرق السريعة الريفية.', ur: '1. دیہی شاہراہوں پر رات کو ڈرائیونگ کرتے وقت انتہائی چوکس رہیں۔', hi: '१. ग्रामीण राजमार्गों पर रात में गाड़ी चलाते समय अत्यधिक सतर्क रहें।', bn: '১. গ্রাম্য হাইওয়েতে রাতে গাড়ি চালানোর সময় অত্যন্ত সতর্ক থাকুন।' },
      { en: '2. If you see a camel crossing, stop early; they often move in groups.', ar: '2. إذا رأيت ناقة تعبر، توقف مبكراً؛ فهي غالباً ما تتحرك في مجموعات.', ur: '2. اگر آپ اونٹ کو سڑک پار کرتے ہوئے دیکھیں تو پہلے ہی رک جائیں؛ وہ اکثر گروہوں میں ہوتے ہیں۔', hi: '२. यदि आप एक ऊंट को पार करते हुए देखते हैं, तो जल्दी रुकें; वे अक्सर समूहों में चलते हैं।', bn: '২. উট রাস্তা পার হতে দেখলে আগেই থামুন; তারা সাধারণত দলবদ্ধভাবে থাকে।' }
    ]
  }
];

const generateTips = (): Tip[] => {
  const categories = [
    { en: 'Safety', ar: 'سلامة', ur: 'حفاظت', hi: 'सुरक्षा', bn: 'সুরক্ষা' },
    { en: 'Hajj', ar: 'حج', ur: 'حج', hi: 'হজ্জ', bn: 'হজ্জ' },
    { en: 'Survival', ar: 'بقاء', ur: 'بقاء', hi: 'বেঁচে থাকা', bn: 'বেঁচে থাকা' },
    { en: 'Health', ar: 'صحة', ur: 'صحت', hi: 'স্বাস্থ্য', bn: 'স্বাস্থ্য' },
    { en: 'Home', ar: 'منزل', ur: 'গھر', hi: 'বাড়ি', bn: 'বাড়ি' },
    { en: 'Tech', ar: 'تقنية', ur: 'ٹیکنالوجی', hi: 'প্রযুক্তি', bn: 'প্রযুক্তি' }
  ];

  const texts = [
    "Check your fire extinguisher monthly.", "Drink 3L of water daily in summer.",
    "Freeze water bottles to stay cool longer.", "Keep your phone charged over 20%.",
    "Store emergency numbers in your wallet.", "Learn basic sign language for HELP.",
    "Place a wet towel on your neck to cool down.", "Unplug devices during sandstorms.",
    "Carry a physical map of your area.", "Keep a whistle on your keychain.",
    "Rinse eyes with clean water if dust enters.", "Know your blood type by heart.",
    "Carry spare batteries for your tools.", "Use duct tape for quick repairs.",
    "Stay low in smoke during a fire.", "Never pour water on an oil fire.",
    "Check tire pressure before long trips.", "Keep 100 SAR in cash for emergencies.",
    "Learn the signs of heat exhaustion.", "Photograph your documents for backup.",
    "Use 'ICE' in your phone contacts.", "Always wear a seatbelt, even in back.",
    "Carry a portable power bank.", "Avoid walking in wadis during rain.",
    "Check expiration dates of meds.", "Keep a flashlight by your bed.",
    "Trust your gut in weird situations.", "Learn how to use a tourniquet.",
    "Stay calm to think more clearly.", "Help others if you are safe.",
    "Wear light colors to reflect heat.", "Keep a spare key with a neighbor.",
    "Check for scorpions under rocks.", "Ration food if stranded.",
    "Signal 3 times for distress.", "Carry a basic first aid kit.",
    "Change smoke detector batteries yearly.", "Don't leave kids in cars.",
    "Know the nearest hospital location.", "Keep car windows closed in dust.",
    "Use the magnifier for fine print.", "Signal SOS with your flashlight.",
    "Carry a thermal blanket in winter.", "Know how to turn off main water.",
    "Avoid public Wi-Fi for banking.", "Report suspicious activity immediately.",
    "Keep a list of allergies visible.", "Learn to build a basic shelter.",
    "Filter water before drinking.", "Keep a high-energy snack in car.",
    "Walk against traffic if no sidewalk.", "Wear sturdy shoes in the desert.",
    "Check weather alerts daily.", "Use sunscreen SPF 50+.",
    "Avoid caffeine in extreme heat.", "Wash hands after being outside.",
    "Keep a small mirror for signaling.", "Learn to tie basic knots.",
    "Store important papers in plastic.", "Carry a multi-tool.",
    "Check for snakes in tall grass.", "Don't cross flooded wadis.",
    "Stay hydrated even if not thirsty.", "Wear a hat for sun protection.",
    "Check on elderly neighbors.", "Keep a fire blanket in kitchen.",
    "Avoid using elevators in fire.", "Drop, cover, and hold in earthquake.",
    "Stay with your group in crowds.", "Keep your IDs in a neck pouch.",
    "Know your current location always.", "Mark your car in large lots.",
    "Carry a light rain poncho.", "Use a Compass if lost.",
    "Practice your escape plan.", "Teach kids emergency numbers.",
    "Keep a pen and paper handy.", "Use 'Find My' apps on phone.",
    "Update your emergency helper app.", "Backup your phone weekly.",
    "Keep a spare pair of glasses.", "Carry sanitizing wipes.",
    "Avoid direct contact with wildlife.", "Secure loose items in your car.",
    "Stay away from windows in storms.", "Learn to treat minor burns.",
    "Keep a small sewing kit.", "Carry a heavy-duty garbage bag.",
    "Know your home's exit points.", "Keep a safe distance from trucks.",
    "Use reflectors at night.", "Check for ticks after hikes.",
    "Keep a solar charger if possible.", "Carry a small notebook.",
    "Know how to jump-start a car.", "Keep a window breaker tool.",
    "Avoid shortcuts in dark areas.", "Store fuel in safe containers.",
    "Keep a bar of soap in your kit.", "Carry a reusable water bottle.",
    "Learn to identify local hazards.", "Be a helper, not just a witness.",
    "Keep your wits about you.", "Safety first, always.",
    "Use silica gel packets to keep electronics dry.", "Tie a bright ribbon to your car antenna if stranded.",
    "Know the difference between heat exhaustion and heat stroke.", "Keep a small bag of salt/sugar for emergency hydration.",
    "Double-check your car coolant levels in July/August.", "Use a headlamp to keep hands free during repairs.",
    "Keep your passport digital scans in a password-protected app.", "Carry a small whistle even in the city.",
    "Learn to recognize the smell of natural gas.", "Check fire alarms on the first of every month.",
    "Keep a pair of work gloves in your trunk.", "Store 1 gallon of water per person per day.",
    "Use reflective tape on kids' backpacks.", "Learn the local emergency radio frequencies.",
    "Carry a small LED light on your zipper.", "Avoid standing under trees during lightning.",
    "Keep your gas tank at least half-full.", "Check the age of your car tires (max 5 years).",
    "Carry a paper list of family phone numbers.", "Store a change of clothes in your car.",
    "Learn how to manually unlock your automatic gear shift.", "Keep a small bottle of hand sanitizer.",
    "Avoid wearing metallic items during sandstorms.", "Keep a deck of cards for morale if stranded.",
    "Use a semi-frozen water bottle as a cooling pack.", "Keep a spare USB cable in your 'Go Bag'.",
    "Learn basic knots: Bowline and Clove Hitch.", "Carry a light windbreaker in the desert; nights are cold.",
    "Use the 'Signal Meter' to find better reception spots.", "Keep your emergency contact ICE labeled.",
    "Practice using your fire extinguisher before you need it.", "Stay updated with local news during events.",
    "Keep a small mirror in your glovebox.", "Share your travel plans with a trusted friend.",
    "Avoid driving during the first rain; roads are extra slippery.", "Keep your car's spare tire inflated.",
    "Learn basic map reading skills.", "Store a heavy-duty flashlight in your car.",
    "Carry a few large safety pins.", "Use a permanent marker to label your gear.",
    "Keep your phone's 'Battery Saver' on if below 50%.", "Stay calm: panic is your worst enemy.",
    "Be kind to others in stress; it helps everyone stay safe.", "Pocket Emergency Helper is here for you."
  ];

  return texts.map((t, i) => ({
    id: i + 1,
    version: 1,
    category: categories[i % categories.length],
    text: { en: t, ar: t, ur: t, hi: t, bn: t }
  }));
};

export const INITIAL_TIPS: Tip[] = generateTips();

export const BADGES: Badge[] = [
  {
    id: 'b1',
    name: { en: 'First Responder', ar: 'المستجيب الأول', ur: 'پہلا جواب دہندہ', hi: 'प्रथम प्रतिक्रियाकर्ता', bn: 'ফার্স্ট রেসপন্ডার' },
    description: { en: 'Complete your first safety guide.', ar: 'أكمل دليلك الأول للسلامة.', ur: 'اپنی پہلی حفاظتی گائیڈ مکمل کریں۔', hi: 'अपनी पहली सुरक्षा गाइड पूरी करें।', bn: 'আপনার প্রথম সুরক্ষা গাইড সম্পন্ন করুন।' },
    icon: '🥇',
    requirement: 1,
    type: 'guides'
  },
  {
    id: 'b2',
    name: { en: 'Safety Scholar', ar: 'باحث السلامة', ur: 'حفاظتی اسکالر', hi: 'सुरक्षा विद्वान', bn: 'সুরক্ষা পণ্ডিত' },
    description: { en: 'Read 5 daily safety tips.', ar: 'اقرأ 5 نصائح يومية للسلامة.', ur: '5 روزانہ حفاظتی ٹپس پڑھیں۔', hi: '५ दैनिक सुरक्षा युक्तियाँ पढ़ें।', bn: '৫টি সুরক্ষা টিপস পড়ুন।' },
    icon: '📚',
    requirement: 5,
    type: 'tips'
  },
  {
    id: 'b3',
    name: { en: 'Tool Master', ar: 'سيد الأدوات', ur: 'ٹول ماسٹر', hi: 'टूल मास्टर', bn: 'সরঞ্জাম মাস্টার' },
    description: { en: 'Use tools 10 times.', ar: 'استخدم الأدوات 10 مرات.', ur: '10 بار ٹولز استعمال کریں۔', hi: 'टूल का १० बार उपयोग करें।', bn: '১০ বার সরঞ্জাম ব্যবহার করুন।' },
    icon: '🛠️',
    requirement: 10,
    type: 'tools'
  }
];
