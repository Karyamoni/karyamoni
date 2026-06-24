import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { getIkasForStore } from "@/lib/ikas-client";
import { print } from "graphql";
import { GET_MERCHANT } from "@/lib/ikas-client/graphql-requests";

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let client;
  try {
    client = await getIkasForStore(user.storeName);
  } catch {
    return NextResponse.json({ error: "No token for store" }, { status: 403 });
  }

  const result = await client.query<{
    getMerchant: { id: string; merchantName: string; email: string; storeName: string };
  }>({ query: print(GET_MERCHANT) });

  if (!result.isSuccess || !result.data) {
    return NextResponse.json(
      { error: result.error ?? "GraphQL error" },
      { status: 502 }
    );
  }

  return NextResponse.json(result.data.getMerchant);
}
