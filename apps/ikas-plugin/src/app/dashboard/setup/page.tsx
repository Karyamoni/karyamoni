import { SetupChecklist } from "@/components/SetupChecklist";
import { db } from "@/lib/db";

export const metadata = { title: "Setup — Karyamoni IKAS Plugin" };

export default async function SetupPage() {
  const merchant = await db.merchant.findFirst();

  let productCount = 0;
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_DEPLOY_URL}/api/ikas/products`,
      { cache: "no-store" }
    );
    if (res.ok) {
      const data = await res.json();
      productCount = data.products?.length ?? 0;
    }
  } catch {
    // ignore
  }

  return (
    <SetupChecklist
      storeName={merchant?.storeName ?? null}
      appInstalled={!!merchant}
      permissionsGranted={!!merchant}
      firstProductSynced={productCount > 0}
    />
  );
}
