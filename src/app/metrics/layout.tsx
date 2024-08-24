import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerAuthSession();
  if (session == null) {
    redirect("/");
  } else {
    return <>{children}</>;
  }
}
