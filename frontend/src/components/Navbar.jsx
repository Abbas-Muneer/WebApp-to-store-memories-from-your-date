import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/home',    label: 'Home' },
  { to: '/dates',   label: 'Dates' },
  { to: '/upload',  label: 'Upload' },
  { to: '/profile', label: 'Profile' }
];

export default function Navbar() {
  return (
    <nav
      className="sticky top-0 z-10 border-b border-vault-accent/30"
      style={{
        background: 'rgba(255, 245, 249, 0.85)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        paddingTop: 'env(safe-area-inset-top, 0px)',
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <div className="text-base font-bold text-vault-navy md:text-lg">
          AMNA ❤️
        </div>
        <div className="flex max-w-full gap-1.5 overflow-x-auto text-xs md:gap-2 md:text-sm">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-full px-3 py-2 font-medium transition md:px-4 ${
                  isActive
                    ? 'bg-gradient-to-r from-vault-pink to-vault-lavender text-white shadow-soft'
                    : 'bg-white/60 text-vault-muted hover:bg-vault-accent/20 hover:text-vault-navy'
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
