import { AccountGuard } from './_components/AccountGuard';
import { AccountContentSwitcher } from './_components/AccountContentSwitcher';
import { LogoutButton } from './_components/LogoutButton';

export default function AccountSettingsPage() {
  return (
    <AccountGuard>
      <main className="min-h-screen bg-brand-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-24">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-brand-text">Налаштування акаунту</h1>
              <p className="mt-3 text-brand-text-subtle text-[16px]">
                Керуйте особистими даними, паролем та сповіщеннями.
              </p>
            </div>

            <div className="w-full sm:w-auto">
              <LogoutButton />
            </div>
          </div>

          <AccountContentSwitcher />
        </div>
      </main>
    </AccountGuard>
  );
}
