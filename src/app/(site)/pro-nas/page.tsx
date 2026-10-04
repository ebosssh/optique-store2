import { Activity, Award, Glasses, Monitor, ScanEye } from "lucide-react";
import { SITE } from "@/lib/format";

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-14">
      <h1 className="font-heading text-3xl font-bold">Про {SITE.name}</h1>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        {SITE.name} працює в оптичній сфері понад 30 років. Ми допомагаємо підібрати контактні
        лінзи та окуляри, проводимо комп&apos;ютерну діагностику зору та апаратне лікування.
      </p>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        Наша мета — зробити якісну оптику та турботу про зір доступними: уважні консультанти
        допоможуть підібрати оправу під форму обличчя, а лікар — визначити рецепт та порекомендувати
        оптимальний варіант корекції зору.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <div className="flex items-center gap-3 rounded-xl border bg-card p-4 sm:col-span-2">
          <Award className="size-6 text-primary" />
          <div>
            <div className="font-semibold">30 років</div>
            <div className="text-sm text-muted-foreground">у оптичній сфері</div>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border bg-card p-4">
          <ScanEye className="size-6 text-primary" />
          <div className="text-sm font-medium">Підбір контактних лінз</div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border bg-card p-4">
          <Glasses className="size-6 text-primary" />
          <div className="text-sm font-medium">Підбір окулярів</div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border bg-card p-4">
          <Monitor className="size-6 text-primary" />
          <div className="text-sm font-medium">Комп&apos;ютерна діагностика зору</div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border bg-card p-4">
          <Activity className="size-6 text-primary" />
          <div className="text-sm font-medium">Апаратне лікування</div>
        </div>
      </div>
    </div>
  );
}
