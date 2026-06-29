import Link from "next/link";

const FOOTER_LINKS = {
  Platform: [
    { label: "Home", href: "/" },
    { label: "Write", href: "/write" },
    { label: "Tools", href: "/tools" },
    { label: "Resources", href: "/resources" },
  ],
  Categories: [
    { label: "Technology", href: "/?cat=Technology" },
    { label: "Artificial Intelligence", href: "/?cat=Artificial+Intelligence" },
    { label: "Finance", href: "/?cat=Finance" },
    { label: "Science", href: "/?cat=Science" },
    { label: "Health", href: "/?cat=Health" },
    { label: "Culture", href: "/?cat=Culture" },
  ],
  Tools: [
    { label: "ATS Resume Checker", href: "/tools/ats-checker" },
    { label: "Resume Builder", href: "/tools/resume-builder" },
    { label: "Reading Speed Test", href: "/tools/reading-speed" },
  ],
  Company: [
    { label: "About NextZeni", href: "/about" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Contact", href: "/contact" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[#111] text-white mt-20">
      {/* Newsletter strip */}
      <div className="border-b border-white/10">
        <div className="max-w-[1280px] mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-bold text-lg mb-1">Stay informed. Stay ahead.</h3>
            <p className="text-sm text-white/50">
              Get the best articles from NextZeni delivered to your inbox weekly.
            </p>
          </div>
          <form
            className="flex gap-2 w-full md:w-auto"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 md:w-72 px-4 py-2.5 rounded-full text-sm bg-white/10 border border-white/20 text-white placeholder:text-white/30 outline-none focus:border-accent transition-colors"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-accent text-white rounded-full text-sm font-medium hover:bg-accent/90 transition-colors flex-shrink-0"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Links grid */}
      <div className="max-w-[1280px] mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="text-2xl font-extrabold tracking-tighter flex items-baseline mb-3">
              <span className="font-light text-white/50">Next</span>
              <span className="text-white">Zeni</span>
            </Link>
            <p className="text-sm text-white/40 leading-relaxed">
              A platform where people share knowledge, grow audience, and earn from their expertise.
            </p>
          </div>

          {/* Link groups */}
          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <div key={group}>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-4">
                {group}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/50 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/30">
            © 2026 NextZeni. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-white/30">
            <span>Built for curious minds</span>
            <span>·</span>
            <Link href="/privacy" className="hover:text-white/60 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white/60 transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
