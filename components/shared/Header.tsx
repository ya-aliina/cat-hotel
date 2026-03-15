// // 'use client';

// // import { Menu, X } from 'lucide-react';
// // import Image from 'next/image';
// // import Link from 'next/link';
// // import { useState } from 'react';

// // import PawIcon from '@/components/ui/icons/PawIcon';

// // const Header = () => {
// //   const [isOpen, setIsOpen] = useState(false);

// //   const navLinks = [
// //     { title: 'Про нас', href: '/' },
// //     { title: 'Номери', href: '/rooms' },
// //     { title: 'Вхід', href: '' },
// //   ];

// //   const toggleMenu = () => {
// //     setIsOpen(!isOpen);
// //   };

// //   return (
// //     <header className="fixed top-0 left-0 w-full bg-white z-50 shadow-sm border-b border-gray-100 font-sans">
// //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
// //         <div className="flex justify-between items-center h-20">
// //           {/* Логотип */}
// //           <div className="flex-shrink-0 flex items-center cursor-pointer group">
// //             <div className="flex flex-col items-center">
// //               <Link href="/" className="w-12 h-10 relative flex items-center justify-center">
// //                 <Image
// //                   src="/logo.svg"
// //                   alt="logo"
// //                   width={48}
// //                   height={40}
// //                   className="w-full h-full object-contain"
// //                 />
// //               </Link>
// //             </div>
// //           </div>

// //           {/* Desktop navigation */}
// //           <nav className="hidden md:flex items-center space-x-6 lg:space-x-10">
// //             {navLinks.map((link) => {
// //               return (
// //                 <div key={link.title} className="relative group flex items-center">
// //                   <Link
// //                     href={link.href}
// //                     className="relative z-10 block py-2 group-hover:text-[#FF7236] text-[15px] font-medium transition-colors duration-300"
// //                   >
// //                     {link.title}
// //                   </Link>
// //                   <div
// //                     className="absolute z-0 pointer-events-none w-[23px] h-[23px]"
// //                     style={{
// //                       right: '-18px',
// //                       top: '2px',
// //                     }}
// //                   >
// //                     <PawIcon className="w-full h-full text-[#FF7236] opacity-0 transform -rotate-12 scale-90 group-hover:opacity-30 group-hover:rotate-0 group-hover:scale-110 transition-all duration-[600ms] ease-[cubic-bezier(0.175,0.885,0.32,1.275)]" />
// //                   </div>
// //                 </div>
// //               );
// //             })}
// //           </nav>

// //           {/* Мобильная кнопка */}
// //           <div className="md:hidden">
// //             <button
// //               onClick={toggleMenu}
// //               className="p-2 text-[#1A202C] hover:bg-gray-50 rounded-lg transition-colors"
// //             >
// //               {isOpen ? <X size={28} /> : <Menu size={28} />}
// //             </button>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Мобильное меню */}
// //       <div
// //         className={`md:hidden bg-white border-t border-gray-100 transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
// //       >
// //         <div className="px-6 py-6 flex flex-col space-y-4">
// //           {navLinks.map((link) => {
// //             return (
// //               <Link
// //                 key={link.title}
// //                 href={link.href}
// //                 className="flex items-center text-[#1A202C] hover:text-[#FF7236] text-lg font-semibold py-2 transition-colors"
// //                 onClick={() => {
// //                   return setIsOpen(false);
// //                 }}
// //               >
// //                 <span>{link.title}</span>
// //               </Link>
// //             );
// //           })}
// //         </div>
// //       </div>
// //     </header>
// //   );
// // };

// // export default Header;

// 'use client';

// import { Menu, X } from 'lucide-react';
// import Image from 'next/image';
// import Link from 'next/link';
// import { useState } from 'react';

// import PawIcon from '@/components/ui/icons/PawIcon';

// const Header = () => {
//   const [isOpen, setIsOpen] = useState(false);

//   const navLinks = [
//     { title: 'Про нас', href: '/' },
//     { title: 'Номери', href: '/rooms' },
//     { title: 'Вхід', href: '' },
//   ];

//   const toggleMenu = () => {
//     setIsOpen(!isOpen);
//   };

//   return (
//     <header className="fixed top-0 left-0 w-full bg-white z-50 shadow-sm border-b border-gray-100 font-sans">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-20">
//           <div className="flex-shrink-0 flex items-center cursor-pointer group">
//             <Link href="/" className="w-12 h-10 relative flex items-center justify-center">
//               <Image
//                 src="/logo.svg"
//                 alt="logo"
//                 width={48}
//                 height={40}
//                 className="w-full h-full object-contain"
//               />
//             </Link>
//           </div>

//           <nav className="hidden md:flex items-center space-x-6 lg:space-x-10">
//             {navLinks.map((link) => {
//               return (
//                 <div key={link.title} className="relative group flex items-center">
//                   <Link
//                     href={link.href}
//                     className="relative z-10 block py-2 group-hover:text-brand-orange text-[15px] font-medium transition-colors duration-300"
//                   >
//                     {link.title}
//                   </Link>
//                   <div
//                     className="absolute z-0 pointer-events-none w-[23px] h-[23px]"
//                     style={{ right: '-18px', top: '2px' }}
//                   >
//                     <PawIcon className="w-full h-full text-brand-orange opacity-0 transform -rotate-12 scale-90 group-hover:opacity-30 group-hover:rotate-0 group-hover:scale-110 transition-all duration-[600ms] ease-[cubic-bezier(0.175,0.885,0.32,1.275)]" />
//                   </div>
//                 </div>
//               );
//             })}
//           </nav>

//           <div className="md:hidden">
//             <button
//               onClick={toggleMenu}
//               className="p-2 text-[#1A202C] hover:bg-gray-50 rounded-lg transition-colors"
//             >
//               {isOpen ? <X size={28} /> : <Menu size={28} />}
//             </button>
//           </div>
//         </div>
//       </div>

//       <div
//         className={`md:hidden bg-white border-t border-gray-100 transition-all duration-300 ease-in-out overflow-hidden ${
//           isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
//         }`}
//       >
//         <div className="px-6 py-6 flex flex-col space-y-4">
//           {navLinks.map((link) => {
//             return (
//               <Link
//                 key={link.title}
//                 href={link.href}
//                 className="flex items-center text-[#1A202C] hover:text-brand-orange text-lg font-semibold py-2 transition-colors"
//                 onClick={() => {
//                   return setIsOpen(false);
//                 }}
//               >
//                 <span>{link.title}</span>
//               </Link>
//             );
//           })}
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;
'use client';

import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

// Оновлений імпорт
import { PawLink } from '@/components/ui/PawLink';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { title: 'Про нас', href: '/' },
    { title: 'Номери', href: '/rooms' },
    { title: 'Вхід', href: '/login' },
  ];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-white z-50 shadow-sm border-b border-gray-100 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Логотип */}
          <div className="shrink-0 flex items-center cursor-pointer group">
            <Link href="/" className="w-12 h-10 relative flex items-center justify-center">
              <Image
                src="/logo.svg"
                alt="logo"
                width={48}
                height={40}
                className="w-full h-full object-contain"
              />
            </Link>
          </div>

          {/* Desktop навігація */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-10">
            {navLinks.map((link) => {
              return (
                <PawLink key={link.title} href={link.href}>
                  {link.title}
                </PawLink>
              );
            })}
          </nav>

          {/* Мобільна кнопка */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 text-[#1A202C] hover:bg-gray-50 rounded-lg transition-colors"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Мобільне меню */}
      <div
        className={`md:hidden bg-white border-t border-gray-100 transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 py-6 flex flex-col space-y-4">
          {navLinks.map((link) => {
            return (
              <PawLink
                key={link.title}
                href={link.href}
                onClick={() => {
                  return setIsOpen(false);
                }}
                className="w-fit"
              >
                <span className="text-lg font-semibold">{link.title}</span>
              </PawLink>
            );
          })}
        </div>
      </div>
    </header>
  );
};

export default Header;
