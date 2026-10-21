// Draft descriptions — replace with the official English/Telugu text and criteria.
export const CATEGORIES = [
  {
    id: "social-media-superstar",
    name: "Social Media Superstar Award",
    winners: 30,
    en: "For creators whose overall presence and impact across social media stood out during the challenge.",
    te: "ఛాలెంజ్ సమయంలో సోషల్ మీడియాలో మొత్తం ప్రభావం మరియు ఉనికితో ప్రత్యేకంగా నిలిచిన క్రియేటర్లకు.",
    criteria: ["Overall reach and engagement", "Quality of content", "Audience impact"],
  },
  {
    id: "viral-content-champion",
    name: "Viral Content Champion Award",
    winners: 15,
    en: "For content that spread widely and sparked strong audience interaction.",
    te: "విస్తృతంగా వ్యాపించి ప్రేక్షకుల నుండి బలమైన స్పందన పొందిన కంటెంట్‌కు.",
    criteria: ["Views and shares", "Engagement rate", "Originality of the viral idea"],
  },
  {
    id: "most-creative-creator",
    name: "Most Creative Creator Award",
    winners: 15,
    en: "For original ideas, unique storytelling and imaginative presentation.",
    te: "అసలైన ఆలోచనలు, ప్రత్యేకమైన కథనం మరియు సృజనాత్మక ప్రదర్శనకు.",
    criteria: ["Originality", "Storytelling", "Visual creativity"],
  },
  {
    id: "consistency-champion",
    name: "Consistency Champion Award",
    winners: 15,
    en: "For creators who published quality content regularly throughout the challenge.",
    te: "ఛాలెంజ్ అంతటా క్రమం తప్పకుండా నాణ్యమైన కంటెంట్ ప్రచురించిన క్రియేటర్లకు.",
    criteria: ["Posting regularity", "Consistent quality", "Commitment to the challenge"],
  },
  {
    id: "educational-content-creator",
    name: "Educational Content Creator Award",
    winners: 15,
    en: "For content that teaches, explains and adds real value to viewers.",
    te: "ప్రేక్షకులకు నేర్పించి, వివరించి నిజమైన విలువను అందించే కంటెంట్‌కు.",
    criteria: ["Clarity of explanation", "Usefulness to viewers", "Accuracy"],
  },
  {
    id: "rising-star-creator",
    name: "Rising Star Creator Award",
    winners: 15,
    en: "For new or growing creators who showed remarkable progress and potential.",
    te: "అద్భుతమైన పురోగతి మరియు సామర్థ్యాన్ని చూపిన కొత్త లేదా ఎదుగుతున్న క్రియేటర్లకు.",
    criteria: ["Growth during the challenge", "Potential", "Effort and improvement"],
  },
  {
    id: "ugc-creator",
    name: "UGC Creator Award",
    winners: 15,
    en: "For authentic user-generated content such as reviews, demos and brand-style videos.",
    te: "రివ్యూలు, డెమోలు మరియు బ్రాండ్ తరహా వీడియోల వంటి నిజమైన యూజర్ జనరేటెడ్ కంటెంట్‌కు.",
    criteria: ["Authenticity", "Product or message clarity", "Production quality"],
  },
  {
    id: "ai-creative-genius",
    name: "AI Creative Genius Award",
    winners: 15,
    en: "For the most innovative and skilful use of AI tools to create content.",
    te: "కంటెంట్ సృష్టించడానికి AI టూల్స్‌ను అత్యంత వినూత్నంగా మరియు నైపుణ్యంగా ఉపయోగించినందుకు.",
    criteria: ["Innovative AI usage", "Creative output quality", "Technical skill"],
  },
  {
    id: "ai-powered-personal-creator",
    name: "AI-Powered Personal Creator Award",
    winners: 15,
    en: "For creators who used AI to build and grow their personal brand.",
    te: "తమ వ్యక్తిగత బ్రాండ్‌ను నిర్మించి పెంచుకోవడానికి AIని ఉపయోగించిన క్రియేటర్లకు.",
    criteria: ["Personal brand building", "Effective AI integration", "Audience connection"],
  },
];

export const STATUSES = ["Pending", "Under Review", "Shortlisted", "Selected", "Rejected"];
export const categoryById = (id) => CATEGORIES.find((c) => c.id === id);
