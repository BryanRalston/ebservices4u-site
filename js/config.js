/* ==========================================================================
   EBServices · SITE CONFIG
   --------------------------------------------------------------------------
   Every business fact the site shows lives here. Leave a value as "" (empty)
   or null when it is unknown, and the matching part of the page stays hidden:
   nothing is shown as a placeholder to visitors.
   See README.md for what each field controls.
   ========================================================================== */
window.SITE_CONFIG = {
  businessName: "EBServices",
  legalName: "EBServices LLC",      // Virginia LLC, formed April 29, 2023 (VA SCC)
  foundedYear: 2023,
  siteUrl: "https://ebservices4u.com",

  // Phone. Leave "" until known. While empty, phone links are hidden and the
  // "Call" buttons send visitors to the estimate form instead.
  phoneDisplay: "",            // e.g. "(703) 555-1234"
  phoneTel: "",                // e.g. "+17035551234"

  // Estimate form and contact email (form is delivered by FormSubmit.co)
  email: "Ebservices4U@outlook.com",

  // Service area. Leave "" to hide. e.g. "Leesburg and Loudoun County, VA"
  serviceArea: "Leesburg & Loudoun County, VA",
  // Optional list of towns for the structured data (areaServed)
  townsServed: [],              // e.g. ["Leesburg", "Ashburn", "Sterling"]

  // Business hours shown in the contact block. Leave "" to hide.
  hours: "",                    // e.g. "Mon–Sat, 8am–6pm"

  // Trust items: set to true only once confirmed with the owner.
  freeEstimates: null,          // true -> shows "Free Estimates"
  licensed: null,               // true -> shows "Licensed & Insured" (needs insured too)
  insured: null,
  licenseNumber: "",            // e.g. "VA Class C #2705xxxxxx"

  // Street address for Google/structured data only (not shown on the page).
  address: {
    // Locality only. Do NOT add the street address (not for publication).
    streetAddress: "", addressLocality: "Leesburg", addressRegion: "VA", postalCode: "20175", addressCountry: "US"
  },

  // Social links. Change instagram to https://www.instagram.com/ebservices4u when the handle moves.
  social: {
    instagram: "https://www.instagram.com/ebservices2u",
    facebook: "",
    google: ""                  // Google Business Profile URL, once it exists
  }
};
