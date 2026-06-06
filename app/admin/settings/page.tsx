import { getSettings } from "@/lib/data";
import { SettingsForm } from "@/components/admin/SettingsForm";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const settings = await getSettings();
  return (
    <div>
      <h1 className="text-xl font-bold">Тохиргоо</h1>
      <p className="mt-1 text-sm text-muted">
        Дэлгүүрийн мэдээлэл — вэб болон чатботод харагдана.
      </p>
      <div className="mt-5">
        <SettingsForm settings={settings} />
      </div>
    </div>
  );
}
