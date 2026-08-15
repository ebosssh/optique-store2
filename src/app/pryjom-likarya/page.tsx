import { Clock, Eye, Glasses, Phone, ScanEye, Stethoscope } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { SITE } from "@/lib/format";

const SERVICES = [
  { icon: Eye, title: "Перевірка гостроти зору", desc: "Комп'ютерна та суб'єктивна діагностика зору на сучасному обладнанні." },
  { icon: ScanEye, title: "Підбір контактних лінз", desc: "Індивідуальний підбір лінз та навчання правил користування." },
  { icon: Glasses, title: "Підбір окулярів", desc: "Рекомендації щодо оправи та лінз відповідно до рецепта і способу життя." },
  { icon: Stethoscope, title: "Консультація офтальмолога", desc: "Огляд, консультації з приводу зору у дорослих та дітей." },
];

export default function DoctorAppointmentPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-14 text-center">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
        <Stethoscope className="size-3.5" /> Запис на прийом
      </span>
      <h1 className="mt-4 font-heading text-3xl font-bold md:text-4xl">Запис до лікаря-офтальмолога</h1>
      <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
        Щоб записатися на прийом, зателефонуйте нам за номером нижче — адміністратор підбере
        зручні дату й час та підтвердить запис.
      </p>

      <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl border bg-card p-8">
        <Phone className="size-8 text-primary" />
        <a href={SITE.phoneHref} className="font-heading text-3xl font-bold text-primary hover:underline">
          {SITE.phone}
        </a>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Clock className="size-4" /> {SITE.hours}
        </div>
        <a href={SITE.phoneHref} className={buttonVariants({ size: "lg", className: "mt-2" })}>
          Зателефонувати зараз
        </a>
        <p className="text-xs text-muted-foreground">{SITE.city}, {SITE.address}</p>
      </div>

      <div className="mt-14 grid gap-4 text-left sm:grid-cols-2">
        {SERVICES.map((s) => (
          <div key={s.title} className="flex gap-3 rounded-xl border bg-card p-5">
            <s.icon className="size-6 shrink-0 text-primary" />
            <div>
              <div className="font-medium">{s.title}</div>
              <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
