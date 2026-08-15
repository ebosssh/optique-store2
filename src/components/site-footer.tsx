import Link from "next/link";
import { Glasses, Mail, MapPin, Phone, Share2 } from "lucide-react";
import { SITE } from "@/lib/format";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t bg-secondary/40">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" className="flex items-center gap-2 font-heading text-lg font-bold text-primary">
            <Glasses className="size-5" />
            {SITE.name}
          </Link>
          <p className="mt-3 text-sm text-muted-foreground">
            Салон оптики: окуляри, контактні лінзи, аксесуари та запис на прийом до лікаря-офтальмолога.
          </p>
          <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex text-muted-foreground hover:text-primary">
            <Share2 className="size-5" />
          </a>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Каталог</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link href="/catalog/opravy" className="hover:text-primary">Оправи для зору</Link></li>
            <li><Link href="/catalog/soncezahysni" className="hover:text-primary">Сонцезахисні окуляри</Link></li>
            <li><Link href="/catalog/linzy" className="hover:text-primary">Контактні лінзи</Link></li>
            <li><Link href="/catalog/aksesuary" className="hover:text-primary">Аксесуари</Link></li>
            <li><Link href="/catalog/doglyad" className="hover:text-primary">Засоби для догляду</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Інформація</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link href="/pryjom-likarya" className="hover:text-primary">Запис до лікаря</Link></li>
            <li><Link href="/pro-nas" className="hover:text-primary">Про нас</Link></li>
            <li><Link href="/dostavka-oplata" className="hover:text-primary">Доставка та оплата</Link></li>
            <li><Link href="/kontakty" className="hover:text-primary">Контакти</Link></li>
            <li><Link href="/polityka-konfidentsijnosti" className="hover:text-primary">Політика конфіденційності</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Контакти</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><Phone className="size-4" /> <a href={SITE.phoneHref} className="hover:text-primary">{SITE.phone}</a></li>
            <li className="flex items-center gap-2"><Mail className="size-4" /> <a href={`mailto:${SITE.email}`} className="hover:text-primary">{SITE.email}</a></li>
            <li className="flex items-center gap-2"><MapPin className="size-4" /> {SITE.city}, {SITE.address}</li>
          </ul>
        </div>
      </div>
      <div className="border-t py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {SITE.name}. Усі права захищено. Демонстраційний сайт.
      </div>
    </footer>
  );
}
