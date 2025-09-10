export const promptFlow = [
  {
    id: "start",
    message: "Hey there! Let’s start building your business. What’s your idea?",
    next: "targetAudience"
  },
  {
    id: "targetAudience",
    message: "Awesome idea! Who do you see buying or using this the most — home cooks, creators, busy parents?",
    next: "corePurpose"
  },
  {
    id: "corePurpose",
    message: "Love it. What's the main purpose of your business? (e.g. solve a problem, start a trend, offer value)",
    next: "features"
  },
  {
    id: "features",
    message: "What key features will your product or service offer? (Select as many as you like)",
    options: ["Easy to use", "Affordable", "Premium quality", "Automated", "Eco-friendly"],
    next: "businessType"
  },
  {
    id: "businessType",
    message: "What type of business are you building?",
    options: ["Physical Products", "Digital Products", "Services", "Community / Content"],
    nextByAnswer: {
      "Physical Products": "hasPhysicalProducts",
      "Digital Products": "hasDigitalProduct",
      "Services": "needsBooking",
      "Community / Content": "monetizeCommunity"
    }
  },

  // PHYSICAL PRODUCTS FLOW
  {
    id: "hasPhysicalProducts",
    message: "Do you already have products in stock or planned?",
    next: "hasSupplier"
  },
  {
    id: "hasSupplier",
    message: "Do you already have a supplier?",
    next: "needSourcing"
  },
  {
    id: "needSourcing",
    message: "Do you need help sourcing one (e.g. POD, AliExpress, local)?",
    next: "designHelp"
  },

  // DIGITAL PRODUCTS FLOW
  {
    id: "hasDigitalProduct",
    message: "Do you already have the digital product(s) ready?",
    next: "needPackaging"
  },
  {
    id: "needPackaging",
    message: "Would you like help creating or packaging them (e.g. eBooks, downloads)?",
    next: "designHelp"
  },

  // SERVICES FLOW
  {
    id: "needsBooking",
    message: "Do you need a booking or scheduling system for your service?",
    next: "needsPortal"
  },
  {
    id: "needsPortal",
    message: "Would your clients or team need a portal to log in and manage sessions?",
    next: "designHelp"
  },

  // COMMUNITY/CONTENT FLOW
  {
    id: "monetizeCommunity",
    message: "Are you planning to monetize with memberships, subscriptions, or ads?",
    next: "buildCommunity"
  },
  {
    id: "buildCommunity",
    message: "Do you want help building the structure for your content or community space?",
    next: "designHelp"
  },

  // UNIVERSAL DESIGN + DOMAIN
  {
    id: "designHelp",
    message: "Would you like help with your logo or brand visuals?",
    options: ["Yes", "No"],
    nextByAnswer: {
      "Yes": "generateLogo",
      "No": "domainHelp"
    }
  },
  {
    id: "generateLogo",
    message: "Great! I’ll help you design a logo that matches your brand tone. One moment…",
    next: "domainHelp"
  },
  {
    id: "domainHelp",
    message: "Do you want help finding an available domain name?",
    options: ["Yes", "No"],
    nextByAnswer: {
      "Yes": "brandTone",
      "No": "brandTone"
    }
  },
  {
    id: "brandTone",
    message: "Which tone best describes your brand?",
    options: ["Playful", "Professional", "Luxury", "Minimal", "Bold"],
    next: "platformTarget"
  },
  {
    id: "platformTarget",
    message: "Where do you want this to live — as a website, mobile app, or both?",
    options: ["Website", "Mobile App", "Both"],
    next: "letsBuild"
  },
  {
    id: "letsBuild",
    message: "Awesome — let’s build your project! 🚀 You’ll get a full draft to review next.",
    next: null
  }
];
