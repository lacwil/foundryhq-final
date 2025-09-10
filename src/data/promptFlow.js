// src/data/promptFlow.js

const promptFlow = [
  {
    id: "businessIdea",
    type: "text",
    prompt: "What’s your business idea?"
  },
  {
    id: "targetAudience",
    type: "text",
    prompt: "Who is your ideal customer or target audience?"
  },
  {
    id: "corePurpose",
    type: "text",
    prompt: "What will your business help them do or achieve?"
  },
  {
    id: "keyFeatures",
    type: "multi-select",
    prompt: "Which features do you need?",
    options: [
      "E-commerce / Sell products",
      "Booking system",
      "Membership or subscriptions",
      "Blog or content site",
      "AI assistant",
      "Email list signup",
      "Other"
    ]
  },
  {
    id: "businessType",
    type: "choice",
    prompt: "What type of business is this?",
    options: ["Physical Products", "Digital Products", "Services", "Community / Content Platform"]
  },
  {
    id: "physicalSupplier",
    type: "conditional",
    condition: (answers) => answers.businessType === "Physical Products",
    questions: [
      {
        id: "hasSupplier",
        type: "choice",
        prompt: "Do you already have a supplier?",
        options: ["Yes", "No"]
      },
      {
        id: "needSupplierHelp",
        type: "choice",
        prompt: "Do you need help finding one (e.g. POD, AliExpress, local)?",
        options: ["Yes", "No"]
      }
    ]
  },
  {
    id: "digitalProductStatus",
    type: "conditional",
    condition: (answers) => answers.businessType === "Digital Products",
    questions: [
      {
        id: "hasProduct",
        type: "choice",
        prompt: "Do you already have your digital products ready?",
        options: ["Yes", "No"]
      },
      {
        id: "needPackagingHelp",
        type: "choice",
        prompt: "Do you need help creating or packaging them (e.g. eBooks, downloads)?",
        options: ["Yes", "No"]
      }
    ]
  },
  {
    id: "servicesSetup",
    type: "conditional",
    condition: (answers) => answers.businessType === "Services",
    questions: [
      {
        id: "needBooking",
        type: "choice",
        prompt: "Do you need a booking calendar?",
        options: ["Yes", "No"]
      },
      {
        id: "needPortal",
        type: "choice",
        prompt: "Do you need a client portal or team dashboard?",
        options: ["Yes", "No"]
      }
    ]
  },
  {
    id: "communitySetup",
    type: "conditional",
    condition: (answers) => answers.businessType === "Community / Content Platform",
    questions: [
      {
        id: "monetization",
        type: "choice",
        prompt: "Do you plan to monetize with memberships or ads?",
        options: ["Memberships", "Ads", "Not yet"]
      },
      {
        id: "needCommunityHelp",
        type: "choice",
        prompt: "Do you want help structuring your community space?",
        options: ["Yes", "No"]
      }
    ]
  },
  {
    id: "designHelp",
    type: "choice",
    prompt: "Do you want help creating a logo and brand visuals?",
    options: ["Yes", "No"]
  },
  {
    id: "domainHelp",
    type: "choice",
    prompt: "Do you want to check if your domain is available?",
    options: ["Yes", "No"]
  },
  {
    id: "brandTone",
    type: "choice",
    prompt: "What tone should your brand have?",
    options: ["Professional", "Bold", "Fun / Playful", "Luxury", "Minimalist", "Surprise me"]
  },
  {
    id: "platformTarget",
    type: "choice",
    prompt: "Where will this business live?",
    options: ["Website", "Web App", "Mobile App", "All of the above"]
  },
  {
    id: "finalStep",
    type: "end",
    prompt: "Great! Let’s build your project now…"
  }
];

export default promptFlow;
s