import { siFacebook, siInstagram, siLine, siThreads, siTiktok, siX } from "simple-icons";
import { organizationContact } from "@/content/static/organization";

const icons = {
  Facebook: siFacebook,
  Instagram: siInstagram,
  TikTok: siTiktok,
  LINE: siLine,
  X: siX,
  Threads: siThreads,
} satisfies Record<(typeof organizationContact.socials)[number]["label"], typeof siFacebook>;

export function SocialLinks({ className }: { className: string }) {
  return (
    <ul className={className} aria-label="ช่องทางสื่อสังคมออนไลน์">
      {organizationContact.socials.map((social) => {
        const icon = icons[social.label];
        return (
          <li key={social.label}>
            <a
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`CHNS บน ${social.label} (เปิดแท็บใหม่)`}
              title={social.label}
              style={{ color: `#${icon.hex}` }}
            >
              <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true" focusable="false">
                <path d={icon.path} />
              </svg>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
