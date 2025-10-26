"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CreateCampaignLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (isPending) return;
    const role = session?.user?.role;
    if (role && role !== "athlete") {
      router.replace("/dash-donors");
    }
  }, [session, isPending, router]);

  return <>{children}</>;
}
