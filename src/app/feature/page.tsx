"use client";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { FeatureFlagTable } from "~/components/ui/tables";
import { api } from "~/trpc/react";

export default function Page() {
  const featureFlag = api.feature.getAllFeatureFlag.useQuery();
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
          <CardContent className="pt-4">
            <FeatureFlagTable dataset={featureFlag.data ?? []} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
