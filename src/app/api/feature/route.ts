import { type Flag } from "./helperTypes";
export async function GET(request: Request) {
  const flags: Record<string, Flag> = {};
  flags["new-message"] = {
    state: "ENABLED",
    variants: {
      on: true,
      off: false,
    },
    defaultVariant: "on",
  };
  return Response.json({
    $schema: "https://flagd.dev/schema/v0/flags.json",
    flags: flags,
  });
}
