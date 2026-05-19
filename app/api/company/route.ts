import { NextResponse } from "next/server";
import { demoCompany } from "@/lib/demo";
import { getCompany, upsertCompany } from "@/lib/store";

export async function GET() {
  const company = await getCompany();
  return NextResponse.json(company);
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const company = await upsertCompany({
    ...demoCompany,
    ...body,
    id: body.id ?? "demo_company",
    baseDealSize: Number(body.baseDealSize ?? demoCompany.baseDealSize)
  });
  return NextResponse.json(company);
}
