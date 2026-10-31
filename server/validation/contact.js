import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(254).transform(value => value.toLowerCase()),
  subject: z.string().trim().min(3).max(120),
  message: z.string().trim().min(10).max(2000)
}).strict();

export function formatValidationIssues(issues) {
  return issues.map(({ path, message }) => ({
    field: path.join("."),
    message
  }));
}
