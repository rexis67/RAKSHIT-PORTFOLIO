import { contactSchema, formatValidationIssues } from "../validation/contact.js";

export function createContactController(contactRepository) {
  return async function submitContact(req, res) {
    const parsed = contactSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: "Please check the form fields and try again.",
        code: "VALIDATION_ERROR",
        details: formatValidationIssues(parsed.error.issues)
      });
    }

    const receipt = await contactRepository.create(parsed.data);
    return res.status(201).json({
      message: "Thanks for reaching out. Your message has been received.",
      id: receipt.id
    });
  };
}
