import React, { useState, useEffect } from 'react';
import { User, EventData, PassType } from './types';
import { HellrixService } from './services/store';
import {
  ScrollProgressBar,
  BackToTop,
  CookieBanner,
  PortalSwitchBar,
} from './components/common/UIComponents';
import { CustomCursor } from './components/common/AnimationSuite';
import { ClientHeader, ClientFooter } from './components/client/ClientNavigation';
import { HomePage } from './pages/client/HomePage';
import { EventDetailsPage } from './pages/client/EventDetailsPage';
import { PassesPage } from './pages/client/PassesPage';
import { AboutPage } from './pages/client/AboutPage';
import { LoginPage, RegisterPage, ForgotPasswordPage } from './pages/client/AuthPages';
import {
  CheckoutPage,
  UpiPaymentPage,
  PaymentPendingPage,
  PaymentSuccessPage,
} from './pages/client/CheckoutAndPayment';
import { MyTicketsPage, TicketDetailsPage } from './pages/client/MyTicketsAndDetails';
import { BookingDetailsPage } from './pages/client/BookingDetailsPage';
import { ProfilePage } from './pages/client/ProfilePage';
import { SupportPage, PoliciesPage } from './pages/client/SupportAndPolicies';
import { AdminPortal } from './pages/admin/AdminPortal';
import { ScannerPortal } from './pages/scanner/ScannerPortal';

export default function App() {
  const [currentWorld, setCurrentWorld] = useState<'public' | 'admin' | 'scanner'>('public');
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [pageParams, setPageParams] = useState<any>({});
  const [currentUser, setCurrentUser] = useState<User | null>(() => HellrixService.getLoggedInUser());

  const event = HellrixService.getEvent();
  const passTypes = HellrixService.getPassTypes();

  // Scroll to top on page change
  const navigatePage = (page: string, params: any = {}) => {
    setCurrentPage(page);
    setPageParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUserChange = (user: User | null) => {
    HellrixService.setActiveUser(user);
    setCurrentUser(user);
  };

  const handleLogout = () => {
    handleUserChange(null);
    navigatePage('home');
  };

  return (
    <div className="min-h-screen bg-[#090909] text-[#E5DED3] flex flex-col font-sans selection:bg-[#C8102E] selection:text-white">
      {/* Custom Brutalist Reactive Cursor */}
      <CustomCursor />

      {/* Top Thin Progress Bar */}
      <ScrollProgressBar />

      {/* Operational Portal Switcher (Strictly Hidden from Public Customer Website) */}
      {currentWorld !== 'public' && (
        <PortalSwitchBar
          currentWorld={currentWorld}
          onWorldChange={(world) => {
            setCurrentWorld(world);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          currentUser={currentUser}
          onUserChange={handleUserChange}
        />
      )}

      {/* WORLD 1: PUBLIC CLIENT WEBSITE */}
      {currentWorld === 'public' && (
        <div className="flex-1 flex flex-col">
          <ClientHeader
            currentPage={currentPage}
            onNavigate={navigatePage}
            currentUser={currentUser}
            onLogout={handleLogout}
          />

          <main className="flex-1">
            {currentPage === 'home' && (
              <HomePage
                event={event}
                passTypes={passTypes}
                currentUser={currentUser}
                onNavigate={navigatePage}
              />
            )}

            {currentPage === 'event' && (
              <EventDetailsPage event={event} onNavigate={navigatePage} />
            )}

            {currentPage === 'passes' && (
              <PassesPage
                passTypes={passTypes}
                currentUser={currentUser}
                onNavigate={navigatePage}
              />
            )}

            {currentPage === 'about' && <AboutPage onNavigate={navigatePage} />}

            {currentPage === 'login' && (
              <LoginPage
                onLoginSuccess={(u) => {
                  handleUserChange(u);
                  navigatePage('my-tickets');
                }}
                onNavigate={navigatePage}
                redirectParams={pageParams}
              />
            )}

            {currentPage === 'register' && (
              <RegisterPage
                onRegisterSuccess={(u) => {
                  handleUserChange(u);
                  navigatePage('my-tickets');
                }}
                onNavigate={navigatePage}
              />
            )}

            {currentPage === 'forgot-password' && (
              <ForgotPasswordPage onNavigate={navigatePage} />
            )}

            {currentPage === 'checkout' && (
              <CheckoutPage
                bookingId={pageParams.bookingId || 'HRX-10521'}
                currentUser={currentUser}
                onNavigate={navigatePage}
              />
            )}

            {currentPage === 'upi-payment' && (
              <UpiPaymentPage
                bookingId={pageParams.bookingId || 'HRX-10521'}
                onNavigate={navigatePage}
              />
            )}

            {currentPage === 'payment-pending' && (
              <PaymentPendingPage
                bookingId={pageParams.bookingId || 'HRX-10521'}
                onNavigate={navigatePage}
              />
            )}

            {currentPage === 'payment-success' && (
              <PaymentSuccessPage
                bookingId={pageParams.bookingId || 'HRX-10482'}
                onNavigate={navigatePage}
              />
            )}

            {currentPage === 'my-tickets' && (
              <MyTicketsPage currentUser={currentUser} onNavigate={navigatePage} />
            )}

            {currentPage === 'ticket-details' && (
              <TicketDetailsPage
                ticketId={pageParams.ticketId || 'HRX-VIP-10482'}
                onNavigate={navigatePage}
              />
            )}

            {currentPage === 'booking-details' && (
              <BookingDetailsPage
                bookingId={pageParams.bookingId || 'HRX-10521'}
                currentUser={currentUser}
                onNavigate={navigatePage}
              />
            )}

            {currentPage === 'profile' && (
              <ProfilePage
                currentUser={currentUser}
                onNavigate={navigatePage}
                onLogout={handleLogout}
              />
            )}

            {currentPage === 'support' && (
              <SupportPage
                currentUser={currentUser}
                prefillBookingId={pageParams.bookingId}
                prefillCategory={pageParams.category}
              />
            )}

            {currentPage === 'policies' && <PoliciesPage />}
          </main>

          <ClientFooter onNavigate={navigatePage} onNavigateWorld={setCurrentWorld} />
        </div>
      )}

      {/* WORLD 2: ADMIN & OWNER OPERATIONS PORTAL */}
      {currentWorld === 'admin' && (
        <AdminPortal
          currentUser={currentUser}
          onNavigateWorld={setCurrentWorld}
          onLogout={handleLogout}
          onUserChange={handleUserChange}
        />
      )}

      {/* WORLD 3: DEDICATED SCANNER PORTAL */}
      {currentWorld === 'scanner' && (
        <ScannerPortal
          currentUser={currentUser}
          onNavigateWorld={setCurrentWorld}
          onLogout={handleLogout}
          onUserChange={handleUserChange}
        />
      )}

      {/* Persistent Micro-Interactions */}
      <BackToTop />
      <CookieBanner />
    </div>
  );
}
