import React, { useState } from 'react';
import {
  User,
  Booking,
  Payment,
  Ticket,
  PassType,
  EventData,
  AuditLog,
  SupportTicket,
  SystemSettings,
  BankTransaction,
  ReconciliationBatch,
  AdminNotification,
  UserRole,
  Permission,
} from '../../types';
import { HellrixService } from '../../services/store';
import { HellrixLogo } from '../../components/brand/HellrixLogo';
import {
  LayoutDashboard,
  Calendar,
  Ticket as TicketIcon,
  CreditCard,
  Users,
  ShieldAlert,
  Settings,
  HelpCircle,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  Eye,
  RefreshCw,
  LogOut,
  QrCode,
  FileText,
  Upload,
  Download,
  ShieldCheck,
  Lock,
  UserPlus,
  Bell,
  Check,
  ChevronRight,
  ExternalLink,
  Layers,
  Database,
  BarChart3,
  Coffee,
  RotateCcw,
} from 'lucide-react';

interface AdminPortalProps {
  currentUser: User | null;
  onNavigateWorld: (world: 'public' | 'admin' | 'scanner') => void;
  onLogout: () => void;
  onUserChange?: (user: User) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  currentUser,
  onNavigateWorld,
  onLogout,
  onUserChange,
}) => {
  const isOwner = currentUser?.role === 'owner';
  const isAuthorizedOperationalUser = currentUser ? currentUser.role !== 'customer' : false;

  // Dedicated Admin Login State (if acting as Customer or not signed in)
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  // Staff Access Request Modal State
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [reqName, setReqName] = useState('');
  const [reqEmail, setReqEmail] = useState('');
  const [reqMobile, setReqMobile] = useState('');
  const [reqRole, setReqRole] = useState<UserRole>('check_in_staff');
  const [reqReason, setReqReason] = useState('');
  const [reqPassword, setReqPassword] = useState('admin1');
  const [reqSubmitted, setReqSubmitted] = useState(false);

  // Operational Navigation Tabs
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'events'
    | 'bookings'
    | 'utr_desk'
    | 'bank_recon'
    | 'attendees'
    | 'inventory'
    | 'tickets'
    | 'vouchers'
    | 'staff'
    | 'support'
    | 'reports'
    | 'audit'
    | 'settings'
  >('overview');

  // Search, Notifications, Modals
  const [globalSearch, setGlobalSearch] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Payment Rejection Modal
  const [rejectionModal, setRejectionModal] = useState<{ open: boolean; paymentId: string; reason: string }>({
    open: false,
    paymentId: '',
    reason: '',
  });

  // Ticket Reissue Modal
  const [reissueModal, setReissueModal] = useState<{ open: boolean; ticketId: string; reason: string }>({
    open: false,
    ticketId: '',
    reason: '',
  });

  // Bulk Reconcile Confirmation Modal
  const [bulkApproveModal, setBulkApproveModal] = useState<{ open: boolean; batchId: string; paymentIds: string[]; totalValue: number }>({
    open: false,
    batchId: '',
    paymentIds: [],
    totalValue: 0,
  });

  // Data fetching
  const event = HellrixService.getEvent();
  const passTypes = HellrixService.getPassTypes();
  const bookings = HellrixService.getBookings();
  const payments = HellrixService.getPayments();
  const tickets = HellrixService.getTickets();
  const vouchers = HellrixService.getVouchers();
  const bankTxs = HellrixService.getBankTransactions();
  const reconBatches = HellrixService.getReconciliationBatches();
  const notifications = HellrixService.getAdminNotifications();
  const auditLogs = HellrixService.getAuditLogs();
  const supportTickets = HellrixService.getSupportTickets();
  const settings = HellrixService.getSettings();
  const allUsers = HellrixService.getUsers();

  const unreadNotifs = notifications.filter((n) => !n.read);

  // Metrics
  const confirmedPayments = payments.filter((p) => p.status === 'approved');
  const pendingPayments = payments.filter((p) => p.status === 'verification_pending');
  const totalRevenue = confirmedPayments.reduce((acc, p) => acc + p.amount, 0);
  const checkedInCount = tickets.filter((t) => t.status === 'used').length;
  const activeReservations = bookings.filter((b) => b.status === 'reserved').length;
  const pendingStaffRequests = allUsers.filter((u) => u.status === 'pending_approval');

  const showNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3500);
  };

  // Dedicated Admin Login Handler
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);

    setTimeout(() => {
      const res = HellrixService.verifyAdminLogin(loginIdentifier, loginPassword);
      setLoginLoading(false);
      if (res.success && res.user) {
        HellrixService.setActiveUser(res.user);
        if (onUserChange) onUserChange(res.user);
        else window.location.reload();
      } else {
        setLoginError(res.error || 'Authentication failed.');
      }
    }, 400);
  };

  const handleQuickLogin = (idOrEmail: string, pass: string) => {
    setLoginIdentifier(idOrEmail);
    setLoginPassword(pass);
    const res = HellrixService.verifyAdminLogin(idOrEmail, pass);
    if (res.success && res.user) {
      HellrixService.setActiveUser(res.user);
      if (onUserChange) onUserChange(res.user);
      else window.location.reload();
    } else {
      setLoginError(res.error || 'Authentication failed.');
    }
  };

  // Staff Access Request Submission
  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = HellrixService.submitAccessRequest({
      name: reqName,
      email: reqEmail,
      mobile: reqMobile,
      requestedRole: reqRole,
      reason: reqReason,
      password: reqPassword,
    });
    if (res.success) {
      setReqSubmitted(true);
    } else {
      showNotice(res.error || 'Failed to submit access request.');
    }
  };

  // Staff Approval & Revocation
  const handleApproveStaff = (userId: string, role: UserRole) => {
    const defaultPerms: Permission[] =
      role === 'owner'
        ? [
            'events.view', 'events.create', 'events.edit', 'events.delete',
            'bookings.view', 'bookings.manage',
            'payments.view', 'payments.verify', 'payments.reject', 'payments.reconcile',
            'attendees.view', 'attendees.edit',
            'tickets.view', 'tickets.reissue', 'tickets.revoke',
            'vouchers.view', 'vouchers.reissue', 'vouchers.revoke',
            'staff.view', 'staff.create', 'staff.update', 'staff.disable', 'staff.approve',
            'reports.view', 'reports.export',
            'settings.manage', 'audit.view', 'scan.access',
          ]
        : role === 'payment_manager'
        ? ['payments.view', 'payments.verify', 'payments.reject', 'payments.reconcile', 'bookings.view', 'reports.view']
        : role === 'check_in_staff'
        ? ['scan.access', 'attendees.view']
        : role === 'event_manager'
        ? ['events.view', 'events.edit', 'inventory' as any, 'attendees.view']
        : ['support.manage' as any, 'bookings.view'];

    const res = HellrixService.approveStaffAccess(userId, role, defaultPerms, 'ev_hellrix_001', currentUser);
    if (res.success) {
      showNotice(`Approved ${res.user?.name} as [${role.toUpperCase()}]. Account is now active.`);
    } else {
      showNotice(res.error || 'Approval failed.');
    }
  };

  const handleRejectStaff = (userId: string) => {
    HellrixService.rejectStaffAccess(userId, currentUser, 'Denied by Root Administrator (Uday Kumar)');
    showNotice('Access request was rejected.');
  };

  const handleToggleStaff = (userId: string) => {
    const res = HellrixService.toggleStaffStatus(userId, currentUser);
    if (res.success) {
      showNotice(`Account status changed to ${res.newStatus?.toUpperCase()}`);
    }
  };

  // Payment Actions
  const handleApprovePayment = (paymentId: string) => {
    const res = HellrixService.approvePayment(paymentId, currentUser);
    if (res.success) {
      showNotice('Payment approved & final scannable ticket(s) generated.');
    } else {
      showNotice(res.error || 'Approval failed.');
    }
  };

  const handleRejectPayment = () => {
    if (!rejectionModal.reason.trim()) return;
    const res = HellrixService.rejectPayment(rejectionModal.paymentId, rejectionModal.reason, currentUser);
    setRejectionModal({ open: false, paymentId: '', reason: '' });
    if (res.success) {
      showNotice('Payment rejected and booking marked payment_rejected.');
    }
  };

  // Bank Statement Upload Simulation
  const handleUploadBankStatement = (filePreset: 'HDFC' | 'ICICI') => {
    if (filePreset === 'HDFC') {
      HellrixService.importBankStatement(
        {
          filename: `HDFC_EXPORT_${Date.now().toString().slice(-4)}.CSV`,
          transactions: [
            {
              reference_utr: '824719123456',
              amount: 3499,
              type: 'credit',
              description: 'UPI/824719123456/CR/ALEX MERCER/HDFC',
            },
            {
              reference_utr: `UTR_${Math.floor(100000000000 + Math.random() * 900000000000)}`,
              amount: 999,
              type: 'credit',
              description: 'UPI/CREDIT/TEST_USER_99',
            },
          ],
        },
        currentUser
      );
      showNotice('Imported HDFC statement! Exact matches categorized.');
    } else {
      HellrixService.importBankStatement(
        {
          filename: `ICICI_STATEMENT_${Date.now().toString().slice(-4)}.CSV`,
          transactions: [
            {
              reference_utr: `ICICI_${Math.floor(100000000000 + Math.random() * 900000000000)}`,
              amount: 2499,
              type: 'credit',
              description: 'UPI/CR/NEHA KAPOOR/ICICI',
            },
          ],
        },
        currentUser
      );
      showNotice('Imported ICICI Statement! Bank ledger reconciled.');
    }
  };

  // Bulk Approval Execution
  const handleExecuteBulkApprove = () => {
    const { batchId, paymentIds } = bulkApproveModal;
    const res = HellrixService.bulkApproveReconciledPayments(paymentIds, currentUser, batchId);
    setBulkApproveModal({ open: false, batchId: '', paymentIds: [], totalValue: 0 });
    showNotice(`Bulk approved ${res.approvedCount} payments totaling ₹${res.totalAmount.toLocaleString()}!`);
  };

  // Ticket Operations
  const handleReissueTicket = () => {
    if (!reissueModal.reason.trim()) return;
    const res = HellrixService.reissueTicket(reissueModal.ticketId, currentUser, reissueModal.reason);
    setReissueModal({ open: false, ticketId: '', reason: '' });
    if (res.success && res.newTicket) {
      showNotice(`Ticket reissued! New security token: ${res.newTicket.security_token.slice(-10)}`);
    } else {
      showNotice(res.error || 'Reissue failed.');
    }
  };

  const handleRevokeTicket = (ticketId: string) => {
    if (window.confirm(`Revoke admission credential for pass ${ticketId}?`)) {
      HellrixService.revokeTicket(ticketId, currentUser, 'Revoked by gate operations');
      showNotice(`Pass ${ticketId} revoked.`);
    }
  };

  // CSV Downloads
  const downloadCsv = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotice(`Downloaded ${filename}`);
  };

  // ==========================================
  // VIEW 1: DEDICATED ADMIN & STAFF LOGIN SCREEN
  // Shown when not logged in with operational role
  // ==========================================
  if (!isAuthorizedOperationalUser) {
    return (
      <div className="min-h-screen bg-[#090909] text-[#E5DED3] flex items-center justify-center p-4">
        <div className="max-w-md w-full border-2 border-black bg-[#111111] p-8 shadow-[8px_8px_0px_#000000] space-y-6">
          <div className="text-center border-b border-[#2B2726] pb-6">
            <div className="flex justify-center mb-4">
              <HellrixLogo variant="full" size="md" />
            </div>
            <span className="text-[10px] font-mono-editorial text-[#C8102E] tracking-widest uppercase block mb-1">
              WORLD 2 · RESTRICTED GATEWAY
            </span>
            <h2 className="text-2xl font-display font-black uppercase text-white tracking-wide">
              OPERATIONS CONTROL CENTER
            </h2>
            <p className="text-xs font-mono-editorial text-[#A59D95] mt-1">
              Restricted to authorized staff & administrators only.
            </p>
          </div>

          {/* Quick Access Profile Pills for Rapid Testing */}
          <div className="p-3 bg-[#181818] border border-[#2B2726] space-y-2">
            <span className="text-[10px] font-mono-editorial text-[#77716D] uppercase block">
              QUICK TEST PROFILES (CLICK TO SIGN IN):
            </span>
            <div className="grid grid-cols-1 gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickLogin('udaykumar', 'admin1')}
                className="w-full text-left px-3 py-2 bg-[#222222] hover:bg-[#C8102E] hover:text-white border border-[#35302F] text-xs font-mono-editorial flex items-center justify-between transition-colors cursor-pointer group"
              >
                <div>
                  <strong className="text-white group-hover:text-white">Uday Kumar</strong>
                  <span className="text-[10px] text-[#A59D95] block">udaykumar / admin1</span>
                </div>
                <span className="text-[10px] font-bold text-[#C8102E] group-hover:text-white uppercase bg-black/40 px-2 py-0.5">
                  [ROOT OWNER]
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('karan@hellrix.com', 'admin1')}
                className="w-full text-left px-3 py-2 bg-[#222222] hover:bg-[#2A2A2A] border border-[#35302F] text-xs font-mono-editorial flex items-center justify-between transition-colors cursor-pointer"
              >
                <div>
                  <strong className="text-white">Karan Mehra</strong>
                  <span className="text-[10px] text-[#A59D95] block">karan@hellrix.com / admin1</span>
                </div>
                <span className="text-[10px] font-bold text-amber-400 uppercase bg-black/40 px-2 py-0.5">
                  [PAYMENT MGR]
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('anya@hellrix.com', 'admin1')}
                className="w-full text-left px-3 py-2 bg-[#222222] hover:bg-[#2A2A2A] border border-[#35302F] text-xs font-mono-editorial flex items-center justify-between transition-colors cursor-pointer"
              >
                <div>
                  <strong className="text-white">Anya Sharma</strong>
                  <span className="text-[10px] text-[#A59D95] block">anya@hellrix.com / admin1</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase bg-black/40 px-2 py-0.5">
                  [GATE SCANNER]
                </span>
              </button>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleAdminLogin} className="space-y-4">
            {loginError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500 text-xs font-mono-editorial text-rose-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-mono-editorial text-[#A59D95] uppercase mb-1">
                USERNAME OR WORK EMAIL
              </label>
              <input
                type="text"
                required
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
                placeholder="e.g. udaykumar"
                className="w-full bg-[#181818] border border-[#35302F] focus:border-[#C8102E] text-white text-xs font-mono-editorial p-3 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono-editorial text-[#A59D95] uppercase mb-1">
                PASSWORD
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="admin1"
                  className="w-full bg-[#181818] border border-[#35302F] focus:border-[#C8102E] text-white text-xs font-mono-editorial p-3 focus:outline-none pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-[#77716D] hover:text-white"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3.5 bg-[#C8102E] hover:bg-[#E31B36] text-white font-mono-editorial font-bold text-xs uppercase tracking-wider transition-all duration-150 cursor-pointer border border-black shadow-[3px_3px_0px_#000000]"
            >
              {loginLoading ? 'AUTHENTICATING...' : 'ENTER OPERATIONS PORTAL'}
            </button>
          </form>

          {/* Access Request Prompt */}
          <div className="border-t border-[#2B2726] pt-4 text-center">
            <button
              type="button"
              onClick={() => setRequestModalOpen(true)}
              className="text-xs font-mono-editorial text-[#A59D95] hover:text-white underline cursor-pointer flex items-center justify-center gap-1.5 mx-auto"
            >
              <UserPlus className="w-3.5 h-3.5 text-[#C8102E]" />
              <span>Request Staff / Admin Clearance</span>
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => onNavigateWorld('public')}
              className="text-[11px] font-mono-editorial text-[#77716D] hover:text-white uppercase transition-colors"
            >
              ← Back to Public Website
            </button>
          </div>
        </div>

        {/* Staff Clearance Application Modal */}
        {requestModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="max-w-md w-full border-2 border-black bg-[#111111] p-6 shadow-[8px_8px_0px_#000000] space-y-4 animate-pop-scale">
              <div className="flex items-center justify-between border-b border-[#2B2726] pb-3">
                <h3 className="text-lg font-display uppercase text-white">
                  APPLY FOR STAFF CLEARANCE
                </h3>
                <button
                  onClick={() => {
                    setRequestModalOpen(false);
                    setReqSubmitted(false);
                  }}
                  className="text-[#77716D] hover:text-white"
                >
                  ✕
                </button>
              </div>

              {reqSubmitted ? (
                <div className="p-6 text-center space-y-3 bg-[#181818] border border-emerald-500/40">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                  <h4 className="text-sm font-mono-editorial font-bold text-white uppercase">
                    APPLICATION QUEUED
                  </h4>
                  <p className="text-xs font-mono-editorial text-[#A59D95]">
                    Your request has been queued for manual review. Uday Kumar will evaluate and approve your credentials.
                  </p>
                  <button
                    onClick={() => {
                      setRequestModalOpen(false);
                      setReqSubmitted(false);
                    }}
                    className="px-4 py-2 bg-[#C8102E] text-white text-xs font-mono-editorial font-bold uppercase"
                  >
                    CLOSE
                  </button>
                </div>
              ) : (
                <form onSubmit={handleRequestSubmit} className="space-y-3 text-xs font-mono-editorial">
                  <p className="text-[11px] text-[#A59D95]">
                    All operational clearances must be approved manually by Root Admin Uday Kumar.
                  </p>

                  <div>
                    <label className="block text-[#77716D] uppercase mb-1">FULL NAME</label>
                    <input
                      type="text"
                      required
                      value={reqName}
                      onChange={(e) => setReqName(e.target.value)}
                      placeholder="e.g. Rohit Verma"
                      className="w-full bg-[#181818] border border-[#35302F] p-2.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[#77716D] uppercase mb-1">WORK EMAIL</label>
                    <input
                      type="email"
                      required
                      value={reqEmail}
                      onChange={(e) => setReqEmail(e.target.value)}
                      placeholder="rohit@hellrix.com"
                      className="w-full bg-[#181818] border border-[#35302F] p-2.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[#77716D] uppercase mb-1">MOBILE NUMBER</label>
                    <input
                      type="tel"
                      required
                      value={reqMobile}
                      onChange={(e) => setReqMobile(e.target.value)}
                      placeholder="+91 98444 55667"
                      className="w-full bg-[#181818] border border-[#35302F] p-2.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[#77716D] uppercase mb-1">REQUESTED ROLE</label>
                    <select
                      value={reqRole}
                      onChange={(e) => setReqRole(e.target.value as any)}
                      className="w-full bg-[#181818] border border-[#35302F] p-2.5 text-white"
                    >
                      <option value="check_in_staff">CHECK-IN STAFF (Gate Scanner)</option>
                      <option value="payment_manager">PAYMENT MANAGER (UTR Review & Reconciliation)</option>
                      <option value="event_manager">EVENT MANAGER (Inventory & Attendees)</option>
                      <option value="admin">ADMINISTRATOR (General Operations)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#77716D] uppercase mb-1">JUSTIFICATION / PURPOSE</label>
                    <textarea
                      required
                      rows={2}
                      value={reqReason}
                      onChange={(e) => setReqReason(e.target.value)}
                      placeholder="Explain your operational responsibility..."
                      className="w-full bg-[#181818] border border-[#35302F] p-2.5 text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#C8102E] text-white font-bold uppercase mt-2 border border-black shadow-[3px_3px_0px_#000000]"
                  >
                    SUBMIT TO UDAY KUMAR
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // VIEW 2: AUTHENTICATED CONTROL CENTER (RBAC)
  // ==========================================
  return (
    <div className="min-h-screen bg-[#090909] text-[#E5DED3] flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#0D0D0D] border-r border-[#35302F] flex flex-col justify-between shrink-0">
        <div>
          {/* Brand & Active Workspace */}
          <div className="p-6 border-b border-[#242120]">
            <HellrixLogo variant="full" size="sm" />
            <div className="mt-3 flex items-center justify-between text-[11px] font-mono-editorial">
              <span className="text-[#77716D]">WORKSPACE:</span>
              <span
                className={`font-bold uppercase ${
                  isOwner ? 'text-[#C8102E]' : 'text-amber-400'
                }`}
              >
                [{currentUser.role.toUpperCase()}]
              </span>
            </div>
            <div className="text-[11px] font-mono-editorial text-white truncate mt-0.5">
              {currentUser.name}
            </div>
          </div>

          {/* Navigation Links with Granular Role Filtering */}
          <nav className="p-4 space-y-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full text-left px-3 py-2.5 text-xs font-mono-editorial flex items-center gap-3 transition-colors ${
                activeTab === 'overview'
                  ? 'bg-[#C8102E] text-white font-bold'
                  : 'text-[#A59D95] hover:bg-[#181818] hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>CONTROL CENTER</span>
            </button>

            <button
              onClick={() => setActiveTab('utr_desk')}
              className={`w-full text-left px-3 py-2.5 text-xs font-mono-editorial flex items-center justify-between transition-colors ${
                activeTab === 'utr_desk'
                  ? 'bg-[#C8102E] text-white font-bold'
                  : 'text-[#A59D95] hover:bg-[#181818] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <CreditCard className="w-4 h-4" />
                <span>UTR VERIFICATION</span>
              </div>
              {pendingPayments.length > 0 && (
                <span className="px-1.5 py-0.2 bg-amber-400 text-black text-[10px] font-bold">
                  {pendingPayments.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('bank_recon')}
              className={`w-full text-left px-3 py-2.5 text-xs font-mono-editorial flex items-center gap-3 transition-colors ${
                activeTab === 'bank_recon'
                  ? 'bg-[#C8102E] text-white font-bold'
                  : 'text-[#A59D95] hover:bg-[#181818] hover:text-white'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>BANK RECONCILIATION</span>
            </button>

            <button
              onClick={() => setActiveTab('bookings')}
              className={`w-full text-left px-3 py-2.5 text-xs font-mono-editorial flex items-center gap-3 transition-colors ${
                activeTab === 'bookings'
                  ? 'bg-[#C8102E] text-white font-bold'
                  : 'text-[#A59D95] hover:bg-[#181818] hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>BOOKINGS</span>
            </button>

            <button
              onClick={() => setActiveTab('attendees')}
              className={`w-full text-left px-3 py-2.5 text-xs font-mono-editorial flex items-center gap-3 transition-colors ${
                activeTab === 'attendees'
                  ? 'bg-[#C8102E] text-white font-bold'
                  : 'text-[#A59D95] hover:bg-[#181818] hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>ATTENDEES</span>
            </button>

            <button
              onClick={() => setActiveTab('tickets')}
              className={`w-full text-left px-3 py-2.5 text-xs font-mono-editorial flex items-center gap-3 transition-colors ${
                activeTab === 'tickets'
                  ? 'bg-[#C8102E] text-white font-bold'
                  : 'text-[#A59D95] hover:bg-[#181818] hover:text-white'
              }`}
            >
              <TicketIcon className="w-4 h-4" />
              <span>TICKETS & REISSUE</span>
            </button>

            <button
              onClick={() => setActiveTab('vouchers')}
              className={`w-full text-left px-3 py-2.5 text-xs font-mono-editorial flex items-center gap-3 transition-colors ${
                activeTab === 'vouchers'
                  ? 'bg-[#C8102E] text-white font-bold'
                  : 'text-[#A59D95] hover:bg-[#181818] hover:text-white'
              }`}
            >
              <Coffee className="w-4 h-4" />
              <span>VIP VOUCHERS</span>
            </button>

            {/* OWNER & EVENT MGMT ONLY */}
            {(isOwner || currentUser.role === 'event_manager') && (
              <>
                <div className="pt-3 pb-1 px-3 text-[10px] font-mono-editorial text-[#77716D] uppercase tracking-wider">
                  EVENT & INVENTORY
                </div>

                <button
                  onClick={() => setActiveTab('inventory')}
                  className={`w-full text-left px-3 py-2.5 text-xs font-mono-editorial flex items-center gap-3 transition-colors ${
                    activeTab === 'inventory'
                      ? 'bg-[#C8102E] text-white font-bold'
                      : 'text-[#A59D95] hover:bg-[#181818] hover:text-white'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>PASS INVENTORY</span>
                </button>
              </>
            )}

            {/* OWNER ONLY: STAFF CLEARANCE & SETTINGS */}
            {isOwner && (
              <>
                <div className="pt-3 pb-1 px-3 text-[10px] font-mono-editorial text-[#77716D] uppercase tracking-wider">
                  ROOT OWNER CONTROLS
                </div>

                <button
                  onClick={() => setActiveTab('staff')}
                  className={`w-full text-left px-3 py-2.5 text-xs font-mono-editorial flex items-center justify-between transition-colors ${
                    activeTab === 'staff'
                      ? 'bg-[#C8102E] text-white font-bold'
                      : 'text-[#A59D95] hover:bg-[#181818] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-4 h-4 text-[#C8102E]" />
                    <span>STAFF APPROVALS</span>
                  </div>
                  {pendingStaffRequests.length > 0 && (
                    <span className="px-1.5 py-0.2 bg-[#C8102E] text-white text-[10px] font-bold">
                      {pendingStaffRequests.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('reports')}
                  className={`w-full text-left px-3 py-2.5 text-xs font-mono-editorial flex items-center gap-3 transition-colors ${
                    activeTab === 'reports'
                      ? 'bg-[#C8102E] text-white font-bold'
                      : 'text-[#A59D95] hover:bg-[#181818] hover:text-white'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>REPORTS & EXPORTS</span>
                </button>

                <button
                  onClick={() => setActiveTab('audit')}
                  className={`w-full text-left px-3 py-2.5 text-xs font-mono-editorial flex items-center gap-3 transition-colors ${
                    activeTab === 'audit'
                      ? 'bg-[#C8102E] text-white font-bold'
                      : 'text-[#A59D95] hover:bg-[#181818] hover:text-white'
                  }`}
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>AUDIT TRAIL</span>
                </button>

                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full text-left px-3 py-2.5 text-xs font-mono-editorial flex items-center gap-3 transition-colors ${
                    activeTab === 'settings'
                      ? 'bg-[#C8102E] text-white font-bold'
                      : 'text-[#A59D95] hover:bg-[#181818] hover:text-white'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  <span>SYSTEM SETTINGS</span>
                </button>
              </>
            )}

            <button
              onClick={() => setActiveTab('support')}
              className={`w-full text-left px-3 py-2.5 text-xs font-mono-editorial flex items-center gap-3 transition-colors ${
                activeTab === 'support'
                  ? 'bg-[#C8102E] text-white font-bold'
                  : 'text-[#A59D95] hover:bg-[#181818] hover:text-white'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>SUPPORT TICKETS</span>
            </button>
          </nav>
        </div>

        {/* Scanner Shortcut & Logout */}
        <div className="p-4 border-t border-[#242120] space-y-2">
          <button
            onClick={() => onNavigateWorld('scanner')}
            className="w-full py-2.5 bg-[#141414] hover:bg-[#202020] border border-[#35302F] text-xs font-mono-editorial text-white flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <QrCode className="w-3.5 h-3.5 text-[#C8102E]" />
            <span>LAUNCH GATE SCANNER</span>
          </button>

          <button
            onClick={onLogout}
            className="w-full py-2 bg-transparent hover:bg-rose-950/40 border border-transparent hover:border-rose-800 text-xs font-mono-editorial text-[#A59D95] hover:text-rose-300 flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>SIGN OUT</span>
          </button>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Bar */}
        <header className="h-16 bg-[#0D0D0D] border-b border-[#35302F] px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-[#77716D] absolute left-3 top-3" />
              <input
                type="text"
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                placeholder="Global search: UTR, Booking ID, Customer Name, Ticket..."
                className="w-full bg-[#141414] border border-[#2B2726] focus:border-[#C8102E] text-xs font-mono-editorial pl-9 pr-4 py-2 text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications Button */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 bg-[#141414] border border-[#2B2726] text-[#A59D95] hover:text-white relative cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifs.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#C8102E] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {unreadNotifs.length}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 top-12 w-80 bg-[#111111] border-2 border-black p-4 shadow-[6px_6px_0px_#000000] z-50 animate-pop-scale">
                  <div className="flex items-center justify-between border-b border-[#2B2726] pb-2 mb-3">
                    <span className="text-xs font-mono-editorial font-bold text-white uppercase">
                      SYSTEM ALERTS ({notifications.length})
                    </span>
                    <button
                      onClick={() => setNotificationsOpen(false)}
                      className="text-xs text-[#77716D] hover:text-white"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-2.5 border text-xs font-mono-editorial ${
                          n.read ? 'bg-[#141414] border-[#222222] text-[#77716D]' : 'bg-[#181818] border-[#C8102E]/40 text-white'
                        }`}
                      >
                        <div className="font-bold uppercase text-[11px] text-[#C8102E] mb-0.5">
                          {n.title}
                        </div>
                        <p className="text-[11px] leading-tight text-[#A59D95]">{n.message}</p>
                        <div className="text-[9px] text-[#555] mt-1">
                          {new Date(n.created_at).toLocaleTimeString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Live Gateway Status Indicator */}
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono-editorial px-3 py-1.5 bg-[#141414] border border-[#2B2726]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-white font-bold uppercase">
                GATEWAY: {settings.payment_provider.toUpperCase()}
              </span>
            </div>
          </div>
        </header>

        {/* Action Notice Banner */}
        {actionNotice && (
          <div className="bg-[#C8102E] text-white px-6 py-2.5 text-xs font-mono-editorial font-bold flex items-center justify-between animate-pop-up">
            <span>● {actionNotice}</span>
            <button onClick={() => setActionNotice(null)} className="hover:opacity-80">
              ✕
            </button>
          </div>
        )}

        {/* Tab Content Panels */}
        <main className="p-6 sm:p-8 space-y-8 flex-1">
          {/* ========================================================= */}
          {/* TAB 1: OVERVIEW & LIVE ATTENDANCE DASHBOARD               */}
          {/* ========================================================= */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-pop-up">
              <div>
                <span className="text-xs font-mono-editorial text-[#C8102E] tracking-widest uppercase block mb-1">
                  EXECUTIVE OPERATIONS
                </span>
                <h1 className="text-3xl font-display font-black uppercase text-white tracking-tight">
                  HELLRIX CONTROL CENTER
                </h1>
                <p className="text-xs font-mono-editorial text-[#A59D95]">
                  Authoritative live metrics synchronized across booking engines, bank records, and gate scanner terminals.
                </p>
              </div>

              {/* 4 Primary Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 bg-[#121212] border-2 border-black shadow-[4px_4px_0px_#000000]">
                  <span className="text-[10px] font-mono-editorial text-[#77716D] uppercase block">
                    TOTAL CONFIRMED REVENUE
                  </span>
                  <div className="text-3xl font-display font-black text-white mt-1">
                    ₹{totalRevenue.toLocaleString()}
                  </div>
                  <span className="text-[11px] font-mono-editorial text-emerald-400 mt-1 block">
                    ● {confirmedPayments.length} reconciled payments
                  </span>
                </div>

                <div className="p-5 bg-[#121212] border-2 border-black shadow-[4px_4px_0px_#000000]">
                  <span className="text-[10px] font-mono-editorial text-[#77716D] uppercase block">
                    PENDING UTR AUDITS
                  </span>
                  <div className="text-3xl font-display font-black text-amber-400 mt-1">
                    {pendingPayments.length}
                  </div>
                  <button
                    onClick={() => setActiveTab('utr_desk')}
                    className="text-[11px] font-mono-editorial text-[#C8102E] hover:underline mt-1 block"
                  >
                    Open verification desk →
                  </button>
                </div>

                <div className="p-5 bg-[#121212] border-2 border-black shadow-[4px_4px_0px_#000000]">
                  <span className="text-[10px] font-mono-editorial text-[#77716D] uppercase block">
                    GATE CHECK-IN PROGRESS
                  </span>
                  <div className="text-3xl font-display font-black text-white mt-1">
                    {checkedInCount} / {tickets.length}
                  </div>
                  <div className="w-full bg-[#202020] h-1.5 mt-2">
                    <div
                      className="bg-[#C8102E] h-1.5 transition-all"
                      style={{
                        width: `${tickets.length > 0 ? (checkedInCount / tickets.length) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="p-5 bg-[#121212] border-2 border-black shadow-[4px_4px_0px_#000000]">
                  <span className="text-[10px] font-mono-editorial text-[#77716D] uppercase block">
                    ACTIVE 10-MIN HOLDS
                  </span>
                  <div className="text-3xl font-display font-black text-cyan-400 mt-1">
                    {activeReservations}
                  </div>
                  <span className="text-[11px] font-mono-editorial text-[#77716D] mt-1 block">
                    Authoritative countdown active
                  </span>
                </div>
              </div>

              {/* Pending Approvals Callout (If any exist for Uday Kumar) */}
              {isOwner && pendingStaffRequests.length > 0 && (
                <div className="p-5 bg-[#1A1112] border-2 border-[#C8102E] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-6 h-6 text-[#C8102E] shrink-0" />
                    <div>
                      <div className="text-sm font-mono-editorial font-bold text-white uppercase">
                        {pendingStaffRequests.length} PENDING STAFF ACCESS REQUESTS REQUIRE APPROVAL
                      </div>
                      <p className="text-xs font-mono-editorial text-[#A59D95]">
                        New members have requested operational clearance. Evaluate their submissions.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('staff')}
                    className="px-5 py-2.5 bg-[#C8102E] hover:bg-[#E31B36] text-white text-xs font-mono-editorial font-bold uppercase transition-colors shrink-0"
                  >
                    REVIEW REQUESTS NOW
                  </button>
                </div>
              )}

              {/* Live Event Attendance Progress Bar */}
              <div className="p-6 bg-[#121212] border-2 border-black shadow-[4px_4px_0px_#000000] space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-display uppercase text-white">
                      LIVE EVENT GATE STATUS — THE CONCRETE SILO (MUMBAI)
                    </h3>
                    <p className="text-xs font-mono-editorial text-[#A59D95]">
                      Real-time gate telemetry. Synchronized with mobile terminals in World 3.
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-display font-black text-white">
                      {Math.round(tickets.length > 0 ? (checkedInCount / tickets.length) * 100 : 0)}%
                    </span>
                    <span className="text-[10px] font-mono-editorial text-[#77716D] block">
                      CAPACITY ADMISSION
                    </span>
                  </div>
                </div>

                <div className="w-full bg-[#1E1E1E] h-4 p-0.5 border border-[#333]">
                  <div
                    className="bg-[#C8102E] h-full transition-all duration-500"
                    style={{
                      width: `${tickets.length > 0 ? (checkedInCount / tickets.length) * 100 : 0}%`,
                    }}
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono-editorial pt-2">
                  <div>
                    <span className="text-[#77716D] block">VENUE CAPACITY:</span>
                    <strong className="text-white">250 ATTENDEES</strong>
                  </div>
                  <div>
                    <span className="text-[#77716D] block">CONFIRMED ISSUED:</span>
                    <strong className="text-white">{tickets.length} TICKETS</strong>
                  </div>
                  <div>
                    <span className="text-[#77716D] block">SCANNED INSIDE:</span>
                    <strong className="text-emerald-400">{checkedInCount} ADMITTED</strong>
                  </div>
                  <div>
                    <span className="text-[#77716D] block">REMAINING AT GATE:</span>
                    <strong className="text-amber-400">{tickets.length - checkedInCount} PENDING</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: UTR VERIFICATION DESK                              */}
          {/* ========================================================= */}
          {activeTab === 'utr_desk' && (
            <div className="space-y-6 animate-pop-up">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-mono-editorial text-[#C8102E] tracking-widest uppercase block mb-1">
                    PAYMENT OPERATIONS
                  </span>
                  <h2 className="text-2xl font-display font-black uppercase text-white">
                    UTR VERIFICATION DESK
                  </h2>
                  <p className="text-xs font-mono-editorial text-[#A59D95]">
                    Verify customer banking references against UPI credits before generating scannable tickets.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('bank_recon')}
                    className="px-4 py-2 bg-[#1A1A1A] hover:bg-[#252525] border border-[#333] text-xs font-mono-editorial text-white uppercase flex items-center gap-2 cursor-pointer"
                  >
                    <Database className="w-3.5 h-3.5 text-[#C8102E]" />
                    <span>Auto-Reconcile Statement</span>
                  </button>
                </div>
              </div>

              {/* Payments Table */}
              <div className="border-2 border-black bg-[#121212] overflow-x-auto shadow-[4px_4px_0px_#000000]">
                <table className="w-full text-left text-xs font-mono-editorial">
                  <thead className="bg-[#181818] border-b border-[#292625] text-[#77716D] uppercase">
                    <tr>
                      <th className="p-3.5">BOOKING ID</th>
                      <th className="p-3.5">ATTENDEE</th>
                      <th className="p-3.5">AMOUNT</th>
                      <th className="p-3.5">SUBMITTED UTR</th>
                      <th className="p-3.5">TIME</th>
                      <th className="p-3.5">STATUS</th>
                      <th className="p-3.5 text-right">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#222]">
                    {payments.map((p) => {
                      const isPending = p.status === 'verification_pending';
                      const isApproved = p.status === 'approved';

                      return (
                        <tr key={p.id} className="hover:bg-[#161616] transition-colors">
                          <td className="p-3.5 font-bold text-white">{p.booking_id}</td>
                          <td className="p-3.5 text-[#E5DED3]">
                            <div>{p.payer_account_name || 'Customer'}</div>
                            <span className="text-[10px] text-[#77716D] block">{p.upi_id_used}</span>
                          </td>
                          <td className="p-3.5 font-bold text-white">₹{p.amount.toLocaleString()}</td>
                          <td className="p-3.5">
                            <span className="px-2 py-1 bg-[#1A1A1A] border border-[#333] font-bold text-white tracking-wider">
                              {p.utr_number || 'PENDING'}
                            </span>
                          </td>
                          <td className="p-3.5 text-[#77716D]">
                            {new Date(p.submitted_at || p.created_at).toLocaleTimeString()}
                          </td>
                          <td className="p-3.5">
                            <span
                              className={`px-2 py-0.5 text-[10px] uppercase font-bold ${
                                isApproved
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                  : isPending
                                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                              }`}
                            >
                              {p.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="p-3.5 text-right">
                            {isPending ? (
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleApprovePayment(p.id)}
                                  className="px-3 py-1.5 bg-[#C8102E] hover:bg-[#E31B36] text-white text-[11px] font-bold uppercase cursor-pointer"
                                >
                                  APPROVE
                                </button>
                                <button
                                  onClick={() => setRejectionModal({ open: true, paymentId: p.id, reason: '' })}
                                  className="px-2 py-1.5 bg-[#202020] hover:bg-rose-950 text-[#A59D95] hover:text-rose-300 text-[11px] uppercase cursor-pointer"
                                >
                                  REJECT
                                </button>
                              </div>
                            ) : (
                              <span className="text-[#555] text-[11px]">AUDITED</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: BANK RECONCILIATION & STATEMENT IMPORT (04/05)     */}
          {/* ========================================================= */}
          {activeTab === 'bank_recon' && (
            <div className="space-y-6 animate-pop-up">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-mono-editorial text-[#C8102E] tracking-widest uppercase block mb-1">
                    AUTOMATIC RECONCILIATION
                  </span>
                  <h2 className="text-2xl font-display font-black uppercase text-white">
                    BANK TRANSACTION STATEMENT MATCHER
                  </h2>
                  <p className="text-xs font-mono-editorial text-[#A59D95]">
                    Compare incoming bank credits directly against customer UTR submissions with duplicate protection.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleUploadBankStatement('HDFC')}
                    className="px-3 py-2 bg-[#C8102E] hover:bg-[#E31B36] text-white text-xs font-mono-editorial font-bold uppercase flex items-center gap-1.5 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload HDFC Statement</span>
                  </button>
                  <button
                    onClick={() => handleUploadBankStatement('ICICI')}
                    className="px-3 py-2 bg-[#1C1C1C] hover:bg-[#252525] border border-[#333] text-white text-xs font-mono-editorial uppercase flex items-center gap-1.5 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload ICICI Statement</span>
                  </button>
                </div>
              </div>

              {/* Exact Matches Ready for Bulk Approval */}
              {bankTxs.filter((t) => t.match_status === 'exact_match' && t.matched_payment_id).length > 0 && (
                <div className="p-5 bg-[#141A14] border-2 border-emerald-500/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <div className="text-sm font-mono-editorial font-bold text-white uppercase flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>EXACT MATCHES READY FOR BULK APPROVAL</span>
                    </div>
                    <p className="text-xs font-mono-editorial text-[#A59D95] mt-0.5">
                      Bank credits match submitted customer UTR references & amounts exactly.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const matchedPids = bankTxs
                        .filter((t) => t.match_status === 'exact_match' && t.matched_payment_id)
                        .map((t) => t.matched_payment_id!);
                      const totalVal = bankTxs
                        .filter((t) => t.match_status === 'exact_match')
                        .reduce((acc, t) => acc + t.amount, 0);
                      setBulkApproveModal({
                        open: true,
                        batchId: 'BATCH-2026-LIVE',
                        paymentIds: matchedPids,
                        totalValue: totalVal,
                      });
                    }}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono-editorial font-bold uppercase transition-colors shrink-0"
                  >
                    BULK APPROVE EXACT MATCHES
                  </button>
                </div>
              )}

              {/* Bank Transactions Ledger */}
              <div className="border-2 border-black bg-[#121212] overflow-x-auto shadow-[4px_4px_0px_#000000]">
                <table className="w-full text-left text-xs font-mono-editorial">
                  <thead className="bg-[#181818] border-b border-[#292625] text-[#77716D] uppercase">
                    <tr>
                      <th className="p-3.5">BANK TX ID</th>
                      <th className="p-3.5">UTR REFERENCE</th>
                      <th className="p-3.5">TYPE</th>
                      <th className="p-3.5">AMOUNT</th>
                      <th className="p-3.5">MATCH STATUS</th>
                      <th className="p-3.5">MATCHED BOOKING</th>
                      <th className="p-3.5">SOURCE FILE</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#222]">
                    {bankTxs.map((tx) => (
                      <tr key={tx.id} className="hover:bg-[#161616] transition-colors">
                        <td className="p-3.5 text-[#77716D]">{tx.id}</td>
                        <td className="p-3.5 font-bold text-white tracking-wider">{tx.reference_utr}</td>
                        <td className="p-3.5 uppercase font-bold">
                          <span className={tx.type === 'credit' ? 'text-emerald-400' : 'text-rose-400'}>
                            {tx.type}
                          </span>
                        </td>
                        <td className="p-3.5 font-bold text-white">₹{tx.amount.toLocaleString()}</td>
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 text-[10px] uppercase font-bold ${
                              tx.match_status === 'exact_match'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                : tx.match_status === 'partial_match'
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                                : 'bg-zinc-800 text-zinc-400'
                            }`}
                          >
                            {tx.match_status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="p-3.5 font-bold text-cyan-400">
                          {tx.matched_booking_id || '—'}
                        </td>
                        <td className="p-3.5 text-[#77716D]">{tx.source_file}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 4: STAFF MANAGEMENT & MANUAL APPROVALS (UDAY KUMAR)   */}
          {/* ========================================================= */}
          {activeTab === 'staff' && (
            <div className="space-y-8 animate-pop-up">
              <div>
                <span className="text-xs font-mono-editorial text-[#C8102E] tracking-widest uppercase block mb-1">
                  ROOT CLEARANCE DESK (UDAY KUMAR ONLY)
                </span>
                <h2 className="text-2xl font-display font-black uppercase text-white">
                  STAFF ACCOUNTS & CLEARANCE APPROVALS
                </h2>
                <p className="text-xs font-mono-editorial text-[#A59D95]">
                  Only 2–3 trusted members are permitted access to administrative and gate scanner portals.
                </p>
              </div>

              {/* Pending Approvals Section */}
              <div className="border-2 border-black bg-[#121212] p-6 shadow-[4px_4px_0px_#000000] space-y-4">
                <div className="flex items-center justify-between border-b border-[#242120] pb-3">
                  <h3 className="text-lg font-display uppercase text-white flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-[#C8102E]" />
                    <span>PENDING ACCESS REQUESTS ({pendingStaffRequests.length})</span>
                  </h3>
                  <span className="text-[10px] font-mono-editorial text-[#77716D] uppercase">
                    MANUAL APPROVAL ENFORCED
                  </span>
                </div>

                {pendingStaffRequests.length === 0 ? (
                  <div className="p-8 text-center text-xs font-mono-editorial text-[#77716D]">
                    No access requests pending. All internal accounts are reviewed and authorized.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingStaffRequests.map((req) => (
                      <div
                        key={req.id}
                        className="p-4 bg-[#181818] border border-[#2F2B2A] flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <strong className="text-white text-sm">{req.name}</strong>
                            <span className="text-[10px] font-bold text-amber-400 uppercase bg-black/40 px-2 py-0.5">
                              REQUESTED: [{req.requested_role?.toUpperCase() || req.role.toUpperCase()}]
                            </span>
                          </div>
                          <div className="text-xs font-mono-editorial text-[#A59D95]">
                            {req.email} · {req.mobile}
                          </div>
                          <p className="text-xs font-mono-editorial text-zinc-300 italic">
                            "{req.approval_note || 'Requesting operational access.'}"
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => handleApproveStaff(req.id, req.requested_role || 'check_in_staff')}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono-editorial font-bold uppercase cursor-pointer"
                          >
                            APPROVE ACCESS
                          </button>
                          <button
                            onClick={() => handleRejectStaff(req.id)}
                            className="px-3 py-2 bg-[#252525] hover:bg-rose-950 text-[#A59D95] hover:text-rose-300 text-xs font-mono-editorial uppercase cursor-pointer"
                          >
                            REJECT
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Active Operational Team Roster */}
              <div className="border-2 border-black bg-[#121212] overflow-x-auto shadow-[4px_4px_0px_#000000]">
                <div className="p-4 bg-[#181818] border-b border-[#242120] flex items-center justify-between">
                  <h4 className="text-sm font-display uppercase text-white">
                    APPROVED OPERATIONAL ACCOUNTS
                  </h4>
                  <span className="text-[10px] font-mono-editorial text-emerald-400 uppercase">
                    ACTIVE SESSIONS
                  </span>
                </div>
                <table className="w-full text-left text-xs font-mono-editorial">
                  <thead className="bg-[#181818] border-b border-[#292625] text-[#77716D] uppercase">
                    <tr>
                      <th className="p-3.5">NAME</th>
                      <th className="p-3.5">ROLE</th>
                      <th className="p-3.5">STATUS</th>
                      <th className="p-3.5">ASSIGNED EVENT</th>
                      <th className="p-3.5">LAST LOGIN</th>
                      <th className="p-3.5 text-right">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#222]">
                    {allUsers
                      .filter((u) => u.role !== 'customer')
                      .map((u) => {
                        const isRoot = u.role === 'owner';
                        const isActive = u.status === 'active';

                        return (
                          <tr key={u.id} className="hover:bg-[#161616] transition-colors">
                            <td className="p-3.5 font-bold text-white">
                              {u.name}
                              <span className="text-[10px] text-[#77716D] block font-normal">{u.email}</span>
                            </td>
                            <td className="p-3.5 uppercase font-bold text-white">
                              <span className={isRoot ? 'text-[#C8102E]' : 'text-amber-400'}>
                                [{u.role.toUpperCase()}]
                              </span>
                            </td>
                            <td className="p-3.5">
                              <span
                                className={`px-2 py-0.5 text-[10px] uppercase font-bold ${
                                  isActive
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                                }`}
                              >
                                {u.status || 'ACTIVE'}
                              </span>
                            </td>
                            <td className="p-3.5 text-[#77716D]">
                              {u.assigned_event_id ? 'HELLRIX: UNDERGROUND 001' : 'ALL EVENTS'}
                            </td>
                            <td className="p-3.5 text-[#77716D]">
                              {u.last_login ? new Date(u.last_login).toLocaleTimeString() : 'Recent'}
                            </td>
                            <td className="p-3.5 text-right">
                              {!isRoot ? (
                                <button
                                  onClick={() => handleToggleStaff(u.id)}
                                  className="px-2.5 py-1 text-[11px] font-mono-editorial uppercase border border-[#333] hover:border-[#C8102E] text-white transition-colors"
                                >
                                  {isActive ? 'DISABLE' : 'REACTIVATE'}
                                </button>
                              ) : (
                                <span className="text-[10px] text-[#C8102E] font-bold uppercase">
                                  PROTECTED ROOT
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 5: TICKETS & REISSUE MANAGEMENT                       */}
          {/* ========================================================= */}
          {activeTab === 'tickets' && (
            <div className="space-y-6 animate-pop-up">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-mono-editorial text-[#C8102E] tracking-widest uppercase block mb-1">
                    GATE ADMISSION PASSES
                  </span>
                  <h2 className="text-2xl font-display font-black uppercase text-white">
                    TICKET REGISTRY & REISSUE
                  </h2>
                  <p className="text-xs font-mono-editorial text-[#A59D95]">
                    Cryptographic HMAC tokens issued to verified attendees.
                  </p>
                </div>
              </div>

              <div className="border-2 border-black bg-[#121212] overflow-x-auto shadow-[4px_4px_0px_#000000]">
                <table className="w-full text-left text-xs font-mono-editorial">
                  <thead className="bg-[#181818] border-b border-[#292625] text-[#77716D] uppercase">
                    <tr>
                      <th className="p-3.5">TICKET NUMBER</th>
                      <th className="p-3.5">ATTENDEE</th>
                      <th className="p-3.5">PASS CATEGORY</th>
                      <th className="p-3.5">SECURITY TOKEN</th>
                      <th className="p-3.5">ENTRY STATUS</th>
                      <th className="p-3.5 text-right">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#222]">
                    {tickets.map((t) => (
                      <tr key={t.id} className="hover:bg-[#161616] transition-colors">
                        <td className="p-3.5 font-bold text-white">{t.ticket_number}</td>
                        <td className="p-3.5 text-white">{t.customer_name}</td>
                        <td className="p-3.5 text-[#C8102E] font-bold">{t.pass_name}</td>
                        <td className="p-3.5 text-[#77716D] font-mono text-[11px] truncate max-w-xs">
                          {t.security_token}
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 text-[10px] uppercase font-bold ${
                              t.status === 'used'
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                                : t.status === 'unused'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                            }`}
                          >
                            {t.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-3.5 text-right space-x-2">
                          <button
                            onClick={() => setReissueModal({ open: true, ticketId: t.id, reason: '' })}
                            className="px-2.5 py-1 bg-[#202020] hover:bg-[#303030] text-white text-[11px] uppercase border border-[#333]"
                          >
                            REISSUE
                          </button>
                          {t.status !== 'cancelled' && (
                            <button
                              onClick={() => handleRevokeTicket(t.id)}
                              className="px-2 py-1 bg-transparent hover:bg-rose-950 text-rose-400 text-[11px] uppercase border border-rose-900"
                            >
                              REVOKE
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 6: VIP DIGITAL VOUCHERS                               */}
          {/* ========================================================= */}
          {activeTab === 'vouchers' && (
            <div className="space-y-6 animate-pop-up">
              <div>
                <span className="text-xs font-mono-editorial text-[#C8102E] tracking-widest uppercase block mb-1">
                  SEPARATE BAR ENTITLEMENTS
                </span>
                <h2 className="text-2xl font-display font-black uppercase text-white">
                  VIP DIGITAL VOUCHERS
                </h2>
                <p className="text-xs font-mono-editorial text-[#A59D95]">
                  Distinct tokens for complimentary mezzanine beverages. Kept strictly separate from gate tickets so drink redemption never interferes with event entry.
                </p>
              </div>

              <div className="border-2 border-black bg-[#121212] overflow-x-auto shadow-[4px_4px_0px_#000000]">
                <table className="w-full text-left text-xs font-mono-editorial">
                  <thead className="bg-[#181818] border-b border-[#292625] text-[#77716D] uppercase">
                    <tr>
                      <th className="p-3.5">VOUCHER ID</th>
                      <th className="p-3.5">ASSOCIATED TICKET</th>
                      <th className="p-3.5">PERK / BENEFIT</th>
                      <th className="p-3.5">BAR REDEMPTION CODE</th>
                      <th className="p-3.5">STATUS</th>
                      <th className="p-3.5 text-right">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#222]">
                    {vouchers.map((v) => (
                      <tr key={v.id} className="hover:bg-[#161616] transition-colors">
                        <td className="p-3.5 font-bold text-white">{v.id}</td>
                        <td className="p-3.5 text-cyan-400">{v.ticket_id}</td>
                        <td className="p-3.5 text-white">{v.benefit_title}</td>
                        <td className="p-3.5">
                          <span className="px-2 py-1 bg-[#1A1A1A] border border-[#333] text-white font-mono font-bold">
                            {v.redemption_code}
                          </span>
                        </td>
                        <td className="p-3.5 uppercase font-bold">
                          <span className={v.status === 'redeemed' ? 'text-amber-400' : 'text-emerald-400'}>
                            {v.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          {v.status === 'active' ? (
                            <button
                              onClick={() => {
                                HellrixService.redeemVoucher(v.id, currentUser);
                                showNotice(`Redeemed voucher ${v.id} at mezzanine bar.`);
                              }}
                              className="px-3 py-1.5 bg-[#C8102E] hover:bg-[#E31B36] text-white text-[11px] font-bold uppercase cursor-pointer"
                            >
                              MARK REDEEMED
                            </button>
                          ) : (
                            <span className="text-[#555]">CLAIMED</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 7: REPORTS & ANALYTICS WITH 1-CLICK CSV EXPORT        */}
          {/* ========================================================= */}
          {activeTab === 'reports' && (
            <div className="space-y-6 animate-pop-up">
              <div>
                <span className="text-xs font-mono-editorial text-[#C8102E] tracking-widest uppercase block mb-1">
                  DATA EXTRACTION & AUDIT REPORTING
                </span>
                <h2 className="text-2xl font-display font-black uppercase text-white">
                  REPORTS & CSV EXPORTS
                </h2>
                <p className="text-xs font-mono-editorial text-[#A59D95]">
                  Download authoritative system exports for banking audits, attendee check-in manifests, and transaction logs.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-6 bg-[#121212] border-2 border-black shadow-[4px_4px_0px_#000000] flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-lg font-display uppercase text-white mb-1">
                      BOOKINGS MANIFEST REPORT
                    </h3>
                    <p className="text-xs font-mono-editorial text-[#A59D95]">
                      Export all reservation IDs, customer contacts, pass categories, and payment statuses.
                    </p>
                  </div>
                  <button
                    onClick={() => downloadCsv('HELLRIX_BOOKINGS_MANIFEST.CSV', HellrixService.exportBookingsCsv())}
                    className="w-full py-2.5 bg-[#C8102E] text-white font-mono-editorial font-bold text-xs uppercase flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>EXPORT BOOKINGS (CSV)</span>
                  </button>
                </div>

                <div className="p-6 bg-[#121212] border-2 border-black shadow-[4px_4px_0px_#000000] flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-lg font-display uppercase text-white mb-1">
                      PAYMENTS & UTR LEDGER
                    </h3>
                    <p className="text-xs font-mono-editorial text-[#A59D95]">
                      Export submitted UTR transaction references, verification timestamps, and amounts.
                    </p>
                  </div>
                  <button
                    onClick={() => downloadCsv('HELLRIX_PAYMENTS_LEDGER.CSV', HellrixService.exportPaymentsCsv())}
                    className="w-full py-2.5 bg-[#C8102E] text-white font-mono-editorial font-bold text-xs uppercase flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>EXPORT PAYMENTS (CSV)</span>
                  </button>
                </div>

                <div className="p-6 bg-[#121212] border-2 border-black shadow-[4px_4px_0px_#000000] flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-lg font-display uppercase text-white mb-1">
                      GATE ATTENDEE ROSTER
                    </h3>
                    <p className="text-xs font-mono-editorial text-[#A59D95]">
                      Export verified attendees, admission ticket numbers, check-in timestamps, and gate staff.
                    </p>
                  </div>
                  <button
                    onClick={() => downloadCsv('HELLRIX_GATE_ATTENDEES.CSV', HellrixService.exportAttendeesCsv())}
                    className="w-full py-2.5 bg-[#C8102E] text-white font-mono-editorial font-bold text-xs uppercase flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>EXPORT ATTENDEES (CSV)</span>
                  </button>
                </div>

                <div className="p-6 bg-[#121212] border-2 border-black shadow-[4px_4px_0px_#000000] flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-lg font-display uppercase text-white mb-1">
                      BANK RECONCILIATION AUDIT
                    </h3>
                    <p className="text-xs font-mono-editorial text-[#A59D95]">
                      Export imported bank statement lines and exact matched booking references.
                    </p>
                  </div>
                  <button
                    onClick={() => downloadCsv('HELLRIX_BANK_RECONCILIATION.CSV', HellrixService.exportReconciliationCsv())}
                    className="w-full py-2.5 bg-[#1C1C1C] hover:bg-[#252525] border border-[#333] text-white font-mono-editorial text-xs uppercase flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>EXPORT RECONCILIATION (CSV)</span>
                  </button>
                </div>

                <div className="p-6 bg-[#121212] border-2 border-black shadow-[4px_4px_0px_#000000] flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-lg font-display uppercase text-white mb-1">
                      SECURITY & AUDIT LOGS
                    </h3>
                    <p className="text-xs font-mono-editorial text-[#A59D95]">
                      Export full tamper-evident audit history of staff logins, approvals, and credential reissues.
                    </p>
                  </div>
                  <button
                    onClick={() => downloadCsv('HELLRIX_AUDIT_LOGS.CSV', HellrixService.exportAuditLogsCsv())}
                    className="w-full py-2.5 bg-[#1C1C1C] hover:bg-[#252525] border border-[#333] text-white font-mono-editorial text-xs uppercase flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>EXPORT AUDIT LOG (CSV)</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 8: AUDIT TRAIL LOG                                    */}
          {/* ========================================================= */}
          {activeTab === 'audit' && (
            <div className="space-y-6 animate-pop-up">
              <div>
                <span className="text-xs font-mono-editorial text-[#C8102E] tracking-widest uppercase block mb-1">
                  SECURITY LOGS
                </span>
                <h2 className="text-2xl font-display font-black uppercase text-white">
                  TAMPER-EVIDENT AUDIT TRAIL
                </h2>
                <p className="text-xs font-mono-editorial text-[#A59D95]">
                  Immutable ledger recording every payment approval, rejection, ticket reissue, and staff permission change.
                </p>
              </div>

              <div className="border-2 border-black bg-[#121212] overflow-x-auto shadow-[4px_4px_0px_#000000]">
                <table className="w-full text-left text-xs font-mono-editorial">
                  <thead className="bg-[#181818] border-b border-[#292625] text-[#77716D] uppercase">
                    <tr>
                      <th className="p-3.5">TIMESTAMP</th>
                      <th className="p-3.5">ACTOR</th>
                      <th className="p-3.5">ROLE</th>
                      <th className="p-3.5">ACTION</th>
                      <th className="p-3.5">DETAILS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#222]">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-[#161616] transition-colors">
                        <td className="p-3.5 text-[#77716D] whitespace-nowrap">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                        <td className="p-3.5 font-bold text-white">{log.user_name}</td>
                        <td className="p-3.5 uppercase font-bold text-[#C8102E]">
                          [{log.user_role}]
                        </td>
                        <td className="p-3.5 font-bold text-white">{log.action}</td>
                        <td className="p-3.5 text-[#A59D95] max-w-md">{log.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 9: BOOKINGS DIRECTORY                                 */}
          {/* ========================================================= */}
          {activeTab === 'bookings' && (
            <div className="space-y-6 animate-pop-up">
              <div>
                <span className="text-xs font-mono-editorial text-[#C8102E] tracking-widest uppercase block mb-1">
                  CUSTOMER RESERVATIONS
                </span>
                <h2 className="text-2xl font-display font-black uppercase text-white">
                  BOOKINGS DIRECTORY
                </h2>
              </div>

              <div className="border-2 border-black bg-[#121212] overflow-x-auto shadow-[4px_4px_0px_#000000]">
                <table className="w-full text-left text-xs font-mono-editorial">
                  <thead className="bg-[#181818] border-b border-[#292625] text-[#77716D] uppercase">
                    <tr>
                      <th className="p-3.5">BOOKING ID</th>
                      <th className="p-3.5">CUSTOMER</th>
                      <th className="p-3.5">PASS TYPE</th>
                      <th className="p-3.5">QTY</th>
                      <th className="p-3.5">TOTAL</th>
                      <th className="p-3.5">STATUS</th>
                      <th className="p-3.5">CREATED</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#222]">
                    {bookings.map((b) => (
                      <tr key={b.id} className="hover:bg-[#161616] transition-colors">
                        <td className="p-3.5 font-bold text-white">{b.id}</td>
                        <td className="p-3.5 text-white">
                          {b.customer_name}
                          <span className="text-[10px] text-[#77716D] block">{b.customer_email}</span>
                        </td>
                        <td className="p-3.5 text-[#C8102E] font-bold">{b.pass_type_name}</td>
                        <td className="p-3.5 text-white">{b.quantity}x</td>
                        <td className="p-3.5 font-bold text-white">₹{b.total_amount.toLocaleString()}</td>
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 text-[10px] uppercase font-bold ${
                              b.status === 'confirmed'
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : b.status === 'verification_pending'
                                ? 'bg-amber-500/10 text-amber-400'
                                : b.status === 'reserved'
                                ? 'bg-cyan-500/10 text-cyan-400'
                                : 'bg-rose-500/10 text-rose-400'
                            }`}
                          >
                            {b.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="p-3.5 text-[#77716D]">
                          {new Date(b.created_at).toLocaleTimeString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 10: ATTENDEES LIST                                    */}
          {/* ========================================================= */}
          {activeTab === 'attendees' && (
            <div className="space-y-6 animate-pop-up">
              <div>
                <span className="text-xs font-mono-editorial text-[#C8102E] tracking-widest uppercase block mb-1">
                  GATE MANIFEST
                </span>
                <h2 className="text-2xl font-display font-black uppercase text-white">
                  VERIFIED ATTENDEES ROSTER
                </h2>
              </div>

              <div className="border-2 border-black bg-[#121212] overflow-x-auto shadow-[4px_4px_0px_#000000]">
                <table className="w-full text-left text-xs font-mono-editorial">
                  <thead className="bg-[#181818] border-b border-[#292625] text-[#77716D] uppercase">
                    <tr>
                      <th className="p-3.5">TICKET ID</th>
                      <th className="p-3.5">ATTENDEE NAME</th>
                      <th className="p-3.5">PASS CATEGORY</th>
                      <th className="p-3.5">PHONE</th>
                      <th className="p-3.5">CHECK-IN STATUS</th>
                      <th className="p-3.5">SCAN TIME</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#222]">
                    {tickets.map((t) => (
                      <tr key={t.id} className="hover:bg-[#161616] transition-colors">
                        <td className="p-3.5 font-bold text-white">{t.ticket_number}</td>
                        <td className="p-3.5 text-white">{t.customer_name}</td>
                        <td className="p-3.5 text-[#C8102E] font-bold">{t.pass_name}</td>
                        <td className="p-3.5 text-[#77716D]">{t.customer_phone}</td>
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 text-[10px] uppercase font-bold ${
                              t.status === 'used' ? 'text-amber-400' : 'text-emerald-400'
                            }`}
                          >
                            {t.status === 'used' ? '● CHECKED IN' : '● UNUSED'}
                          </span>
                        </td>
                        <td className="p-3.5 text-[#77716D]">
                          {t.check_in?.timestamp ? new Date(t.check_in.timestamp).toLocaleTimeString() : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 11: PASS INVENTORY & CAPACITY                         */}
          {/* ========================================================= */}
          {activeTab === 'inventory' && (
            <div className="space-y-6 animate-pop-up">
              <div>
                <span className="text-xs font-mono-editorial text-[#C8102E] tracking-widest uppercase block mb-1">
                  CAPACITY CONFIGURATION
                </span>
                <h2 className="text-2xl font-display font-black uppercase text-white">
                  PASS TIERS & INVENTORY ENGINE
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {passTypes.map((pt) => {
                  const inv = HellrixService.getPassInventory(pt.id);
                  return (
                    <div
                      key={pt.id}
                      className="p-6 bg-[#121212] border-2 border-black shadow-[4px_4px_0px_#000000] space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono-editorial font-bold text-[#C8102E]">
                          {pt.tag}
                        </span>
                        <span className="text-sm font-mono-editorial font-black text-white">
                          ₹{pt.price.toLocaleString()}
                        </span>
                      </div>
                      <h3 className="text-xl font-display uppercase text-white">{pt.name}</h3>
                      <div className="space-y-2 border-t border-[#242120] pt-4 text-xs font-mono-editorial">
                        <div className="flex justify-between">
                          <span className="text-[#77716D]">TOTAL ALLOCATION:</span>
                          <strong className="text-white">{pt.capacity} passes</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#77716D]">CONFIRMED SOLD:</span>
                          <strong className="text-emerald-400">{inv.confirmedCount}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#77716D]">ACTIVE 10-MIN HOLDS:</span>
                          <strong className="text-cyan-400">{inv.activeReservationsCount}</strong>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-[#202020]">
                          <span className="text-white font-bold">REMAINING AVAILABLE:</span>
                          <strong className="text-amber-400 font-bold">{inv.availableCount}</strong>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 12: SYSTEM SETTINGS                                   */}
          {/* ========================================================= */}
          {activeTab === 'settings' && (
            <div className="space-y-6 animate-pop-up">
              <div>
                <span className="text-xs font-mono-editorial text-[#C8102E] tracking-widest uppercase block mb-1">
                  PLATFORM INFRASTRUCTURE
                </span>
                <h2 className="text-2xl font-display font-black uppercase text-white">
                  SYSTEM SETTINGS & UPI GATEWAY
                </h2>
                <p className="text-xs font-mono-editorial text-[#A59D95]">
                  Configure payment provider routing and platform parameters.
                </p>
              </div>

              <div className="max-w-2xl border-2 border-black bg-[#121212] p-6 shadow-[4px_4px_0px_#000000] space-y-6">
                <div>
                  <h4 className="text-sm font-mono-editorial font-bold text-white uppercase mb-2">
                    ACTIVE PAYMENT PROVIDER
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        HellrixService.updateSettings({ payment_provider: 'manual_upi' }, currentUser);
                        showNotice('Switched to DIRECT UPI + UTR mode.');
                      }}
                      className={`p-4 border text-left text-xs font-mono-editorial transition-colors cursor-pointer ${
                        settings.payment_provider === 'manual_upi'
                          ? 'border-[#C8102E] bg-[#1A1112] text-white'
                          : 'border-[#333] text-[#A59D95] hover:text-white'
                      }`}
                    >
                      <strong className="block text-white mb-1">DIRECT UPI + UTR (DEFAULT)</strong>
                      <span>Zero gateway transaction fees. Manual operations reconciliation.</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        HellrixService.updateSettings({ payment_provider: 'gateway' }, currentUser);
                        showNotice('Switched to INSTANT PAYMENT GATEWAY mode.');
                      }}
                      className={`p-4 border text-left text-xs font-mono-editorial transition-colors cursor-pointer ${
                        settings.payment_provider === 'gateway'
                          ? 'border-[#C8102E] bg-[#1A1112] text-white'
                          : 'border-[#333] text-[#A59D95] hover:text-white'
                      }`}
                    >
                      <strong className="block text-white mb-1">INSTANT GATEWAY (FUTURE-READY)</strong>
                      <span>Automated webhooks for instant confirmation.</span>
                    </button>
                  </div>
                </div>

                <div className="border-t border-[#222] pt-4 space-y-4 text-xs font-mono-editorial">
                  <div>
                    <label className="block text-[#77716D] uppercase mb-1">CONFIGURED UPI ID</label>
                    <input
                      type="text"
                      defaultValue={settings.upi_id}
                      onChange={(e) => HellrixService.updateSettings({ upi_id: e.target.value }, currentUser)}
                      className="w-full bg-[#181818] border border-[#333] p-3 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[#77716D] uppercase mb-1">BENEFICIARY ACCOUNT NAME</label>
                    <input
                      type="text"
                      defaultValue={settings.upi_receiver_name}
                      onChange={(e) => HellrixService.updateSettings({ upi_receiver_name: e.target.value }, currentUser)}
                      className="w-full bg-[#181818] border border-[#333] p-3 text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 13: SUPPORT TICKETS DESK                              */}
          {/* ========================================================= */}
          {activeTab === 'support' && (
            <div className="space-y-6 animate-pop-up">
              <div>
                <span className="text-xs font-mono-editorial text-[#C8102E] tracking-widest uppercase block mb-1">
                  ATTENDEE INQUIRIES
                </span>
                <h2 className="text-2xl font-display font-black uppercase text-white">
                  SUPPORT REQUESTS DESK
                </h2>
              </div>

              <div className="border-2 border-black bg-[#121212] overflow-x-auto shadow-[4px_4px_0px_#000000]">
                <table className="w-full text-left text-xs font-mono-editorial">
                  <thead className="bg-[#181818] border-b border-[#292625] text-[#77716D] uppercase">
                    <tr>
                      <th className="p-3.5">ID</th>
                      <th className="p-3.5">CUSTOMER</th>
                      <th className="p-3.5">CATEGORY</th>
                      <th className="p-3.5">SUBJECT</th>
                      <th className="p-3.5">STATUS</th>
                      <th className="p-3.5 text-right">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#222]">
                    {supportTickets.map((st) => (
                      <tr key={st.id} className="hover:bg-[#161616] transition-colors">
                        <td className="p-3.5 text-[#77716D]">{st.id}</td>
                        <td className="p-3.5 text-white">
                          {st.name}
                          <span className="text-[10px] text-[#77716D] block">{st.email}</span>
                        </td>
                        <td className="p-3.5 uppercase text-[#C8102E] font-bold">
                          {st.category.replace('_', ' ')}
                        </td>
                        <td className="p-3.5 text-white max-w-xs">{st.subject}</td>
                        <td className="p-3.5 uppercase font-bold text-amber-400">{st.status}</td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => {
                              HellrixService.updateSupportTicket(st.id, { status: 'resolved' }, currentUser);
                              showNotice(`Ticket ${st.id} marked as resolved.`);
                            }}
                            className="px-2.5 py-1 bg-[#1C1C1C] hover:bg-emerald-900 border border-[#333] text-white text-[11px] uppercase cursor-pointer"
                          >
                            RESOLVE
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Rejection Reason Modal */}
      {rejectionModal.open && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full border-2 border-black bg-[#111111] p-6 shadow-[8px_8px_0px_#000000] space-y-4 animate-pop-scale">
            <h3 className="text-lg font-display uppercase text-white">
              REJECT PAYMENT SUBMISSION
            </h3>
            <p className="text-xs font-mono-editorial text-[#A59D95]">
              State the reason for rejecting this UTR. The customer will receive an alert.
            </p>
            <textarea
              rows={3}
              required
              value={rejectionModal.reason}
              onChange={(e) => setRejectionModal({ ...rejectionModal, reason: e.target.value })}
              placeholder="e.g. UTR not found in bank statement, amount mismatch, duplicate reference..."
              className="w-full bg-[#181818] border border-[#333] p-3 text-white text-xs font-mono-editorial"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setRejectionModal({ open: false, paymentId: '', reason: '' })}
                className="px-4 py-2 bg-[#202020] text-white text-xs font-mono-editorial uppercase"
              >
                CANCEL
              </button>
              <button
                onClick={handleRejectPayment}
                className="px-4 py-2 bg-[#C8102E] text-white text-xs font-mono-editorial font-bold uppercase"
              >
                CONFIRM REJECTION
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Reconcile Confirmation Modal */}
      {bulkApproveModal.open && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full border-2 border-black bg-[#111111] p-6 shadow-[8px_8px_0px_#000000] space-y-4 animate-pop-scale">
            <h3 className="text-lg font-display uppercase text-white">
              CONFIRM BULK PAYMENT APPROVAL
            </h3>
            <p className="text-xs font-mono-editorial text-[#A59D95]">
              You are about to approve <strong>{bulkApproveModal.paymentIds.length} payments</strong> totaling{' '}
              <strong className="text-white">₹{bulkApproveModal.totalValue.toLocaleString()}</strong> from bank match.
            </p>
            <div className="p-3 bg-[#181818] border border-emerald-500/30 text-xs font-mono-editorial text-emerald-400">
              ● Cryptographic admission tickets and separate VIP drink vouchers will be generated instantly.
            </div>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setBulkApproveModal({ open: false, batchId: '', paymentIds: [], totalValue: 0 })}
                className="px-4 py-2 bg-[#202020] text-white text-xs font-mono-editorial uppercase"
              >
                CANCEL
              </button>
              <button
                onClick={handleExecuteBulkApprove}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono-editorial font-bold uppercase"
              >
                APPROVE ALL {bulkApproveModal.paymentIds.length} PAYMENTS
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ticket Reissue Modal */}
      {reissueModal.open && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full border-2 border-black bg-[#111111] p-6 shadow-[8px_8px_0px_#000000] space-y-4 animate-pop-scale">
            <h3 className="text-lg font-display uppercase text-white">
              REISSUE ADMISSION PASS
            </h3>
            <p className="text-xs font-mono-editorial text-[#A59D95]">
              Reissuing this pass will immediately invalidate the previous cryptographic security token and QR code to prevent duplicate gate entry.
            </p>
            <textarea
              rows={2}
              required
              value={reissueModal.reason}
              onChange={(e) => setReissueModal({ ...reissueModal, reason: e.target.value })}
              placeholder="State reason for reissue (e.g. attendee email typo, lost device, security precaution)..."
              className="w-full bg-[#181818] border border-[#333] p-3 text-white text-xs font-mono-editorial"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setReissueModal({ open: false, ticketId: '', reason: '' })}
                className="px-4 py-2 bg-[#202020] text-white text-xs font-mono-editorial uppercase"
              >
                CANCEL
              </button>
              <button
                onClick={handleReissueTicket}
                className="px-4 py-2 bg-[#C8102E] text-white text-xs font-mono-editorial font-bold uppercase"
              >
                REISSUE NEW CREDENTIAL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
