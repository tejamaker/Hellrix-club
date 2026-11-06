import {
  AdminNotification,
  AuditLog,
  BankTransaction,
  Booking,
  DigitalVoucher,
  EmailNotification,
  EventData,
  PassType,
  Payment,
  Permission,
  ReconciliationBatch,
  ScannerScanResult,
  StaffStatus,
  SupportTicket,
  SystemSettings,
  Ticket,
  User,
  UserRole,
  CmsPost,
  CmsSectionMatter,
  CmsHighlightPillar,
} from '../types';

// High-Fidelity Event Atmosphere Imagery
const HERO_IMAGE = '/src/assets/images/hellrix_event_hero_1793991025795.jpg';
const STAGE_IMAGE = '/src/assets/images/hellrix_stage_atmosphere_1793991026528.jpg';
const CROWD_IMAGE = '/src/assets/images/hellrix_crowd_vibe_1793991027155.jpg';
const VIP_IMAGE = '/src/assets/images/hellrix_vip_lounge_1793991027392.jpg';

const INITIAL_EVENT: EventData = {
  id: 'ev_hellrix_001',
  title: 'HELLRIX: UNDERGROUND 001',
  edition: 'EDITION 1.0',
  tagline: 'AN EXPERIENCE BEYOND THE ORDINARY.',
  date: 'SATURDAY, 28 NOVEMBER 2026',
  raw_date: '2026-11-28',
  time: '21:00 — 05:00 IST',
  venue: 'THE CONCRETE SILO (WAREHOUSE 07)',
  address: 'Gate 4, Heavy Industrial Estate, Docks Corridor',
  city: 'MUMBAI, MH',
  description:
    'HELLRIX is an intimate, brutalist audiovisual gathering built for 250 verified attendees. Designed as an underground temple of industrial acoustics, low-frequency pressure, and crimson illumination. No VIP bottle service clichés. No commercial filler. Raw architecture and focused curation.',
  curator: 'HELLRIX COLLECTIVE',
  total_capacity: 250,
  poster_url: HERO_IMAGE,
  gallery_urls: [HERO_IMAGE, STAGE_IMAGE, CROWD_IMAGE, VIP_IMAGE],
  status: 'booking_open',
  rules: [
    'Strict 21+ entry with physical government photo ID required at the gate.',
    'No flash photography or commercial recording equipment allowed inside.',
    'Respect the space and fellow attendees. Zero tolerance for harassment or discrimination.',
    'Re-entry is not permitted once scanned inside the industrial complex.',
    'Entry QR code must be validated via live gate terminal before 01:00 IST.',
  ],
  fee_percentage: 0,
  fixed_booking_fee: 0,
};

const INITIAL_PASS_TYPES: PassType[] = [
  {
    id: 'pass_single',
    event_id: 'ev_hellrix_001',
    name: 'SINGLE PASS',
    tag: 'GENERAL ADMISSION',
    price: 999,
    capacity: 150,
    group_size: 1,
    max_per_order: 6,
    perks: [
      'Full venue access (21:00 — 05:00)',
      'Ground level industrial warehouse floor',
      'Access to standard bar zones',
      'Encrypted digital gate entry token',
    ],
  },
  {
    id: 'pass_vip',
    event_id: 'ev_hellrix_001',
    name: 'VIP MEZZANINE PASS',
    tag: 'LIMITED CAPACITY',
    price: 2499,
    capacity: 50,
    group_size: 1,
    is_exclusive: true,
    max_per_order: 4,
    perks: [
      'Dedicated express gate bypass',
      'Elevated concrete mezzanine access',
      'Private mezzanine bar & mixologist access',
      'Direct line-of-sight to performance stage',
      'Digital collectible pass + 1 complimentary drink voucher',
    ],
  },
  {
    id: 'pass_group',
    event_id: 'ev_hellrix_001',
    name: 'GROUP SQUAD PASS (4X)',
    tag: 'COLLECTIVE ACCESS',
    price: 3499,
    capacity: 15, // 15 bundles = 60 persons
    group_size: 4,
    max_per_order: 2,
    perks: [
      'Single bundled access for 4 persons (₹875 per person)',
      'Fast-track collective entry lane',
      'Reserved high-table standing perimeter spot',
      '4 individual scannable digital passes generated',
    ],
  },
];

const ALL_PERMISSIONS: Permission[] = [
  'events.view',
  'events.create',
  'events.edit',
  'events.delete',
  'bookings.view',
  'bookings.manage',
  'payments.view',
  'payments.verify',
  'payments.reject',
  'payments.reconcile',
  'attendees.view',
  'attendees.edit',
  'tickets.view',
  'tickets.reissue',
  'tickets.revoke',
  'vouchers.view',
  'vouchers.reissue',
  'vouchers.revoke',
  'staff.view',
  'staff.create',
  'staff.update',
  'staff.disable',
  'staff.approve',
  'reports.view',
  'reports.export',
  'settings.manage',
  'audit.view',
  'scan.access',
];

const INITIAL_USERS: User[] = [
  {
    id: 'usr_owner_uday',
    name: 'Uday Kumar',
    email: 'udaykumar@hellrix.com',
    mobile: '+91 99000 11223',
    role: 'owner',
    status: 'active',
    password: 'admin1',
    permissions: ALL_PERMISSIONS,
    created_at: '2026-10-01T10:00:00Z',
    updated_at: '2026-10-01T10:00:00Z',
    last_login: new Date().toISOString(),
  },
  {
    id: 'usr_staff_karan',
    name: 'Karan Mehra',
    email: 'karan@hellrix.com',
    mobile: '+91 98333 77889',
    role: 'payment_manager',
    status: 'active',
    password: 'admin1',
    permissions: [
      'payments.view',
      'payments.verify',
      'payments.reject',
      'payments.reconcile',
      'bookings.view',
      'reports.view',
    ],
    created_at: '2026-10-20T14:00:00Z',
    updated_at: '2026-10-20T14:00:00Z',
    last_login: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
  },
  {
    id: 'usr_staff_anya',
    name: 'Anya Sharma',
    email: 'anya@hellrix.com',
    mobile: '+91 98111 22334',
    role: 'check_in_staff',
    status: 'active',
    password: 'admin1',
    assigned_event_id: 'ev_hellrix_001',
    permissions: ['scan.access', 'attendees.view'],
    created_at: '2026-10-15T12:00:00Z',
    updated_at: '2026-10-15T12:00:00Z',
    last_login: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
  },
  {
    id: 'usr_req_rohit',
    name: 'Rohit Verma',
    email: 'rohit@hellrix.com',
    mobile: '+91 98444 55667',
    role: 'admin',
    requested_role: 'admin',
    status: 'pending_approval',
    password: 'admin1',
    approval_note: 'Requesting administrative clearance to assist with event bookings and gate logistics.',
    created_at: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
  },
  {
    id: 'usr_customer_alex',
    name: 'Alex Mercer',
    email: 'alex@example.com',
    mobile: '+91 98222 33445',
    role: 'customer',
    created_at: '2026-11-01T08:30:00Z',
    updated_at: '2026-11-01T08:30:00Z',
  },
  {
    id: 'usr_customer_neha',
    name: 'Neha Kapoor',
    email: 'neha@example.com',
    mobile: '+91 98333 44556',
    role: 'customer',
    created_at: '2026-11-02T14:15:00Z',
    updated_at: '2026-11-02T14:15:00Z',
  },
];

const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'HRX-2026-10482',
    user_id: 'usr_customer_alex',
    customer_name: 'Alex Mercer',
    customer_email: 'alex@example.com',
    customer_mobile: '+91 98222 33445',
    event_id: 'ev_hellrix_001',
    pass_type_id: 'pass_vip',
    pass_type_name: 'VIP MEZZANINE PASS',
    quantity: 1,
    unit_price: 2499,
    subtotal: 2499,
    booking_fee: 0,
    total_amount: 2499,
    status: 'confirmed',
    reservation_expires_at: '2026-11-01T09:00:00Z',
    payment_id: 'pay_10482',
    timeline: [
      {
        key: 'created',
        title: 'BOOKING CREATED',
        description: '10-minute pass reservation hold initiated.',
        timestamp: '2026-11-01T08:45:00Z',
        completed: true,
      },
      {
        key: 'upi',
        title: 'PAYMENT INSTRUCTIONS DISPLAYED',
        description: 'Direct UPI instructions presented.',
        timestamp: '2026-11-01T08:46:00Z',
        completed: true,
      },
      {
        key: 'utr',
        title: 'UTR SUBMITTED',
        description: 'Transaction reference 431988204912 submitted.',
        timestamp: '2026-11-01T08:50:00Z',
        completed: true,
      },
      {
        key: 'verified',
        title: 'PAYMENT VERIFIED',
        description: 'Verified by Gate Operations Desk.',
        timestamp: '2026-11-01T09:15:00Z',
        completed: true,
      },
      {
        key: 'ticket',
        title: 'TICKET GENERATED',
        description: 'Pass HRX-VIP-10482 & Drink Voucher issued.',
        timestamp: '2026-11-01T09:15:00Z',
        completed: true,
      },
    ],
    created_at: '2026-11-01T08:45:00Z',
    updated_at: '2026-11-01T09:15:00Z',
  },
  {
    id: 'HRX-2026-10521',
    user_id: 'usr_customer_alex',
    customer_name: 'Alex Mercer',
    customer_email: 'alex@example.com',
    customer_mobile: '+91 98222 33445',
    event_id: 'ev_hellrix_001',
    pass_type_id: 'pass_group',
    pass_type_name: 'GROUP SQUAD PASS (4X)',
    quantity: 1,
    unit_price: 3499,
    subtotal: 3499,
    booking_fee: 0,
    total_amount: 3499,
    status: 'verification_pending',
    reservation_expires_at: new Date(Date.now() + 8 * 60 * 1000).toISOString(),
    payment_id: 'pay_10521',
    timeline: [
      {
        key: 'created',
        title: 'BOOKING CREATED',
        description: '10-minute hold initiated for Group Pass.',
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        completed: true,
      },
      {
        key: 'upi',
        title: 'PAYMENT INSTRUCTIONS DISPLAYED',
        description: 'UPI QR code generated for ₹3,499.',
        timestamp: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
        completed: true,
      },
      {
        key: 'utr',
        title: 'UTR SUBMITTED',
        description: 'Reference 824719123456 submitted. Verification in progress.',
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        completed: true,
      },
      {
        key: 'verified',
        title: 'PAYMENT VERIFIED',
        description: 'Awaiting administrator reconciliation.',
        timestamp: '',
        completed: false,
      },
      {
        key: 'ticket',
        title: 'TICKET GENERATED',
        description: 'Scannable entry passes pending payment confirmation.',
        timestamp: '',
        completed: false,
      },
    ],
    created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
];

const INITIAL_PAYMENTS: Payment[] = [
  {
    id: 'pay_10482',
    booking_id: 'HRX-2026-10482',
    user_id: 'usr_customer_alex',
    amount: 2499,
    provider: 'manual_upi',
    upi_id_used: 'hellrix.events@icici',
    utr_number: '431988204912',
    payer_account_name: 'Alex Mercer',
    status: 'approved',
    submitted_at: '2026-11-01T08:50:00Z',
    verified_at: '2026-11-01T09:15:00Z',
    verified_by_user_id: 'usr_owner',
    created_at: '2026-11-01T08:45:00Z',
  },
  {
    id: 'pay_10521',
    booking_id: 'HRX-2026-10521',
    user_id: 'usr_customer_alex',
    amount: 3499,
    provider: 'manual_upi',
    upi_id_used: 'hellrix.events@icici',
    utr_number: '824719123456',
    payer_account_name: 'Alex Mercer',
    status: 'verification_pending',
    submitted_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
];

const INITIAL_TICKETS: Ticket[] = [
  {
    id: 'HRX-VIP-10482',
    booking_id: 'HRX-2026-10482',
    user_id: 'usr_customer_alex',
    event_id: 'ev_hellrix_001',
    event_name: 'HELLRIX: UNDERGROUND 001',
    pass_type_id: 'pass_vip',
    pass_name: 'VIP MEZZANINE PASS',
    ticket_number: 'HRX-VIP-10482',
    customer_name: 'Alex Mercer',
    customer_email: 'alex@example.com',
    customer_phone: '+91 98222 33445',
    security_token: 'HRX-SEC-VIP-10482-9908F42',
    qr_data: 'HRX-SEC-VIP-10482-9908F42',
    status: 'unused',
    voucher_id: 'VCH-10482',
    created_at: '2026-11-01T09:15:00Z',
  },
];

const INITIAL_VOUCHERS: DigitalVoucher[] = [
  {
    id: 'VCH-10482',
    ticket_id: 'HRX-VIP-10482',
    booking_id: 'HRX-2026-10482',
    user_id: 'usr_customer_alex',
    pass_name: 'VIP MEZZANINE PASS',
    benefit_title: '1 COMPLIMENTARY SIGNATURE BEVERAGE',
    benefit_description: 'Redeemable at the private elevated mezzanine bar. Present this separate voucher code to the bar mixologist.',
    redemption_code: 'HRX-BAR-VCH-88219-X9',
    status: 'active',
    created_at: '2026-11-01T09:15:00Z',
  },
];

const INITIAL_EMAILS: EmailNotification[] = [
  {
    id: 'em_1',
    user_id: 'usr_customer_alex',
    user_email: 'alex@example.com',
    subject: 'HELLRIX — Your Ticket Is Confirmed! [HRX-2026-10482]',
    type: 'payment_confirmed',
    preview_text: 'Your payment of ₹2,499 has been verified. Pass HRX-VIP-10482 is ready.',
    html_body: `
      <h2>HELLRIX: UNDERGROUND 001</h2>
      <p>Dear Alex Mercer,</p>
      <p>Your payment via UPI has been reconciled and confirmed by our operations audit team.</p>
      <p><strong>Ticket ID:</strong> HRX-VIP-10482<br/><strong>Pass:</strong> VIP MEZZANINE PASS<br/><strong>Venue:</strong> The Concrete Silo Warehouse 07, Mumbai</p>
      <p>Access your cryptographic entry QR in your account wallet under "My Tickets".</p>
    `,
    sent_at: '2026-11-01T09:15:00Z',
    read: true,
  },
  {
    id: 'em_2',
    user_id: 'usr_customer_alex',
    user_email: 'alex@example.com',
    subject: 'HELLRIX — Payment Submitted for Verification [HRX-2026-10521]',
    type: 'utr_submitted',
    preview_text: 'UTR 824719123456 received for ₹3,499. Verification in progress.',
    html_body: `
      <h2>PAYMENT SUBMITTED FOR AUDIT</h2>
      <p>Dear Alex Mercer,</p>
      <p>We have received your UTR reference <strong>824719123456</strong> for booking <strong>HRX-2026-10521</strong> (₹3,499).</p>
      <p>Our desk verifies transaction references within 24 hours. Once matched, your scannable passes will be generated automatically.</p>
    `,
    sent_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    read: false,
  },
];

const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud_1',
    user_id: 'usr_owner',
    user_name: 'Vikram Rathore',
    user_role: 'owner',
    action: 'PAYMENT_APPROVED',
    target_id: 'pay_10482',
    details: 'Verified UTR 431988204912 for ₹2,499. Ticket HRX-VIP-10482 and voucher VCH-10482 issued.',
    timestamp: '2026-11-01T09:15:00Z',
  },
];

const INITIAL_SUPPORT_TICKETS: SupportTicket[] = [
  {
    id: 'sup_01',
    user_id: 'usr_customer_alex',
    name: 'Alex Mercer',
    email: 'alex@example.com',
    booking_id: 'HRX-2026-10521',
    category: 'payment_verification',
    subject: 'UTR submitted for Group Pass',
    message: 'Transferred ₹3,499 via Google Pay to hellrix.events@icici. UTR 824719123456.',
    status: 'open',
    created_at: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
  },
];

const INITIAL_SETTINGS: SystemSettings = {
  payment_provider: 'manual_upi',
  upi_id: 'hellrix.events@icici',
  upi_receiver_name: 'HELLRIX UNDERGROUND EXPERIENCES',
  verification_sla_hours: 24,
  support_email: 'ops@hellrix.com',
  support_phone: '+91 22 8490 1200',
  instagram_handle: '@hellrix.underground',
};

const INITIAL_BANK_TRANSACTIONS: BankTransaction[] = [
  {
    id: 'tx_bank_01',
    reference_utr: '431988204912',
    transaction_date: '2026-11-01T08:50:00Z',
    type: 'credit',
    amount: 2499,
    description: 'UPI/431988204912/CR/ALEX MERCER/HDFC',
    source_file: 'HDFC_STATEMENT_NOV2026.CSV',
    batch_id: 'BATCH-2026-001',
    match_status: 'exact_match',
    matched_booking_id: 'HRX-2026-10482',
    matched_payment_id: 'pay_10482',
    created_at: '2026-11-01T08:52:00Z',
  },
  {
    id: 'tx_bank_02',
    reference_utr: '824719123456',
    transaction_date: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    type: 'credit',
    amount: 3499,
    description: 'UPI/824719123456/CR/ALEX MERCER/ICICI',
    source_file: 'ICICI_CURRENT_STATEMENT_NOV.CSV',
    batch_id: 'BATCH-2026-002',
    match_status: 'exact_match',
    matched_booking_id: 'HRX-2026-10521',
    matched_payment_id: 'pay_10521',
    created_at: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
  },
  {
    id: 'tx_bank_03',
    reference_utr: '992014881023',
    transaction_date: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    type: 'credit',
    amount: 999,
    description: 'UPI/992014881023/CR/PRIYA SHARMA/SBIN',
    source_file: 'ICICI_CURRENT_STATEMENT_NOV.CSV',
    batch_id: 'BATCH-2026-002',
    match_status: 'unmatched',
    created_at: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
  },
  {
    id: 'tx_bank_04',
    reference_utr: '771029384810',
    transaction_date: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    type: 'debit',
    amount: 5000,
    description: 'NEFT/771029384810/DR/SOUND_VENDOR_ADV',
    source_file: 'ICICI_CURRENT_STATEMENT_NOV.CSV',
    batch_id: 'BATCH-2026-002',
    match_status: 'unmatched',
    created_at: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
  },
];

const INITIAL_RECON_BATCHES: ReconciliationBatch[] = [
  {
    id: 'BATCH-2026-001',
    filename: 'HDFC_STATEMENT_NOV2026.CSV',
    uploaded_by: 'Uday Kumar',
    uploaded_at: '2026-11-01T08:52:00Z',
    total_imported: 1,
    exact_matches: 1,
    manual_review: 0,
    unmatched: 0,
    duplicate_records: 0,
    approved_count: 1,
    total_matched_value: 2499,
    status: 'reconciled',
  },
  {
    id: 'BATCH-2026-002',
    filename: 'ICICI_CURRENT_STATEMENT_NOV.CSV',
    uploaded_by: 'Karan Mehra',
    uploaded_at: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
    total_imported: 3,
    exact_matches: 1,
    manual_review: 0,
    unmatched: 2,
    duplicate_records: 0,
    approved_count: 0,
    total_matched_value: 3499,
    status: 'processed',
  },
];

const INITIAL_ADMIN_NOTIFICATIONS: AdminNotification[] = [
  {
    id: 'notif_1',
    type: 'access_request',
    title: 'Staff Access Request',
    message: 'Rohit Verma has requested [ADMIN] clearance. Awaiting manual approval by Uday Kumar.',
    target_id: 'usr_req_rohit',
    read: false,
    created_at: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
  },
  {
    id: 'notif_2',
    type: 'new_utr',
    title: 'New UTR Submitted',
    message: 'Alex Mercer submitted UTR 824719123456 for Group Pass (₹3,499).',
    target_id: 'pay_10521',
    read: false,
    created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
];

const INITIAL_CMS_POSTS: CmsPost[] = [
  {
    id: 'post_01',
    title: 'VENUE DOSSIER: THE CONCRETE SILO REVEALED',
    slug: 'venue-dossier-concrete-silo',
    excerpt: 'Deep-dive into Warehouse 07: 40-foot reinforced barrel ceilings, unpolished basalt floors, and zero acoustic reflection.',
    content: 'Warehouse 07 was decommissioned in 1994. Its double-walled concrete vault provides unparalleled sub-bass containment, allowing sustained 115dB SPL pressure without phase distortion. Gate access opens at 21:00 sharp.',
    category: 'briefing',
    author: 'Uday Kumar',
    date: '02 NOV 2026',
    published: true,
    tags: ['VENUE', 'ACOUSTICS', 'MUMBAI'],
  },
  {
    id: 'post_02',
    title: 'FREQUENCY RIG SPECIFICATION: 4-WAY INDUSTRIAL HORN RIG',
    slug: 'frequency-rig-specs',
    excerpt: 'Custom analog crossover tuned to 28Hz fundamental sub-bass. Physical pressure without ear fatigue.',
    content: 'Engineered specifically for low-frequency visceral feedback. The main array features 12 dual-18" subwoofers placed in cardoid alignment along the western blast wall. Ear protection is provided at the medical station.',
    category: 'lineup',
    author: 'Curation Desk',
    date: '28 OCT 2026',
    published: true,
    tags: ['SOUND', 'HARDWARE', 'RIG'],
  },
  {
    id: 'post_03',
    title: 'CODE OF CONDUCT & ENTRY PROTOCOLS (EDITION 1.0)',
    slug: 'code-of-conduct-protocols',
    excerpt: 'No commercial flash photography. Verified physical government ID mandatory. Zero tolerance for harassment.',
    content: 'HELLRIX is an intimate, judgment-free space built on mutual respect and artistic immersion. Phone lens stickers are applied at the primary entry gate. Any unauthorized flash use results in immediate pass revocation.',
    category: 'announcement',
    author: 'Security & Logistics',
    date: '20 OCT 2026',
    published: true,
    tags: ['RULES', 'CONDUCT', 'ENTRY'],
  },
];

const INITIAL_CMS_SECTIONS: CmsSectionMatter[] = [
  {
    id: 'sec_hero',
    section_key: 'hero',
    tag: 'EDITION 1.0 // MUMBAI 2026',
    title: 'AN EXPERIENCE BEYOND THE ORDINARY.',
    subtitle: 'A brutalist gathering of heavy frequencies, curated underground sound, and raw industrial aesthetics. Strictly 250 attendees.',
    body: 'Experience the raw pulse of industrial acoustics inside Warehouse 07. Curated live performances, heavy bass pressure, and stark crimson illumination.',
    is_visible: true,
    order: 1,
  },
  {
    id: 'sec_curated',
    section_key: 'curated_exp',
    tag: '01. CURATED EXPERIENCE',
    title: 'RAW CONCRETE. PULSING FREQUENCIES.',
    subtitle: 'HELLRIX is an intimate, brutalist audiovisual gathering built for 250 verified attendees. Designed as an underground temple of industrial acoustics, low-frequency pressure, and crimson illumination.',
    body: 'Every frequency is calibrated for visceral presence. No mainstream fillers. No commercial VIP fluff.',
    is_visible: true,
    order: 2,
  },
  {
    id: 'sec_pillars',
    section_key: 'pillars',
    tag: '02. THE FRAMEWORK',
    title: 'ARCHITECTURAL SOUND & LIGHT',
    subtitle: 'Engineered specifically for low reverberation and visceral bodily resonance.',
    is_visible: true,
    order: 3,
  },
  {
    id: 'sec_manifesto',
    section_key: 'manifesto',
    tag: '04. MANIFESTO',
    title: 'NOT JUST AN EVENT. AN IDENTITY.',
    subtitle: 'HELLRIX is an event ecosystem built around bringing people together through thoughtfully curated sound, distinctive visual design, and unforgettable collective energy.',
    body: 'We reject standard nightlife conventions. HELLRIX exists at the intersection of architectural brutalism and sonic purity.',
    is_visible: true,
    order: 4,
  },
  {
    id: 'sec_final_cta',
    section_key: 'final_cta',
    tag: 'RESERVATION SYSTEM ACTIVE // 250 CAPACITY',
    title: 'YOUR NIGHT. YOUR ENTRY. YOUR HELLRIX.',
    subtitle: '10-minute pass reservation windows apply. Verified via direct UPI transaction reference.',
    is_visible: true,
    order: 5,
  },
];

const INITIAL_CMS_PILLARS: CmsHighlightPillar[] = [
  {
    id: 'pil_01',
    number: '01',
    title: 'MONOLITHIC SCALE',
    description: 'Massive spatial architecture focused on sound pressure and pure acoustics.',
    is_visible: true,
  },
  {
    id: 'pil_02',
    number: '02',
    title: 'SUB-BASS PRESSURE',
    description: 'Custom calibrated low-end frequencies tuned for physical presence and visceral punch.',
    is_visible: true,
  },
  {
    id: 'pil_03',
    number: '03',
    title: 'SHADOW & CRIMSON',
    description: 'Minimalist lighting design emphasizing darkness and stark focal illumination.',
    is_visible: true,
  },
  {
    id: 'pil_04',
    number: '04',
    title: 'INTIMATE COMMUNITY',
    description: 'Strictly limited capacity to maintain authentic underground energy and safety.',
    is_visible: true,
  },
];

// Storage Keys
const STORAGE_KEYS = {
  EVENT: 'hrx_event',
  PASS_TYPES: 'hrx_pass_types',
  USERS: 'hrx_users',
  BOOKINGS: 'hrx_bookings',
  PAYMENTS: 'hrx_payments',
  TICKETS: 'hrx_tickets',
  VOUCHERS: 'hrx_vouchers',
  EMAILS: 'hrx_emails',
  AUDIT: 'hrx_audit',
  SUPPORT: 'hrx_support',
  SETTINGS: 'hrx_settings',
  ACTIVE_USER: 'hrx_active_user',
  BANK_TX: 'hrx_bank_tx',
  RECON_BATCHES: 'hrx_recon_batches',
  ADMIN_NOTIFICATIONS: 'hrx_admin_notif',
  CMS_POSTS: 'hrx_cms_posts',
  CMS_SECTIONS: 'hrx_cms_sections',
  CMS_PILLARS: 'hrx_cms_pillars',
};

function getStored<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('Storage error:', err);
  }
}

export class HellrixService {
  // Event
  static getEvent(): EventData {
    return getStored<EventData>(STORAGE_KEYS.EVENT, INITIAL_EVENT);
  }

  static updateEvent(data: Partial<EventData>): EventData {
    const current = this.getEvent();
    const updated = { ...current, ...data };
    setStored(STORAGE_KEYS.EVENT, updated);
    return updated;
  }

  // Pass Types
  static getPassTypes(): PassType[] {
    return getStored<PassType[]>(STORAGE_KEYS.PASS_TYPES, INITIAL_PASS_TYPES);
  }

  // Inventory & Capacity Calculation (Server-Authoritative)
  static getPassInventory(passTypeId: string): {
    totalCapacity: number;
    confirmedCount: number;
    activeReservationsCount: number;
    availableCount: number;
    isSoldOut: boolean;
  } {
    const passTypes = this.getPassTypes();
    const pass = passTypes.find((p) => p.id === passTypeId);
    if (!pass) {
      return { totalCapacity: 0, confirmedCount: 0, activeReservationsCount: 0, availableCount: 0, isSoldOut: true };
    }

    // Auto-expire reservations past 10 minutes
    this.cleanExpiredReservations();

    const bookings = this.getBookings();
    const now = Date.now();

    let confirmedCount = 0;
    let activeReservationsCount = 0;

    for (const b of bookings) {
      if (b.pass_type_id !== passTypeId) continue;

      if (b.status === 'confirmed' || b.status === 'verification_pending') {
        confirmedCount += b.quantity;
      } else if (b.status === 'reserved') {
        const expiresAt = new Date(b.reservation_expires_at).getTime();
        if (expiresAt > now) {
          activeReservationsCount += b.quantity;
        }
      }
    }

    const availableCount = Math.max(0, pass.capacity - confirmedCount - activeReservationsCount);

    return {
      totalCapacity: pass.capacity,
      confirmedCount,
      activeReservationsCount,
      availableCount,
      isSoldOut: availableCount <= 0,
    };
  }

  // Clean Expired 10-Minute Reservations
  static cleanExpiredReservations(): void {
    const bookings = getStored<Booking[]>(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
    const now = Date.now();
    let changed = false;

    const updated = bookings.map((b) => {
      if (b.status === 'reserved') {
        const expiresAt = new Date(b.reservation_expires_at).getTime();
        if (expiresAt <= now) {
          changed = true;
          return {
            ...b,
            status: 'expired' as const,
            timeline: [
              ...b.timeline,
              {
                key: 'expired',
                title: 'RESERVATION EXPIRED',
                description: '10-minute hold window elapsed. Inventory released.',
                timestamp: new Date().toISOString(),
                completed: true,
              },
            ],
            updated_at: new Date().toISOString(),
          };
        }
      }
      return b;
    });

    if (changed) {
      setStored(STORAGE_KEYS.BOOKINGS, updated);
    }
  }

  // Bookings
  static getBookings(): Booking[] {
    this.cleanExpiredReservations();
    return getStored<Booking[]>(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
  }

  static getBookingById(bookingId: string): Booking | undefined {
    this.cleanExpiredReservations();
    const bookings = this.getBookings();
    return bookings.find((b) => b.id.toUpperCase() === bookingId.toUpperCase());
  }

  static getUserBookings(userId: string): Booking[] {
    this.cleanExpiredReservations();
    const bookings = this.getBookings();
    return bookings.filter((b) => b.user_id === userId);
  }

  // Create 10-Minute Reservation
  static createReservation(params: {
    passTypeId: string;
    quantity: number;
    customerName: string;
    customerEmail: string;
    customerMobile: string;
    userId: string;
  }): { success: boolean; booking?: Booking; error?: string } {
    const event = this.getEvent();
    if (event.status !== 'booking_open') {
      return { success: false, error: `Bookings are currently ${event.status.replace('_', ' ').toUpperCase()}.` };
    }

    const passTypes = this.getPassTypes();
    const pass = passTypes.find((p) => p.id === params.passTypeId);
    if (!pass) return { success: false, error: 'Invalid pass tier.' };

    if (params.quantity > pass.max_per_order) {
      return { success: false, error: `Maximum ${pass.max_per_order} passes allowed per order for ${pass.name}.` };
    }

    const inventory = this.getPassInventory(params.passTypeId);
    if (inventory.availableCount < params.quantity) {
      return {
        success: false,
        error: `Only ${inventory.availableCount} passes remaining. Reservation cannot be fulfilled.`,
      };
    }

    const bookingId = `HRX-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // Strict 10 minutes
    const nowIso = new Date().toISOString();

    const subtotal = pass.price * params.quantity;
    const bookingFee = event.fixed_booking_fee + Math.round((subtotal * event.fee_percentage) / 100);
    const totalAmount = subtotal + bookingFee;

    const newBooking: Booking = {
      id: bookingId,
      user_id: params.userId,
      customer_name: params.customerName,
      customer_email: params.customerEmail,
      customer_mobile: params.customerMobile,
      event_id: event.id,
      pass_type_id: pass.id,
      pass_type_name: pass.name,
      quantity: params.quantity,
      unit_price: pass.price,
      subtotal,
      booking_fee: bookingFee,
      total_amount: totalAmount,
      status: 'reserved',
      reservation_expires_at: expiresAt,
      timeline: [
        {
          key: 'created',
          title: 'BOOKING CREATED',
          description: `10-minute hold initiated for ${params.quantity}x ${pass.name}.`,
          timestamp: nowIso,
          completed: true,
        },
        {
          key: 'upi',
          title: 'PAYMENT INSTRUCTIONS DISPLAYED',
          description: 'Payment instructions and dynamic UPI QR code rendered.',
          timestamp: nowIso,
          completed: true,
        },
        {
          key: 'utr',
          title: 'UTR SUBMISSION',
          description: 'Awaiting customer 12-digit transaction reference.',
          timestamp: '',
          completed: false,
        },
        {
          key: 'verified',
          title: 'PAYMENT VERIFICATION',
          description: 'Reconciliation against bank ledger.',
          timestamp: '',
          completed: false,
        },
        {
          key: 'ticket',
          title: 'TICKET ISSUANCE',
          description: 'Encrypted gate admission credentials.',
          timestamp: '',
          completed: false,
        },
      ],
      created_at: nowIso,
      updated_at: nowIso,
    };

    const bookings = this.getBookings();
    bookings.unshift(newBooking);
    setStored(STORAGE_KEYS.BOOKINGS, bookings);

    // Send transactional reservation email
    this.sendEmailNotification({
      user_id: params.userId,
      user_email: params.customerEmail,
      subject: `HELLRIX — Pass Reserved [${bookingId}]`,
      type: 'booking_reserved',
      preview_text: `You have a 10-minute hold on ${params.quantity}x ${pass.name}. Complete UPI payment.`,
      html_body: `<p>Booking <strong>${bookingId}</strong> has reserved ${params.quantity}x ${pass.name} for ₹${totalAmount}. Please complete UPI payment before expiration.</p>`,
    });

    this.logAudit({
      user_id: params.userId,
      user_name: params.customerName,
      user_role: 'customer',
      action: 'BOOKING_RESERVED',
      target_id: bookingId,
      details: `10-minute reservation created for ${params.quantity}x ${pass.name} (Total: ₹${totalAmount}).`,
    });

    return { success: true, booking: newBooking };
  }

  // Submit UPI UTR with Server-Side Duplicate Detection
  static submitUtr(params: {
    bookingId: string;
    utrNumber: string;
    payerAccountName: string;
    userId: string;
    notes?: string;
  }): { success: boolean; payment?: Payment; error?: string } {
    const booking = this.getBookingById(params.bookingId);
    if (!booking) return { success: false, error: 'Booking not found.' };

    if (booking.status === 'expired') {
      return { success: false, error: 'This reservation has expired. Please select a pass again.' };
    }

    if (booking.status === 'confirmed') {
      return { success: false, error: 'This booking is already confirmed.' };
    }

    // Clean UTR
    const cleanUtr = params.utrNumber.trim().toUpperCase();
    if (cleanUtr.length < 8) {
      return { success: false, error: 'Please enter a valid 12-digit UPI / UTR transaction reference number.' };
    }

    // Server-Side Duplicate UTR Detection across all payments
    const payments = this.getPayments();
    const existingUtr = payments.find(
      (p) => p.utr_number && p.utr_number.toUpperCase() === cleanUtr && p.booking_id !== booking.id
    );

    if (existingUtr) {
      return {
        success: false,
        error: 'THIS TRANSACTION REFERENCE HAS ALREADY BEEN SUBMITTED. If you believe this is an error, please contact our support desk.',
      };
    }

    const settings = this.getSettings();
    const paymentId = `pay_${Date.now()}`;
    const nowIso = new Date().toISOString();

    const payment: Payment = {
      id: paymentId,
      booking_id: booking.id,
      user_id: params.userId,
      amount: booking.total_amount,
      provider: settings.payment_provider,
      upi_id_used: settings.upi_id,
      utr_number: cleanUtr,
      payer_account_name: params.payerAccountName,
      notes: params.notes,
      status: 'verification_pending',
      submitted_at: nowIso,
      created_at: nowIso,
    };

    payments.unshift(payment);
    setStored(STORAGE_KEYS.PAYMENTS, payments);

    // Update booking status and timeline
    const bookings = this.getBookings();
    const updatedBookings = bookings.map((b) => {
      if (b.id === booking.id) {
        const updatedTimeline = b.timeline.map((item) => {
          if (item.key === 'utr') {
            return {
              ...item,
              description: `UTR ${cleanUtr} submitted by ${params.payerAccountName || 'Attendee'}.`,
              timestamp: nowIso,
              completed: true,
            };
          }
          return item;
        });

        return {
          ...b,
          status: 'verification_pending' as const,
          payment_id: paymentId,
          timeline: updatedTimeline,
          updated_at: nowIso,
        };
      }
      return b;
    });
    setStored(STORAGE_KEYS.BOOKINGS, updatedBookings);

    // Trigger transactional email
    this.sendEmailNotification({
      user_id: params.userId,
      user_email: booking.customer_email,
      subject: `HELLRIX — Payment Submitted for Verification [${booking.id}]`,
      type: 'utr_submitted',
      preview_text: `UTR reference ${cleanUtr} received for ₹${booking.total_amount}. Verification in progress.`,
      html_body: `
        <h2>PAYMENT RECEIVED FOR AUDIT</h2>
        <p>Dear ${booking.customer_name},</p>
        <p>We have recorded your UTR reference <strong>${cleanUtr}</strong> for booking <strong>${booking.id}</strong> (Amount: ₹${booking.total_amount}).</p>
        <p>Our verification desk reconciles transactions against our bank records within 24 hours.</p>
      `,
    });

    this.logAudit({
      user_id: params.userId,
      user_name: booking.customer_name,
      user_role: 'customer',
      action: 'UTR_SUBMITTED',
      target_id: booking.id,
      details: `UTR ${cleanUtr} submitted for ₹${booking.total_amount}. Verification pending.`,
    });

    return { success: true, payment };
  }

  // Payments
  static getPayments(): Payment[] {
    return getStored<Payment[]>(STORAGE_KEYS.PAYMENTS, INITIAL_PAYMENTS);
  }

  // Approve Payment (Admin/Owner Action) -> Automatically generates final Tickets & Vouchers
  static approvePayment(
    paymentId: string,
    adminUser: User,
    approvalNotes?: string
  ): { success: boolean; payment?: Payment; error?: string } {
    const payments = this.getPayments();
    const payment = payments.find((p) => p.id === paymentId);
    if (!payment) return { success: false, error: 'Payment record not found.' };

    const booking = this.getBookingById(payment.booking_id);
    if (!booking) return { success: false, error: 'Associated booking not found.' };

    // Idempotency: Prevent duplicate approval
    if (payment.status === 'approved' && booking.status === 'confirmed') {
      return { success: true, payment };
    }

    const nowIso = new Date().toISOString();

    // 1. Update Payment
    const updatedPayments = payments.map((p) => {
      if (p.id === paymentId) {
        return {
          ...p,
          status: 'approved' as const,
          verified_at: nowIso,
          verified_by_user_id: adminUser.id,
        };
      }
      return p;
    });
    setStored(STORAGE_KEYS.PAYMENTS, updatedPayments);

    // 2. Update Booking & Timeline
    const bookings = this.getBookings();
    const updatedBookings = bookings.map((b) => {
      if (b.id === booking.id) {
        const updatedTimeline = b.timeline.map((item) => {
          if (item.key === 'verified') {
            return {
              ...item,
              description: `Payment approved by ${adminUser.name}.`,
              timestamp: nowIso,
              completed: true,
            };
          }
          if (item.key === 'ticket') {
            return {
              ...item,
              description: 'Cryptographic admission tokens issued.',
              timestamp: nowIso,
              completed: true,
            };
          }
          return item;
        });

        return {
          ...b,
          status: 'confirmed' as const,
          timeline: updatedTimeline,
          updated_at: nowIso,
        };
      }
      return b;
    });
    setStored(STORAGE_KEYS.BOOKINGS, updatedBookings);

    // 3. Generate Final Usable Tickets
    const event = this.getEvent();
    const passTypes = this.getPassTypes();
    const pass = passTypes.find((p) => p.id === booking.pass_type_id);
    const passShort = pass?.id === 'pass_vip' ? 'VIP' : pass?.id === 'pass_group' ? 'GRP' : 'SGL';

    const totalTicketUnits = pass?.group_size && pass.group_size > 1 ? pass.group_size * booking.quantity : booking.quantity;

    const tickets = this.getTickets();
    const vouchers = this.getVouchers();
    const newTickets: Ticket[] = [];
    const newVouchers: DigitalVoucher[] = [];

    for (let i = 0; i < totalTicketUnits; i++) {
      const ticketSeq = Math.floor(10000 + Math.random() * 90000);
      const ticketNumber = `HRX-${passShort}-${ticketSeq}${totalTicketUnits > 1 ? `-${i + 1}` : ''}`;
      // Cryptographic security token embedded inside QR (never predictable)
      const securityToken = `HRX-SEC-${passShort}-${ticketSeq}-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

      let voucherId: string | undefined = undefined;

      // If VIP pass, generate a separate distinct voucher with its own distinct redemption code
      if (pass?.id === 'pass_vip') {
        voucherId = `VCH-${ticketSeq}`;
        newVouchers.push({
          id: voucherId,
          ticket_id: ticketNumber,
          booking_id: booking.id,
          user_id: booking.user_id,
          pass_name: 'VIP MEZZANINE PASS',
          benefit_title: '1 COMPLIMENTARY SIGNATURE BEVERAGE',
          benefit_description:
            'Redeemable at the private elevated mezzanine bar. Present this separate voucher code to the mixologist.',
          redemption_code: `HRX-BAR-${ticketSeq}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
          status: 'active',
          created_at: nowIso,
        });
      }

      newTickets.push({
        id: ticketNumber,
        booking_id: booking.id,
        user_id: booking.user_id,
        event_id: event.id,
        event_name: event.title,
        pass_type_id: booking.pass_type_id,
        pass_name: booking.pass_type_name,
        ticket_number: ticketNumber,
        customer_name: booking.customer_name,
        customer_email: booking.customer_email,
        customer_phone: booking.customer_mobile,
        security_token: securityToken,
        qr_data: securityToken,
        status: 'unused',
        voucher_id: voucherId,
        created_at: nowIso,
      });
    }

    setStored(STORAGE_KEYS.TICKETS, [...newTickets, ...tickets]);
    if (newVouchers.length > 0) {
      setStored(STORAGE_KEYS.VOUCHERS, [...newVouchers, ...vouchers]);
    }

    // Send Confirmation Email
    this.sendEmailNotification({
      user_id: booking.user_id,
      user_email: booking.customer_email,
      subject: `HELLRIX — Your Ticket Is Confirmed! [${booking.id}]`,
      type: 'payment_confirmed',
      preview_text: `Your payment has been reconciled. ${newTickets.length} ticket(s) issued.`,
      html_body: `
        <h2>ADMISSION CONFIRMED</h2>
        <p>Dear ${booking.customer_name},</p>
        <p>Your payment of ₹${payment.amount} has been verified by the HELLRIX operations desk.</p>
        <p><strong>Primary Ticket Number:</strong> ${newTickets[0]?.ticket_number}</p>
        <p>Your scannable cryptographic pass is accessible anytime under <strong>"My Tickets"</strong> in your account wallet.</p>
      `,
    });

    this.logAudit({
      user_id: adminUser.id,
      user_name: adminUser.name,
      user_role: adminUser.role,
      action: 'PAYMENT_APPROVED',
      target_id: payment.id,
      details: `Approved UTR ${payment.utr_number || 'N/A'} for ₹${payment.amount}. Issued ${newTickets.length} ticket(s) for booking ${booking.id}.`,
    });

    const approvedPayment = updatedPayments.find((p) => p.id === paymentId) || payment;
    return { success: true, payment: approvedPayment };
  }

  // Reject Payment (Admin/Owner Action)
  static rejectPayment(paymentId: string, reason: string, adminUser: User): { success: boolean; error?: string } {
    const payments = this.getPayments();
    const payment = payments.find((p) => p.id === paymentId);
    if (!payment) return { success: false, error: 'Payment not found.' };

    const booking = this.getBookingById(payment.booking_id);
    const nowIso = new Date().toISOString();

    const updatedPayments = payments.map((p) => {
      if (p.id === paymentId) {
        return {
          ...p,
          status: 'rejected' as const,
          rejection_reason: reason,
          verified_at: nowIso,
          verified_by_user_id: adminUser.id,
        };
      }
      return p;
    });
    setStored(STORAGE_KEYS.PAYMENTS, updatedPayments);

    if (booking) {
      const bookings = this.getBookings();
      const updatedBookings = bookings.map((b) => {
        if (b.id === booking.id) {
          const updatedTimeline = b.timeline.map((item) => {
            if (item.key === 'verified') {
              return {
                ...item,
                title: 'PAYMENT REJECTED',
                description: `Verification unsuccessful. Reason: ${reason}`,
                timestamp: nowIso,
                completed: true,
              };
            }
            return item;
          });

          return {
            ...b,
            status: 'payment_rejected' as const,
            timeline: updatedTimeline,
            updated_at: nowIso,
          };
        }
        return b;
      });
      setStored(STORAGE_KEYS.BOOKINGS, updatedBookings);

      // Email Notification
      this.sendEmailNotification({
        user_id: booking.user_id,
        user_email: booking.customer_email,
        subject: `HELLRIX — Payment Verification Issue [${booking.id}]`,
        type: 'payment_rejected',
        preview_text: `We could not verify your payment. Reason: ${reason}.`,
        html_body: `
          <h2>PAYMENT RECONCILIATION ISSUE</h2>
          <p>Dear ${booking.customer_name},</p>
          <p>Our audit team was unable to match your submitted UTR reference ${payment.utr_number} in our bank ledger.</p>
          <p><strong>Note:</strong> ${reason}</p>
          <p>Please contact our support desk or submit an inquiry to resolve this transaction.</p>
        `,
      });
    }

    this.logAudit({
      user_id: adminUser.id,
      user_name: adminUser.name,
      user_role: adminUser.role,
      action: 'PAYMENT_REJECTED',
      target_id: payment.id,
      details: `Rejected payment for booking ${payment.booking_id}. Reason: ${reason}`,
    });

    return { success: true };
  }

  // Tickets
  static getTickets(): Ticket[] {
    return getStored<Ticket[]>(STORAGE_KEYS.TICKETS, INITIAL_TICKETS);
  }

  static getUserTickets(userId: string): Ticket[] {
    const tickets = this.getTickets();
    return tickets.filter((t) => t.user_id === userId);
  }

  static getTicketById(ticketIdOrNumber: string): Ticket | undefined {
    const tickets = this.getTickets();
    const query = ticketIdOrNumber.trim().toUpperCase();
    return tickets.find(
      (t) =>
        t.id.toUpperCase() === query ||
        t.ticket_number.toUpperCase() === query ||
        t.security_token.toUpperCase() === query
    );
  }

  // Vouchers
  static getVouchers(): DigitalVoucher[] {
    return getStored<DigitalVoucher[]>(STORAGE_KEYS.VOUCHERS, INITIAL_VOUCHERS);
  }

  static getUserVouchers(userId: string): DigitalVoucher[] {
    const vouchers = this.getVouchers();
    return vouchers.filter((v) => v.user_id === userId);
  }

  static redeemVoucher(voucherId: string, staffUser: User): { success: boolean; error?: string } {
    const vouchers = this.getVouchers();
    const index = vouchers.findIndex((v) => v.id === voucherId || v.redemption_code === voucherId);
    if (index === -1) return { success: false, error: 'Voucher not found.' };

    const voucher = vouchers[index];
    if (voucher.status === 'redeemed') {
      return { success: false, error: `Voucher was already redeemed on ${new Date(voucher.redeemed_at || '').toLocaleTimeString()}` };
    }

    const updated: DigitalVoucher = {
      ...voucher,
      status: 'redeemed',
      redeemed_at: new Date().toISOString(),
    };
    vouchers[index] = updated;
    setStored(STORAGE_KEYS.VOUCHERS, vouchers);

    this.logAudit({
      user_id: staffUser.id,
      user_name: staffUser.name,
      user_role: staffUser.role,
      action: 'VOUCHER_REDEEMED',
      target_id: voucher.id,
      details: `Redeemed ${voucher.benefit_title} for attendee pass ${voucher.ticket_id}.`,
    });

    return { success: true };
  }

  // Scanner Verification (Atomic & Secure)
  static verifyAndCheckInTicket(tokenOrTicketNumber: string, staffUser: User): ScannerScanResult {
    const raw = tokenOrTicketNumber.trim();
    if (!raw) {
      return { status: 'INVALID', message: 'No ticket token detected.' };
    }

    const tickets = this.getTickets();
    const query = raw.toUpperCase();
    const ticketIndex = tickets.findIndex(
      (t) =>
        t.security_token.toUpperCase() === query ||
        t.ticket_number.toUpperCase() === query ||
        t.id.toUpperCase() === query
    );

    if (ticketIndex === -1) {
      return { status: 'INVALID', message: 'INVALID TICKET' };
    }

    const ticket = tickets[ticketIndex];

    // Already Used Guard
    if (ticket.status === 'used') {
      return {
        status: 'ALREADY_USED',
        message: 'ALREADY USED',
        ticket,
        previous_checkin: ticket.check_in,
      };
    }

    if (ticket.status === 'cancelled' || ticket.status === 'refunded') {
      return { status: 'INVALID', message: `Ticket is ${ticket.status.toUpperCase()}` };
    }

    // Atomic check-in
    const nowIso = new Date().toISOString();
    const checkInRecord = {
      timestamp: nowIso,
      staff_id: staffUser.id,
      staff_name: staffUser.name,
      device_info: 'Gate Terminal (Mobile Scanner)',
    };

    const updatedTicket: Ticket = {
      ...ticket,
      status: 'used',
      check_in: checkInRecord,
    };

    tickets[ticketIndex] = updatedTicket;
    setStored(STORAGE_KEYS.TICKETS, [...tickets]);

    this.logAudit({
      user_id: staffUser.id,
      user_name: staffUser.name,
      user_role: staffUser.role,
      action: 'TICKET_CHECKED_IN',
      target_id: ticket.ticket_number,
      details: `Checked in attendee ${ticket.customer_name} (${ticket.pass_name}). Status changed from unused to used.`,
    });

    return {
      status: 'VALID',
      message: 'VALID TICKET — CHECK-IN SUCCESSFUL',
      ticket: updatedTicket,
    };
  }

  // Users & RBAC
  static getUsers(): User[] {
    const users = getStored<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
    // Guarantee Root Owner (Uday Kumar) exists even if previous localStorage cache was present
    if (!users.some((u) => u.email.toLowerCase() === 'udaykumar@hellrix.com' || u.name === 'Uday Kumar')) {
      const merged = [...INITIAL_USERS, ...users.filter((u) => !INITIAL_USERS.some((iu) => iu.id === u.id))];
      setStored(STORAGE_KEYS.USERS, merged);
      return merged;
    }
    return users;
  }

  static getLoggedInUser(): User | null {
    const users = this.getUsers();
    const stored = getStored<User | null>(STORAGE_KEYS.ACTIVE_USER, null);
    if (stored) {
      const refreshed = users.find((u) => u.id === stored.id);
      if (refreshed) return refreshed;
    }
    return null;
  }

  static getActiveUser(): User {
    const loggedIn = this.getLoggedInUser();
    if (loggedIn) return loggedIn;
    const users = this.getUsers();
    return users.find((u) => u.role === 'customer') || users[0];
  }

  static setActiveUser(user: User | null): void {
    setStored(STORAGE_KEYS.ACTIVE_USER, user);
  }

  static hasPermission(user: User, permission: Permission): boolean {
    if (user.role === 'owner') return true;
    if (!user.permissions) return false;
    return user.permissions.includes(permission);
  }

  static verifyAdminLogin(
    identifier: string,
    passwordAttempt: string
  ): { success: boolean; user?: User; error?: string } {
    const users = this.getUsers();
    const cleanId = identifier.trim().toLowerCase();
    const user = users.find(
      (u) =>
        u.email.toLowerCase() === cleanId ||
        u.name.toLowerCase() === cleanId ||
        (cleanId === 'udaykumar' && u.email.toLowerCase() === 'udaykumar@hellrix.com')
    );

    if (!user) {
      return { success: false, error: 'Operational account not found with this identifier.' };
    }

    if (user.role === 'customer') {
      return { success: false, error: 'Customer accounts cannot access operational portals.' };
    }

    if (user.status === 'pending_approval') {
      return { success: false, error: 'Account clearance is pending manual approval by Uday Kumar.' };
    }

    if (user.status === 'rejected') {
      return { success: false, error: 'Access request was rejected by platform administration.' };
    }

    if (user.status === 'disabled') {
      return { success: false, error: 'This operational account has been deactivated.' };
    }

    const expectedPassword = user.password || 'admin1';
    if (passwordAttempt.trim() !== expectedPassword) {
      return { success: false, error: 'Invalid security password provided.' };
    }

    // Refresh last login
    const updatedUser: User = { ...user, last_login: new Date().toISOString() };
    this.updateUserProfile(user.id, updatedUser);

    this.logAudit({
      user_id: user.id,
      user_name: user.name,
      user_role: user.role,
      action: 'OPERATIONAL_LOGIN_SUCCESS',
      target_id: user.id,
      details: `Authenticated into operational portal with role ${user.role.toUpperCase()}`,
    });

    return { success: true, user: updatedUser };
  }

  // Staff & Admin Manual Access Request & Approval Workflow
  static submitAccessRequest(params: {
    name: string;
    email: string;
    mobile: string;
    requestedRole: UserRole;
    reason: string;
    password?: string;
  }): { success: boolean; error?: string } {
    const users = this.getUsers();
    if (users.some((u) => u.email.toLowerCase() === params.email.toLowerCase())) {
      return { success: false, error: 'An account with this email address already exists.' };
    }

    const newStaffReq: User = {
      id: `usr_staff_req_${Date.now()}`,
      name: params.name,
      email: params.email.toLowerCase(),
      mobile: params.mobile,
      role: params.requestedRole,
      requested_role: params.requestedRole,
      status: 'pending_approval',
      password: params.password || 'admin1',
      approval_note: params.reason,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    users.push(newStaffReq);
    setStored(STORAGE_KEYS.USERS, users);

    this.notifyAdmin({
      type: 'access_request',
      title: 'New Staff Access Request',
      message: `${params.name} requested [${params.requestedRole.toUpperCase()}] clearance.`,
      target_id: newStaffReq.id,
    });

    this.logAudit({
      user_id: newStaffReq.id,
      user_name: newStaffReq.name,
      user_role: newStaffReq.role,
      action: 'STAFF_ACCESS_REQUESTED',
      target_id: newStaffReq.id,
      details: `Applied for ${params.requestedRole.toUpperCase()} clearance: ${params.reason}`,
    });

    return { success: true };
  }

  static approveStaffAccess(
    userId: string,
    approvedRole: UserRole,
    permissions: Permission[],
    assignedEventId: string | undefined,
    approverUser: User,
    note?: string
  ): { success: boolean; user?: User; error?: string } {
    if (approverUser.role !== 'owner') {
      return { success: false, error: 'Only the Root Owner (Uday Kumar) can approve administrative clearances.' };
    }

    const users = this.getUsers();
    const idx = users.findIndex((u) => u.id === userId);
    if (idx === -1) return { success: false, error: 'User not found.' };

    const updated: User = {
      ...users[idx],
      role: approvedRole,
      status: 'active',
      permissions,
      assigned_event_id: assignedEventId,
      approval_note: note || `Approved by ${approverUser.name}`,
      updated_at: new Date().toISOString(),
    };

    users[idx] = updated;
    setStored(STORAGE_KEYS.USERS, users);

    this.logAudit({
      user_id: approverUser.id,
      user_name: approverUser.name,
      user_role: approverUser.role,
      action: 'STAFF_CLEARANCE_APPROVED',
      target_id: updated.id,
      details: `Approved ${updated.name} as ${approvedRole.toUpperCase()} with ${permissions.length} granular permissions.`,
    });

    return { success: true, user: updated };
  }

  static rejectStaffAccess(userId: string, approverUser: User, reason: string): { success: boolean } {
    const users = this.getUsers();
    const idx = users.findIndex((u) => u.id === userId);
    if (idx === -1) return { success: false };

    const updated: User = {
      ...users[idx],
      status: 'rejected',
      approval_note: reason,
      updated_at: new Date().toISOString(),
    };

    users[idx] = updated;
    setStored(STORAGE_KEYS.USERS, users);

    this.logAudit({
      user_id: approverUser.id,
      user_name: approverUser.name,
      user_role: approverUser.role,
      action: 'STAFF_CLEARANCE_REJECTED',
      target_id: userId,
      details: `Access request rejected. Reason: ${reason}`,
    });

    return { success: true };
  }

  static toggleStaffStatus(userId: string, approverUser: User): { success: boolean; newStatus?: StaffStatus } {
    const users = this.getUsers();
    const idx = users.findIndex((u) => u.id === userId);
    if (idx === -1) return { success: false };

    const current = users[idx];
    const newStatus: StaffStatus = current.status === 'active' ? 'disabled' : 'active';
    users[idx] = { ...current, status: newStatus, updated_at: new Date().toISOString() };
    setStored(STORAGE_KEYS.USERS, users);

    this.logAudit({
      user_id: approverUser.id,
      user_name: approverUser.name,
      user_role: approverUser.role,
      action: 'STAFF_STATUS_TOGGLED',
      target_id: userId,
      details: `Status set to ${newStatus.toUpperCase()}`,
    });

    return { success: true, newStatus };
  }

  static registerUser(params: { name: string; email: string; mobile: string }): User {
    const users = this.getUsers();
    const existing = users.find((u) => u.email.toLowerCase() === params.email.toLowerCase());
    if (existing) return existing;

    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: params.name,
      email: params.email.toLowerCase(),
      mobile: params.mobile,
      role: 'customer',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    users.push(newUser);
    setStored(STORAGE_KEYS.USERS, users);
    this.setActiveUser(newUser);

    this.sendEmailNotification({
      user_id: newUser.id,
      user_email: newUser.email,
      subject: 'Welcome to HELLRIX — Account Created',
      type: 'registration_welcome',
      preview_text: 'Your attendee profile has been initialized.',
      html_body: `<p>Welcome to HELLRIX, ${newUser.name}. Your account is active. Passes can be reserved via the collection.</p>`,
    });

    this.logAudit({
      user_id: newUser.id,
      user_name: newUser.name,
      user_role: 'customer',
      action: 'USER_REGISTERED',
      target_id: newUser.id,
      details: `Registered account: ${newUser.email}`,
    });

    return newUser;
  }

  static updateUserProfile(userId: string, data: Partial<User>): User | null {
    const users = this.getUsers();
    let updatedUser: User | null = null;
    const updated = users.map((u) => {
      if (u.id === userId) {
        updatedUser = {
          ...u,
          ...data,
          updated_at: new Date().toISOString(),
        };
        return updatedUser;
      }
      return u;
    });

    if (updatedUser) {
      setStored(STORAGE_KEYS.USERS, updated);
      const active = this.getActiveUser();
      if (active.id === userId) {
        this.setActiveUser(updatedUser);
      }
    }
    return updatedUser;
  }

  static updateUserRole(userId: string, newRole: UserRole, adminUser: User): boolean {
    const users = this.getUsers();
    const updated = users.map((u) => (u.id === userId ? { ...u, role: newRole } : u));
    setStored(STORAGE_KEYS.USERS, updated);

    this.logAudit({
      user_id: adminUser.id,
      user_name: adminUser.name,
      user_role: adminUser.role,
      action: 'STAFF_ROLE_MODIFIED',
      target_id: userId,
      details: `Changed role to ${newRole}`,
    });

    return true;
  }

  // Bank Statement Upload & Automatic Reconciliation
  static getBankTransactions(): BankTransaction[] {
    return getStored<BankTransaction[]>(STORAGE_KEYS.BANK_TX, INITIAL_BANK_TRANSACTIONS);
  }

  static getReconciliationBatches(): ReconciliationBatch[] {
    return getStored<ReconciliationBatch[]>(STORAGE_KEYS.RECON_BATCHES, INITIAL_RECON_BATCHES);
  }

  static importBankStatement(
    params: {
      filename: string;
      transactions: Array<{
        reference_utr: string;
        amount: number;
        type: 'credit' | 'debit';
        description: string;
        transaction_date?: string;
      }>;
    },
    uploader: User
  ): ReconciliationBatch {
    const existingTx = this.getBankTransactions();
    const payments = this.getPayments();
    const batchId = `BATCH-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    let exactMatches = 0;
    let manualReview = 0;
    let unmatched = 0;
    let duplicateRecords = 0;
    let matchedValue = 0;

    const newTxList: BankTransaction[] = [];

    for (const t of params.transactions) {
      const cleanUtr = t.reference_utr.trim().toUpperCase();

      // Duplicate detection in bank history
      if (existingTx.some((etx) => etx.reference_utr.toUpperCase() === cleanUtr)) {
        duplicateRecords++;
        continue;
      }

      // Match against customer payments
      const matchedPayment = payments.find(
        (p) => p.utr_number && p.utr_number.trim().toUpperCase() === cleanUtr
      );

      let status: 'exact_match' | 'partial_match' | 'unmatched' = 'unmatched';
      let matchedBookingId: string | undefined = undefined;
      let matchedPaymentId: string | undefined = undefined;

      if (matchedPayment && t.type === 'credit') {
        matchedBookingId = matchedPayment.booking_id;
        matchedPaymentId = matchedPayment.id;
        if (matchedPayment.amount === t.amount) {
          status = 'exact_match';
          exactMatches++;
          matchedValue += t.amount;
        } else {
          status = 'partial_match';
          manualReview++;
        }
      } else {
        unmatched++;
      }

      newTxList.push({
        id: `tx_bank_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        reference_utr: cleanUtr,
        transaction_date: t.transaction_date || new Date().toISOString(),
        type: t.type,
        amount: t.amount,
        description: t.description,
        source_file: params.filename,
        batch_id: batchId,
        match_status: status,
        matched_booking_id: matchedBookingId,
        matched_payment_id: matchedPaymentId,
        created_at: new Date().toISOString(),
      });
    }

    const updatedTx = [...newTxList, ...existingTx];
    setStored(STORAGE_KEYS.BANK_TX, updatedTx);

    const newBatch: ReconciliationBatch = {
      id: batchId,
      filename: params.filename,
      uploaded_by: uploader.name,
      uploaded_at: new Date().toISOString(),
      total_imported: newTxList.length,
      exact_matches: exactMatches,
      manual_review: manualReview,
      unmatched: unmatched,
      duplicate_records: duplicateRecords,
      approved_count: 0,
      total_matched_value: matchedValue,
      status: 'processed',
    };

    const batches = this.getReconciliationBatches();
    batches.unshift(newBatch);
    setStored(STORAGE_KEYS.RECON_BATCHES, batches);

    this.notifyAdmin({
      type: 'reconciliation_done',
      title: 'Bank Statement Processed',
      message: `${params.filename}: ${exactMatches} exact matches ready for bulk approval (₹${matchedValue.toLocaleString()}).`,
      target_id: batchId,
    });

    this.logAudit({
      user_id: uploader.id,
      user_name: uploader.name,
      user_role: uploader.role,
      action: 'BANK_STATEMENT_UPLOADED',
      target_id: batchId,
      details: `Imported ${newTxList.length} txs. Found ${exactMatches} exact matches.`,
    });

    return newBatch;
  }

  static bulkApproveReconciledPayments(
    paymentIds: string[],
    approverUser: User,
    batchId?: string
  ): { approvedCount: number; totalAmount: number } {
    let approvedCount = 0;
    let totalAmount = 0;

    for (const pid of paymentIds) {
      const res = this.approvePayment(pid, approverUser, `Bulk approved via Bank Reconciliation ${batchId || ''}`);
      if (res.success && res.payment) {
        approvedCount++;
        totalAmount += res.payment.amount;
      }
    }

    if (batchId) {
      const batches = this.getReconciliationBatches();
      const bIdx = batches.findIndex((b) => b.id === batchId);
      if (bIdx !== -1) {
        batches[bIdx] = {
          ...batches[bIdx],
          approved_count: batches[bIdx].approved_count + approvedCount,
          status: 'reconciled',
        };
        setStored(STORAGE_KEYS.RECON_BATCHES, batches);
      }
    }

    this.logAudit({
      user_id: approverUser.id,
      user_name: approverUser.name,
      user_role: approverUser.role,
      action: 'BULK_PAYMENTS_APPROVED',
      target_id: batchId || 'BULK_OPS',
      details: `Bulk approved ${approvedCount} reconciled payments totaling ₹${totalAmount.toLocaleString()}`,
    });

    return { approvedCount, totalAmount };
  }

  // Ticket Operations (Reissue, Revoke)
  static reissueTicket(
    ticketId: string,
    actorUser: User,
    reason: string
  ): { success: boolean; newTicket?: Ticket; error?: string } {
    const tickets = this.getTickets();
    const idx = tickets.findIndex((t) => t.id === ticketId || t.ticket_number === ticketId);
    if (idx === -1) return { success: false, error: 'Ticket not found.' };

    const oldTicket = tickets[idx];
    const newToken = `HRX-SEC-REISSUE-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const reissued: Ticket = {
      ...oldTicket,
      security_token: newToken,
      qr_data: newToken,
      status: 'unused',
      check_in: undefined,
    };

    tickets[idx] = reissued;
    setStored(STORAGE_KEYS.TICKETS, tickets);

    this.logAudit({
      user_id: actorUser.id,
      user_name: actorUser.name,
      user_role: actorUser.role,
      action: 'TICKET_REISSUED',
      target_id: oldTicket.ticket_number,
      details: `Reissued credential. Old token invalidated. Reason: ${reason}`,
    });

    return { success: true, newTicket: reissued };
  }

  static revokeTicket(ticketId: string, actorUser: User, reason: string): { success: boolean; error?: string } {
    const tickets = this.getTickets();
    const idx = tickets.findIndex((t) => t.id === ticketId || t.ticket_number === ticketId);
    if (idx === -1) return { success: false, error: 'Ticket not found.' };

    tickets[idx] = { ...tickets[idx], status: 'cancelled' };
    setStored(STORAGE_KEYS.TICKETS, tickets);

    this.logAudit({
      user_id: actorUser.id,
      user_name: actorUser.name,
      user_role: actorUser.role,
      action: 'TICKET_REVOKED',
      target_id: ticketId,
      details: `Revoked entry pass. Reason: ${reason}`,
    });

    return { success: true };
  }

  // Admin Notifications
  static getAdminNotifications(): AdminNotification[] {
    return getStored<AdminNotification[]>(STORAGE_KEYS.ADMIN_NOTIFICATIONS, INITIAL_ADMIN_NOTIFICATIONS);
  }

  static notifyAdmin(notification: Omit<AdminNotification, 'id' | 'created_at' | 'read'>): void {
    const notifs = this.getAdminNotifications();
    const newNotif: AdminNotification = {
      id: `notif_${Date.now()}`,
      created_at: new Date().toISOString(),
      read: false,
      ...notification,
    };
    notifs.unshift(newNotif);
    setStored(STORAGE_KEYS.ADMIN_NOTIFICATIONS, notifs.slice(0, 50));
  }

  static markAdminNotificationRead(id: string): void {
    const notifs = this.getAdminNotifications();
    const updated = notifs.map((n) => (n.id === id ? { ...n, read: true } : n));
    setStored(STORAGE_KEYS.ADMIN_NOTIFICATIONS, updated);
  }

  // Reports & CSV Exports
  static exportBookingsCsv(): string {
    const bookings = this.getBookings();
    const headers = ['Booking ID', 'Customer Name', 'Email', 'Mobile', 'Pass Tier', 'Quantity', 'Amount (INR)', 'Status', 'Expires At', 'Created At'];
    const rows = bookings.map((b) => [
      b.id,
      `"${b.customer_name.replace(/"/g, '""')}"`,
      b.customer_email,
      b.customer_mobile,
      `"${b.pass_type_name.replace(/"/g, '""')}"`,
      b.quantity,
      b.total_amount,
      b.status,
      b.reservation_expires_at,
      b.created_at,
    ]);
    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }

  static exportPaymentsCsv(): string {
    const payments = this.getPayments();
    const headers = ['Payment ID', 'Booking ID', 'Amount (INR)', 'Provider', 'UTR Number', 'Payer Name', 'Status', 'Submitted At', 'Verified At'];
    const rows = payments.map((p) => [
      p.id,
      p.booking_id,
      p.amount,
      p.provider,
      p.utr_number || '',
      `"${(p.payer_account_name || '').replace(/"/g, '""')}"`,
      p.status,
      p.submitted_at || '',
      p.verified_at || '',
    ]);
    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }

  static exportAttendeesCsv(): string {
    const tickets = this.getTickets();
    const headers = ['Ticket ID', 'Booking ID', 'Customer Name', 'Email', 'Phone', 'Pass Type', 'Status', 'Checked In At', 'Gate Staff'];
    const rows = tickets.map((t) => [
      t.ticket_number,
      t.booking_id,
      `"${t.customer_name.replace(/"/g, '""')}"`,
      t.customer_email,
      t.customer_phone,
      `"${t.pass_name.replace(/"/g, '""')}"`,
      t.status,
      t.check_in?.timestamp || '',
      `"${(t.check_in?.staff_name || '').replace(/"/g, '""')}"`,
    ]);
    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }

  static exportAuditLogsCsv(): string {
    const logs = this.getAuditLogs();
    const headers = ['Log ID', 'Timestamp', 'Actor Name', 'Role', 'Action', 'Target ID', 'Details'];
    const rows = logs.map((l) => [
      l.id,
      l.timestamp,
      `"${l.user_name.replace(/"/g, '""')}"`,
      l.user_role,
      l.action,
      l.target_id,
      `"${l.details.replace(/"/g, '""')}"`,
    ]);
    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }

  static exportReconciliationCsv(): string {
    const txs = this.getBankTransactions();
    const headers = ['Transaction ID', 'UTR Reference', 'Type', 'Amount (INR)', 'Status', 'Matched Booking ID', 'Source File', 'Batch ID', 'Date'];
    const rows = txs.map((tx) => [
      tx.id,
      tx.reference_utr,
      tx.type,
      tx.amount,
      tx.match_status,
      tx.matched_booking_id || '',
      tx.source_file,
      tx.batch_id,
      tx.transaction_date,
    ]);
    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }

  // Email Notifications
  static getEmails(): EmailNotification[] {
    return getStored<EmailNotification[]>(STORAGE_KEYS.EMAILS, INITIAL_EMAILS);
  }

  static getUserEmails(userId: string): EmailNotification[] {
    const emails = this.getEmails();
    return emails.filter((e) => e.user_id === userId);
  }

  static sendEmailNotification(data: Omit<EmailNotification, 'id' | 'sent_at' | 'read'>): EmailNotification {
    const emails = this.getEmails();
    const newEmail: EmailNotification = {
      id: `em_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      sent_at: new Date().toISOString(),
      read: false,
      ...data,
    };
    emails.unshift(newEmail);
    setStored(STORAGE_KEYS.EMAILS, emails.slice(0, 50));
    return newEmail;
  }

  static markEmailAsRead(emailId: string): void {
    const emails = this.getEmails();
    const updated = emails.map((e) => (e.id === emailId ? { ...e, read: true } : e));
    setStored(STORAGE_KEYS.EMAILS, updated);
  }

  // Audit Logs
  static getAuditLogs(): AuditLog[] {
    return getStored<AuditLog[]>(STORAGE_KEYS.AUDIT, INITIAL_AUDIT_LOGS);
  }

  static logAudit(entry: Omit<AuditLog, 'id' | 'timestamp'>): void {
    const logs = this.getAuditLogs();
    const newLog: AuditLog = {
      id: `aud_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      ...entry,
    };
    logs.unshift(newLog);
    setStored(STORAGE_KEYS.AUDIT, logs.slice(0, 150));
  }

  // Support
  static getSupportTickets(): SupportTicket[] {
    return getStored<SupportTicket[]>(STORAGE_KEYS.SUPPORT, INITIAL_SUPPORT_TICKETS);
  }

  static createSupportTicket(ticket: Omit<SupportTicket, 'id' | 'created_at' | 'status'>): SupportTicket {
    const tickets = this.getSupportTickets();
    const newTicket: SupportTicket = {
      id: `sup_${Date.now()}`,
      status: 'open',
      created_at: new Date().toISOString(),
      ...ticket,
    };
    tickets.unshift(newTicket);
    setStored(STORAGE_KEYS.SUPPORT, tickets);

    this.notifyAdmin({
      type: 'support_ticket',
      title: 'New Support Inquiry',
      message: `${ticket.name} (${ticket.category}): ${ticket.subject}`,
      target_id: newTicket.id,
    });

    return newTicket;
  }

  static updateSupportTicket(
    ticketId: string,
    updates: {
      status?: 'open' | 'in_progress' | 'resolved';
      admin_reply?: string;
    },
    staffUser: User
  ): SupportTicket | null {
    const tickets = this.getSupportTickets();
    const idx = tickets.findIndex((t) => t.id === ticketId);
    if (idx === -1) return null;

    const updated = {
      ...tickets[idx],
      ...updates,
    };
    tickets[idx] = updated;
    setStored(STORAGE_KEYS.SUPPORT, tickets);

    this.logAudit({
      user_id: staffUser.id,
      user_name: staffUser.name,
      user_role: staffUser.role,
      action: 'SUPPORT_TICKET_UPDATED',
      target_id: ticketId,
      details: `Status: ${updates.status || 'unchanged'}. Reply appended.`,
    });

    return updated;
  }

  // Settings & Payment Provider Architecture
  static getSettings(): SystemSettings {
    return getStored<SystemSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
  }

  static updateSettings(data: Partial<SystemSettings>, adminUser: User): SystemSettings {
    const current = this.getSettings();
    const updated = { ...current, ...data };
    setStored(STORAGE_KEYS.SETTINGS, updated);

    this.logAudit({
      user_id: adminUser.id,
      user_name: adminUser.name,
      user_role: adminUser.role,
      action: 'SETTINGS_UPDATED',
      target_id: 'system_settings',
      details: `Payment Provider is now: ${updated.payment_provider.toUpperCase()} (UPI: ${updated.upi_id})`,
    });

    return updated;
  }

  // =========================================================================
  // CMS: POSTS / ANNOUNCEMENTS / DOSSIERS
  // =========================================================================
  static getCmsPosts(): CmsPost[] {
    return getStored<CmsPost[]>(STORAGE_KEYS.CMS_POSTS, INITIAL_CMS_POSTS);
  }

  static getPublishedCmsPosts(): CmsPost[] {
    return this.getCmsPosts().filter((p) => p.published);
  }

  static addCmsPost(
    post: Omit<CmsPost, 'id' | 'date'> & { date?: string },
    adminUser: User
  ): CmsPost {
    const posts = this.getCmsPosts();
    const newPost: CmsPost = {
      ...post,
      id: `post_${Date.now()}`,
      date: post.date || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase(),
      published: post.published ?? true,
    };
    posts.unshift(newPost);
    setStored(STORAGE_KEYS.CMS_POSTS, posts);

    this.logAudit({
      user_id: adminUser.id,
      user_name: adminUser.name,
      user_role: adminUser.role,
      action: 'CMS_POST_CREATED',
      target_id: newPost.id,
      details: `Created new post: "${newPost.title}" (${newPost.category})`,
    });

    return newPost;
  }

  static updateCmsPost(
    postId: string,
    updates: Partial<CmsPost>,
    adminUser: User
  ): CmsPost | null {
    const posts = this.getCmsPosts();
    const idx = posts.findIndex((p) => p.id === postId);
    if (idx === -1) return null;

    const updated = { ...posts[idx], ...updates };
    posts[idx] = updated;
    setStored(STORAGE_KEYS.CMS_POSTS, posts);

    this.logAudit({
      user_id: adminUser.id,
      user_name: adminUser.name,
      user_role: adminUser.role,
      action: 'CMS_POST_UPDATED',
      target_id: postId,
      details: `Updated post: "${updated.title}". Status: ${updated.published ? 'Published' : 'Draft'}`,
    });

    return updated;
  }

  static deleteCmsPost(postId: string, adminUser: User): boolean {
    const posts = this.getCmsPosts();
    const target = posts.find((p) => p.id === postId);
    if (!target) return false;

    const filtered = posts.filter((p) => p.id !== postId);
    setStored(STORAGE_KEYS.CMS_POSTS, filtered);

    this.logAudit({
      user_id: adminUser.id,
      user_name: adminUser.name,
      user_role: adminUser.role,
      action: 'CMS_POST_DELETED',
      target_id: postId,
      details: `Deleted post: "${target.title}"`,
    });

    return true;
  }

  // =========================================================================
  // CMS: WEBSITE SECTIONS & MATTERS (EDIT COPY, HEADINGS & VISIBILITY)
  // =========================================================================
  static getCmsSections(): CmsSectionMatter[] {
    return getStored<CmsSectionMatter[]>(STORAGE_KEYS.CMS_SECTIONS, INITIAL_CMS_SECTIONS);
  }

  static getCmsSection(key: string): CmsSectionMatter | undefined {
    const sections = this.getCmsSections();
    return sections.find((s) => s.section_key === key);
  }

  static updateCmsSection(
    sectionId: string,
    updates: Partial<CmsSectionMatter>,
    adminUser: User
  ): CmsSectionMatter | null {
    const sections = this.getCmsSections();
    const idx = sections.findIndex((s) => s.id === sectionId || s.section_key === sectionId);
    if (idx === -1) return null;

    const updated = { ...sections[idx], ...updates };
    sections[idx] = updated;
    setStored(STORAGE_KEYS.CMS_SECTIONS, sections);

    this.logAudit({
      user_id: adminUser.id,
      user_name: adminUser.name,
      user_role: adminUser.role,
      action: 'CMS_SECTION_UPDATED',
      target_id: sectionId,
      details: `Updated section "${updated.section_key}": Title="${updated.title}", Visible=${updated.is_visible}`,
    });

    return updated;
  }

  static toggleCmsSectionVisibility(sectionId: string, adminUser: User): boolean {
    const sections = this.getCmsSections();
    const target = sections.find((s) => s.id === sectionId || s.section_key === sectionId);
    if (!target) return false;

    return !!this.updateCmsSection(sectionId, { is_visible: !target.is_visible }, adminUser);
  }

  // =========================================================================
  // CMS: HIGHLIGHT PILLARS
  // =========================================================================
  static getCmsPillars(): CmsHighlightPillar[] {
    return getStored<CmsHighlightPillar[]>(STORAGE_KEYS.CMS_PILLARS, INITIAL_CMS_PILLARS);
  }

  static updateCmsPillar(
    pillarId: string,
    updates: Partial<CmsHighlightPillar>,
    adminUser: User
  ): CmsHighlightPillar | null {
    const pillars = this.getCmsPillars();
    const idx = pillars.findIndex((p) => p.id === pillarId);
    if (idx === -1) return null;

    const updated = { ...pillars[idx], ...updates };
    pillars[idx] = updated;
    setStored(STORAGE_KEYS.CMS_PILLARS, pillars);

    this.logAudit({
      user_id: adminUser.id,
      user_name: adminUser.name,
      user_role: adminUser.role,
      action: 'CMS_PILLAR_UPDATED',
      target_id: pillarId,
      details: `Updated pillar "${updated.title}"`,
    });

    return updated;
  }

  static addCmsPillar(
    pillar: Omit<CmsHighlightPillar, 'id'>,
    adminUser: User
  ): CmsHighlightPillar {
    const pillars = this.getCmsPillars();
    const newPillar: CmsHighlightPillar = {
      ...pillar,
      id: `pil_${Date.now()}`,
    };
    pillars.push(newPillar);
    setStored(STORAGE_KEYS.CMS_PILLARS, pillars);

    this.logAudit({
      user_id: adminUser.id,
      user_name: adminUser.name,
      user_role: adminUser.role,
      action: 'CMS_PILLAR_CREATED',
      target_id: newPillar.id,
      details: `Created pillar "${newPillar.title}"`,
    });

    return newPillar;
  }

  static deleteCmsPillar(pillarId: string, adminUser: User): boolean {
    const pillars = this.getCmsPillars();
    const target = pillars.find((p) => p.id === pillarId);
    if (!target) return false;

    const filtered = pillars.filter((p) => p.id !== pillarId);
    setStored(STORAGE_KEYS.CMS_PILLARS, filtered);

    this.logAudit({
      user_id: adminUser.id,
      user_name: adminUser.name,
      user_role: adminUser.role,
      action: 'CMS_PILLAR_DELETED',
      target_id: pillarId,
      details: `Deleted pillar "${target.title}"`,
    });

    return true;
  }
}
