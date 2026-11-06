export type UserRole =
  | 'owner'
  | 'admin'
  | 'payment_manager'
  | 'event_manager'
  | 'check_in_staff'
  | 'support_staff'
  | 'customer';

export type StaffStatus = 'pending_approval' | 'active' | 'disabled' | 'rejected';

export type Permission =
  | 'events.view'
  | 'events.create'
  | 'events.edit'
  | 'events.delete'
  | 'bookings.view'
  | 'bookings.manage'
  | 'payments.view'
  | 'payments.verify'
  | 'payments.reject'
  | 'payments.reconcile'
  | 'attendees.view'
  | 'attendees.edit'
  | 'tickets.view'
  | 'tickets.reissue'
  | 'tickets.revoke'
  | 'vouchers.view'
  | 'vouchers.reissue'
  | 'vouchers.revoke'
  | 'staff.view'
  | 'staff.create'
  | 'staff.update'
  | 'staff.disable'
  | 'staff.approve'
  | 'reports.view'
  | 'reports.export'
  | 'settings.manage'
  | 'audit.view'
  | 'scan.access';

export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: UserRole;
  status?: StaffStatus; // For staff / admin accounts
  assigned_event_id?: string;
  permissions?: Permission[];
  password?: string; // Credential checking (e.g. udaykumar / admin1)
  requested_role?: UserRole;
  approval_note?: string;
  created_at: string;
  updated_at: string;
  last_login?: string;
}

export interface BankTransaction {
  id: string;
  reference_utr: string;
  transaction_date: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  source_file: string;
  batch_id: string;
  match_status: 'exact_match' | 'partial_match' | 'unmatched';
  matched_booking_id?: string;
  matched_payment_id?: string;
  created_at: string;
}

export interface ReconciliationBatch {
  id: string;
  filename: string;
  uploaded_by: string;
  uploaded_at: string;
  total_imported: number;
  exact_matches: number;
  manual_review: number;
  unmatched: number;
  duplicate_records: number;
  approved_count: number;
  total_matched_value: number;
  status: 'processed' | 'reconciled' | 'archived';
}

export interface AdminNotification {
  id: string;
  type:
    | 'new_booking'
    | 'new_utr'
    | 'reconciliation_done'
    | 'support_ticket'
    | 'access_request'
    | 'system_alert';
  title: string;
  message: string;
  target_id?: string;
  read: boolean;
  created_at: string;
}

export type EventStatus =
  | 'booking_open'
  | 'upcoming'
  | 'sold_out'
  | 'booking_closed'
  | 'completed'
  | 'cancelled';

export interface EventRule {
  id: string;
  rule: string;
}

export interface EventData {
  id: string;
  title: string;
  edition: string;
  tagline: string;
  date: string;
  raw_date: string;
  time: string;
  venue: string;
  address: string;
  city: string;
  description: string;
  curator: string;
  total_capacity: number;
  poster_url: string;
  gallery_urls: string[];
  status: EventStatus;
  rules: string[];
  fee_percentage: number;
  fixed_booking_fee: number;
}

export interface PassType {
  id: string;
  event_id: string;
  name: string;
  tag: string;
  price: number;
  capacity: number;
  group_size: number;
  perks: string[];
  is_exclusive?: boolean;
  max_per_order: number;
}

export type BookingStatus =
  | 'reserved'
  | 'payment_pending'
  | 'verification_pending'
  | 'confirmed'
  | 'payment_rejected'
  | 'expired'
  | 'cancelled';

export interface BookingTimelineItem {
  key: string;
  title: string;
  description: string;
  timestamp: string;
  completed: boolean;
}

export interface Booking {
  id: string; // e.g. HRX-2026-10482
  user_id: string;
  customer_name: string;
  customer_email: string;
  customer_mobile: string;
  event_id: string;
  pass_type_id: string;
  pass_type_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  booking_fee: number;
  total_amount: number;
  status: BookingStatus;
  reservation_expires_at: string; // ISO string for authoritative 10-minute hold
  payment_id?: string;
  timeline: BookingTimelineItem[];
  created_at: string;
  updated_at: string;
}

export type PaymentStatus =
  | 'unpaid'
  | 'utr_submitted'
  | 'verification_pending'
  | 'matched'
  | 'approved'
  | 'rejected';

export type PaymentProvider = 'manual_upi' | 'gateway';

export interface Payment {
  id: string;
  booking_id: string;
  user_id: string;
  amount: number;
  provider: PaymentProvider;
  upi_id_used: string;
  utr_number?: string;
  payer_account_name?: string;
  notes?: string;
  status: PaymentStatus;
  rejection_reason?: string;
  submitted_at?: string;
  verified_at?: string;
  verified_by_user_id?: string;
  created_at: string;
}

export type TicketStatus = 'unused' | 'used' | 'cancelled' | 'refunded';

export interface CheckInInfo {
  timestamp: string;
  staff_id: string;
  staff_name: string;
  device_info: string;
}

export interface DigitalVoucher {
  id: string; // e.g. VCH-10482
  ticket_id: string;
  booking_id: string;
  user_id: string;
  pass_name: string;
  benefit_title: string;
  benefit_description: string;
  redemption_code: string; // Separate distinct token, never entry QR!
  status: 'active' | 'redeemed' | 'expired';
  redeemed_at?: string;
  created_at: string;
}

export interface Ticket {
  id: string; // e.g. HRX-VIP-10482
  booking_id: string;
  user_id: string;
  event_id: string;
  event_name: string;
  pass_type_id: string;
  pass_name: string;
  ticket_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  security_token: string; // Cryptographic validation token
  qr_data: string;
  status: TicketStatus;
  check_in?: CheckInInfo;
  voucher_id?: string;
  created_at: string;
}

export interface EmailNotification {
  id: string;
  user_id: string;
  user_email: string;
  subject: string;
  type:
    | 'registration_welcome'
    | 'booking_reserved'
    | 'utr_submitted'
    | 'payment_confirmed'
    | 'payment_rejected'
    | 'ticket_issued';
  preview_text: string;
  html_body: string;
  sent_at: string;
  read: boolean;
}

export interface AuditLog {
  id: string;
  user_id: string;
  user_name: string;
  user_role: UserRole;
  action: string;
  target_id: string;
  details: string;
  timestamp: string;
}

export interface SupportTicket {
  id: string;
  user_id?: string;
  name: string;
  email: string;
  booking_id?: string;
  category:
    | 'payment_verification'
    | 'utr_problem'
    | 'booking_problem'
    | 'ticket_not_received'
    | 'qr_scanning_issue'
    | 'general_enquiry';
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved';
  admin_reply?: string;
  created_at: string;
}

export interface ScannerScanResult {
  status: 'VALID' | 'ALREADY_USED' | 'INVALID';
  message: string;
  ticket?: Ticket;
  previous_checkin?: CheckInInfo;
}

export interface SystemSettings {
  payment_provider: PaymentProvider;
  upi_id: string;
  upi_receiver_name: string;
  verification_sla_hours: number;
  support_email: string;
  support_phone: string;
  instagram_handle: string;
}

export interface CmsPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: 'announcement' | 'lineup' | 'briefing' | 'intel';
  author: string;
  date: string;
  cover_url?: string;
  published: boolean;
  tags: string[];
}

export interface CmsSectionMatter {
  id: string;
  section_key: 'hero' | 'curated_exp' | 'pillars' | 'manifesto' | 'final_cta' | 'policies';
  title: string;
  subtitle: string;
  tag: string;
  body?: string;
  is_visible: boolean;
  order: number;
  image_url?: string;
}

export interface CmsHighlightPillar {
  id: string;
  number: string;
  title: string;
  description: string;
  is_visible: boolean;
}

