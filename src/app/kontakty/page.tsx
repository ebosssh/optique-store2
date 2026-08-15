import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { SITE } from "@/lib/format";

export default function ContactsPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-14">
      <h1 className="font-heading text-3xl font-bold">Контакти</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="flex items-start gap-3 rounded-xl border bg-card p-5">
          <Phone className="mt-0.5 size-5 text-primary" />
          <div>
            <div className="text-sm text-muted-foreground">Телефон</div>
            <a href={SITE.phoneHref} className="font-medium hover:text-primary">{SITE.phone}</a>
          </div>
        </div>
        <div className="flex items-start gap-3 rounded-xl border bg-card p-5">
          <Mail className="mt-0.5 size-5 text-primary" />
          <div>
            <div className="text-sm text-muted-foreground">Email</div>
            <a href={`mailto:${SITE.email}`} className="font-medium hover:text-primary">{SITE.email}</a>
          </div>
        </div>
        <div className="flex items-start gap-3 rounded-xl border bg-card p-5">
          <MapPin className="mt-0.5 size-5 text-primary" />
          <div>
            <div className="text-sm text-muted-foreground">Адреса салону</div>
            <div className="font-medium">{SITE.city}, {SITE.address}</div>
          </div>
        </div>
        <div className="flex items-start gap-3 rounded-xl border bg-card p-5">
          <Clock className="mt-0.5 size-5 text-primary" />
          <div>
            <div className="text-sm text-muted-foreground">Графік роботи</div>
            <div className="font-medium">{SITE.hours}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
