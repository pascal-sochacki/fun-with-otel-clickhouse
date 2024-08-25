"use client";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import {
  CreateFeatureFlagSchema,
  type CreateFeatureFlagType,
} from "~/server/api/routers/types";
import { api } from "~/trpc/react";

export default function Page() {
  const form = useForm<CreateFeatureFlagType>({
    resolver: zodResolver(CreateFeatureFlagSchema),
    defaultValues: {},
  });
  const mutate = api.feature.createFeatureFlag.useMutation();

  function onSubmit(values: CreateFeatureFlagType) {
    mutate.mutate(values);
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-7">
          <CardHeader>
            <CardTitle>Create new Feature-Flag</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormDescription>
                        This is your feature flag name.
                      </FormDescription>
                      <FormControl>
                        <Input
                          placeholder="example-feature-flag-name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Submit</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
