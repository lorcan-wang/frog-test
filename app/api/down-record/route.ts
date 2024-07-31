import { getRecords } from "@/lib/record";
import { NextRequest } from "next/server";
import * as XLSX from "xlsx";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const date = searchParams.get("date") || new Date("1970-01-01").toISOString();
  const data = await getRecords(date);
  const sheetData = data?.map((d) => {
    return {
      ...d,
    };
  })!;
  // return new Response(JSON.stringify(data));
  const worksheet = XLSX.utils.json_to_sheet(sheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  const workbookBinary = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "binary",
  });
  const buffer = new ArrayBuffer(workbookBinary.length);
  const view = new Uint8Array(buffer);

  for (let i = 0; i < workbookBinary.length; i++) {
    view[i] = workbookBinary.charCodeAt(i) & 0xff;
  }

  return new Response(buffer, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="aetolia_record.xlsx"',
    },
  });
}
