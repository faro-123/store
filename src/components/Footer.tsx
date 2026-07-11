import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-white/60 bg-white/40 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-500">Product</h3>
            <ul className="mt-3 space-y-2">
              <li><Link to="/" className="text-xs font-semibold text-slate-600 transition hover:text-slate-950">About</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-500">Support</h3>
            <ul className="mt-3 space-y-2">
              <li><span className="text-xs font-semibold text-slate-600">GitHub</span></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-slate-100 pt-6 text-center">
          <p className="text-xs font-semibold text-slate-400">&copy; {new Date().getFullYear()} Atelier Store. All rights reserved. Made by faro.</p>
        </div>
      </div>
    </footer>
  );
}
