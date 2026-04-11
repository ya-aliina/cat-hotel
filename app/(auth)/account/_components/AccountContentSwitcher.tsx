'use client';

import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { useEffect } from 'react';

import { AccountSidebar, type AccountSidebarSection } from './AccountSidebar';
import { BookingHistorySection } from './BookingHistorySection';
import { CurrentBookingsSection } from './CurrentBookingsSection';
import { NotificationsSection } from './NotificationsSection';
import { ProfileSection } from './ProfileSection';
import { SecuritySection } from './SecuritySection';

export function AccountContentSwitcher() {
  const { data: session } = useSession();
  const [activeSection, setActiveSection] = useState<AccountSidebarSection>('bookings');
  const isOauthUser = Boolean(session?.user?.provider);

  useEffect(() => {
    if (isOauthUser && activeSection === 'security') {
      setActiveSection('profile');
    }
  }, [activeSection, isOauthUser]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] gap-8 items-start">
      <AccountSidebar
        activeSection={activeSection}
        onSelectSection={setActiveSection}
        showSecurity={!isOauthUser}
      />

      <div className="space-y-6">
        {activeSection === 'bookings' && (
          <CurrentBookingsSection
            onOpenHistory={() => {
              setActiveSection('history');
            }}
          />
        )}
        {activeSection === 'history' && <BookingHistorySection />}
        {activeSection === 'profile' && <ProfileSection />}
        {activeSection === 'security' && !isOauthUser && <SecuritySection />}
        {activeSection === 'notifications' && <NotificationsSection />}
      </div>
    </div>
  );
}
