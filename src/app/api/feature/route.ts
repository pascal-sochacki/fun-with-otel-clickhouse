import { db } from "~/server/db";
import { type Flag } from "./helperTypes";
import { flags } from "~/server/db/schema";
export async function GET(request: Request) {
  const dbflags = await db.select().from(flags).orderBy(flags.name);
  const flagsRecords: Record<string, Flag> = {};
  for (const iterator of dbflags) {
    flagsRecords[iterator.name] = {
      defaultVariant: iterator.defaultVariant,
      state: iterator.state,
      variants: iterator.variants,
    };
  }
  console.log(flagsRecords);
  return Response.json({
    $schema: "https://flagd.dev/schema/v0/flags.json",
    flags: flagsRecords,
  });
}
