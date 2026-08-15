import { Award, Glasses, ShieldCheck, Users } from "lucide-react";
import { SITE } from "@/lib/format";

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-14">
      <h1 className="font-heading text-3xl font-bold">Про {SITE.name}</h1>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        {SITE.name} — салон оптики повного циклу: від діагностики зору до виготовлення готових окулярів.
        Ми пропонуємо оправи та сонцезахисні окуляри провідних брендів, контактні лінзи, аксесуари та
        засоби для догляду, а також консультації лікарів-офтальмологів.
      </p>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        Наша мета — зробити якісну оптику та турботу про зір доступними: уважні консультанти
        допоможуть підібрати оправу під форму обличчя, а лікар — визначити рецепт та порекомендувати
        оптимальний варіант корекції зору.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <div className="flex items-center gap-3 rounded-xl border bg-card p-4">
          <Award className="size-6 text-primary" />
          <div>
            <div className="font-semibold">12+ років</div>
            <div className="text-sm text-muted-foreground">досвіду в оптичній галузі</div>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border bg-card p-4">
          <Glasses className="size-6 text-primary" />
          <div>
            <div className="font-semibold">15 000+</div>
            <div className="text-sm text-muted-foreground">виготовлених окулярів</div>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border bg-card p-4">
          <ShieldCheck className="size-6 text-primary" />
          <div>
            <div className="font-semibold">40+ брендів</div>
            <div className="text-sm text-muted-foreground">офіційна продукція</div>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border bg-card p-4">
          <Users className="size-6 text-primary" />
          <div>
            <div className="font-semibold">6 лікарів</div>
            <div className="text-sm text-muted-foreground">офтальмологів у штаті</div>
          </div>
        </div>
      </div>
    </div>
  );
}
