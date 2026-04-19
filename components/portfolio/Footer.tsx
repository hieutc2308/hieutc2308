import { GithubIcon, LinkedinIcon, GmailIcon, NextIcon, TailwindIcon, VercelIcon } from "@/components/ui/icons";

const builtWith = [
  { icon: NextIcon,     label: "Next.js" },
  { icon: TailwindIcon, label: "Tailwind CSS" },
  { icon: VercelIcon,   label: "Vercel" },
];

const socials = [
  { icon: GithubIcon,   href: "https://github.com/hieutc",                 label: "GitHub" },
  { icon: LinkedinIcon, href: "https://www.linkedin.com/in/hieutc2308/",   label: "LinkedIn" },
  { icon: GmailIcon,    href: "mailto:hieutc2308@gmail.com",               label: "Gmail" },
];

const iconBtn = "w-10 h-10 flex items-center justify-center rounded-full border border-zinc-700 text-zinc-400 hover:text-zinc-100 hover:border-zinc-500 transition-all duration-200";

export function Footer() {
  return (
    <footer className="border-t border-zinc-800 pt-12 pb-8 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Main row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10 mb-10">
          {/* Socials */}
          <div className="flex items-center gap-3">
            {socials.map(({ icon: Icon, href, label }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className={iconBtn}>
                <Icon />
              </a>
            ))}
          </div>

          {/* Built with */}
          <div className="flex flex-col gap-2">
            {builtWith.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-sm text-zinc-500">
                <Icon />
                <span>{label}</span>
              </div>
            ))}
          </div>

          {/* Places link */}
          <div className="text-sm text-zinc-600 text-right">
            <a href="/places" className="text-blue-400 hover:text-blue-300 transition-colors">
              Try the AI Places finder →
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-zinc-800/60 pt-6 text-center text-xs text-zinc-600">
          © {new Date().getFullYear()} Tran Chi Hieu. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
