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
  common: {
    comingSoon: 'Coming soon',
  },
}
