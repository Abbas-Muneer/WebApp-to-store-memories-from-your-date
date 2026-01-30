import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/home', label: 'Home' },
  { to: '/dates', label: 'Dates' },
  { to: '/upload', label: 'Upload' },
  { to: '/profile', label: 'Profile' }
];

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-10 border-b border-slate-100 bg-vault-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4">
        <div className="text-base font-semibold text-vault-navy md:text-lg">CoupleDateVault</div>
        <div className="flex max-w-full gap-2 overflow-x-auto text-xs md:gap-3 md:text-sm">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-full px-3 py-2 transition md:px-4 ${
                  isActive
                    ? 'bg-vault-navy text-white'
                    : 'bg-white text-slate-600 hover:text-vault-navy'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
