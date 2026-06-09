// English (US) messages. Keys are grown per build phase.
export default {
  app: {
    title: 'Event Registration',
  },
  nav: {
    back: 'Back',
    // Per-step "next" labels naming the destination step.
    next: {
      sessions: 'Next: Session Selection',
      addons: 'Next: Add-ons',
      review: 'Next: Review',
    },
    submit: 'Submit Registration',
  },
  steps: {
    attendee: { label: 'Attendee Info' },
    sessions: { label: 'Sessions' },
    addons: { label: 'Add-ons' },
    review: { label: 'Review & Submit' },
  },
  ticket: {
    sectionTitle: 'Select Ticket Type',
    selected: 'Selected',
  },
  attendee: {
    sectionTitle: 'Attendee Information',
    fullName: { label: 'Full Name', placeholder: 'Enter your full name' },
    email: { label: 'Email', placeholder: 'Enter your email address' },
    phone: { label: 'Phone', placeholder: 'Enter your phone number' },
    company: { label: 'Company', placeholder: 'Enter your company name' },
    jobTitle: { label: 'Job Title', placeholder: 'Enter your job title' },
    shippingAddress: {
      label: 'Shipping Address',
      optional: '(Optional)',
      placeholder: 'Enter your shipping address',
      required: 'Shipping address is required for merchandise orders',
    },
  },
  sessions: {
    sectionTitle: 'Select Sessions',
    selectedCount: 'No sessions selected | {count} session selected | {count} sessions selected',
    spotsLeft: '{count} spot left | {count} spots left',
    soldOut: 'Sold Out',
  },
  addons: {
    sectionTitle: 'Select Add-ons',
    tabs: {
      workshop: 'Workshops',
      meal: 'Meal Packages',
      merchandise: 'Merchandise',
    },
    spotsRemaining: '{count} spot remaining | {count} spots remaining',
    soldOut: 'Sold Out',
    unavailable: 'Unavailable — overlaps a selected session',
    added: 'Added to order',
    size: 'Size:',
    selectSize: 'Select',
    qty: 'Qty:',
    qtyDecrease: 'Decrease quantity',
    qtyIncrease: 'Increase quantity',
    max: 'max {count}',
    banner: {
      title: 'Shipping Information',
      text: 'Merchandise items will be shipped to your address one week before the conference. Please ensure your shipping address in Step 1 is correct.',
    },
    summary: {
      title: 'Order Summary',
      ticket: '{name} Ticket',
      workshopDiscount: 'Workshop discount (VIP 10%)',
      total: 'Total',
      empty: 'No items selected yet.',
    },
  },
  review: {
    title: 'Review Your Registration',
    edit: 'Edit → Step {step}',
    banner: {
      title: 'Please fix the following before submitting',
    },
    required: '— (required)',
    notSelected: 'Not selected',
    sections: {
      attendee: 'Attendee Information',
      sessions: 'Selected Sessions',
      addons: 'Add-ons',
    },
    fields: {
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      company: 'Company',
      jobTitle: 'Job Title',
      ticketType: 'Ticket Type',
    },
    empty: {
      sessions: 'No sessions selected',
      addons: 'No add-ons selected',
    },
    categories: {
      workshop: 'Workshop',
      meal: 'Meal Package',
      merchandise: 'Merchandise',
    },
    pricing: {
      title: 'Pricing Summary',
      ticket: '{name} Ticket',
      workshopDiscount: 'Workshop discount (VIP 10%)',
      total: 'Grand Total',
    },
    // Validation messages, keyed from utils/validation.js.
    errors: {
      fullName: 'Full name is required',
      emailRequired: 'Email is required',
      emailInvalid: 'Enter a valid email address',
      phoneRequired: 'Phone is required',
      phoneInvalid: 'Enter a valid phone number',
      company: 'Company is required',
      jobTitle: 'Job title is required',
      ticketType: 'Please select a ticket type',
      shipping: 'Shipping address is required for merchandise orders',
      sessionConflict: 'Time conflict: “{a}” overlaps “{b}”',
      addonSize: 'Please select a size for {name}',
    },
  },
  success: {
    title: 'Registration Complete!',
    confirmation: 'Confirmation #{code}',
    message: 'Thank you for registering for {event}. A confirmation email is on its way to {email}.',
    backHome: 'Back to Home',
  },
}
