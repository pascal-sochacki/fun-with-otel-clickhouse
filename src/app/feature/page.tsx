import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export default function Page() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Feature-Flags</h2>
        <div className="flex items-center space-x-2">
          <Link href={"feature/new"}>
            <Button>Create new Flag</Button>
          </Link>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-7">
          <CardHeader>
            <CardTitle>Newest Logs</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">Stuff</CardContent>
        </Card>
      </div>
    </div>
  );
}
