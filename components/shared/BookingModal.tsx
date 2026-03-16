'use client';

import Image from 'next/image';

import { Dialog, DialogContent, DialogFooter } from '@/components/ui/dialog';
import { PawButton } from '@/components/ui/PawButton';

export type BookingFormState = {
  name: string;
  pet: string;
  phone: string;
  email: string;
  dateFrom: string;
  dateTo: string;
};

export type BookingModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookingForm: BookingFormState;
  onBookingChange: (field: keyof BookingFormState, value: string) => void;
  onSubmit: (event: React.FormEvent) => void;
  success?: boolean;
  onSuccessClose?: () => void;
};

export function BookingModal({
  open,
  onOpenChange,
  bookingForm,
  onBookingChange,
  onSubmit,
  success = false,
  onSuccessClose,
}: BookingModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 bg-transparent shadow-none ring-0">
        <div className="max-w-7xl w-full flex justify-center relative z-10">
          <div className="w-full max-w-140 bg-white rounded-[30px] shadow-xl p-8 md:p-12 relative overflow-hidden transition-all duration-500">
            <div className="absolute -top-4 -left-4 w-32 h-32 pointer-events-none">
              <Image
                src="/paw.svg"
                alt=""
                width={128}
                height={128}
                className="object-contain rotate-135"
              />
            </div>

            {success ? (
              <div className="text-center">
                <h1 className="text-[28px] font-bold text-[#1A202C]">Дякуємо за заявку!</h1>
                <p className="text-base text-muted-foreground mt-2">
                  Ми зв’яжемося з вами найближчим часом
                </p>

                <div className="mt-10 flex justify-center">
                  <PawButton
                    variant="accent"
                    className="min-w-48 bg-brand-orange text-white"
                    onClick={onSuccessClose}
                  >
                    Ок
                  </PawButton>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-10 text-center">
                  <h1 className="text-[28px] font-bold text-[#1A202C]">Забронювати номер</h1>
                </div>

                <form onSubmit={onSubmit} className="space-y-5">
                  <input
                    value={bookingForm.name}
                    onChange={(e) => {
                      return onBookingChange('name', e.target.value);
                    }}
                    type="text"
                    placeholder="Ваше ім'я"
                    className="w-full h-13 px-8 rounded-full border border-gray-200 focus:border-brand-yellow focus:outline-none text-[16px]"
                  />
                  <input
                    value={bookingForm.pet}
                    onChange={(e) => {
                      return onBookingChange('pet', e.target.value);
                    }}
                    type="text"
                    placeholder="Ім'я Питомця"
                    className="w-full h-13 px-8 rounded-full border border-gray-200 focus:border-brand-yellow focus:outline-none text-[16px]"
                  />
                  <input
                    value={bookingForm.phone}
                    onChange={(e) => {
                      return onBookingChange('phone', e.target.value);
                    }}
                    type="tel"
                    placeholder="Телефон"
                    className="w-full h-13 px-8 rounded-full border border-gray-200 focus:border-brand-yellow focus:outline-none text-[16px]"
                  />
                  <input
                    value={bookingForm.email}
                    onChange={(e) => {
                      return onBookingChange('email', e.target.value);
                    }}
                    type="email"
                    placeholder="E-mail"
                    className="w-full h-13 px-8 rounded-full border border-gray-200 focus:border-brand-yellow focus:outline-none text-[16px]"
                  />

                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <label className="flex items-center gap-2 text-sm">
                      <span>Дата заїзду</span>
                      <input
                        value={bookingForm.dateFrom}
                        onChange={(e) => {
                          return onBookingChange('dateFrom', e.target.value);
                        }}
                        type="date"
                        className="w-full sm:w-auto h-13 px-4 rounded-full border border-gray-200 focus:border-brand-yellow focus:outline-none text-[16px]"
                      />
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <span>по</span>
                      <input
                        value={bookingForm.dateTo}
                        onChange={(e) => {
                          return onBookingChange('dateTo', e.target.value);
                        }}
                        type="date"
                        className="w-full sm:w-auto h-13 px-4 rounded-full border border-gray-200 focus:border-brand-yellow focus:outline-none text-[16px]"
                      />
                    </label>
                  </div>

                  <DialogFooter className="flex-col items-center justify-center sm:flex-row sm:justify-center">
                    <PawButton
                      type="submit"
                      variant="accent"
                      className="min-w-48 bg-brand-orange text-white"
                    >
                      Відправити заявку
                    </PawButton>
                  </DialogFooter>
                </form>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
