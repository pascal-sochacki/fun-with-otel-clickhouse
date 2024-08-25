import { z } from "zod";

export const CreateFeatureFlagSchema = z.object({
  name: z.string(),
});
export type CreateFeatureFlagType = z.infer<typeof CreateFeatureFlagSchema>;
