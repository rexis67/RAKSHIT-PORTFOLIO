import { useState } from "react";
import { Check, Send } from "lucide-react";
import { sendContactMessage, validateContact } from "../services/api.js";

export default function ContactForm({ compact = false }) {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState({ kind: "idle", message: "" });
  const [fieldErrors, setFieldErrors] = useState({});

  function update(event) {
    const { name, value } = event.target;
    setForm(current => ({ ...current, [name]: value }));
    setFieldErrors(current => {
      if (!current[name]) return current;
      const next = { ...current };
      delete next[name];
      return next;
    });
    if (status.kind !== "idle") setStatus({ kind: "idle", message: "" });
  }

  async function submit(event) {
    event.preventDefault();
    const validationErrors = validateContact(form);
    setFieldErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      setStatus({ kind: "error", message: "Please correct the highlighted fields." });
      return;
    }

    setStatus({ kind: "loading", message: "" });
    try {
      const result = await sendContactMessage(form);
      setStatus({ kind: "success", message: result.message });
      setForm({ name: "", email: "", subject: "", message: "" });
      setFieldErrors({});
    } catch (error) {
      setFieldErrors(error.fieldErrors ?? {});
      setStatus({ kind: "error", message: error.message || "Your message could not be sent. Please try again." });
    }
  }

  function fieldProps(name) {
    return {
      id: `contact-${name}`,
      name,
      value: form[name],
      onChange: update,
      "aria-invalid": Boolean(fieldErrors[name]),
      "aria-describedby": fieldErrors[name] ? `contact-${name}-error` : undefined
    };
  }

  return (
    <form className={`contact-form${compact ? " contact-form-compact" : ""}`} onSubmit={submit} noValidate>
      <div className="form-row">
        <div className="form-field">
          <label htmlFor="contact-name">Your name</label>
          <input {...fieldProps("name")} autoComplete="name" required minLength="2" maxLength="80" placeholder="What should we call you?" />
          {fieldErrors.name && <span className="field-error" id="contact-name-error">{fieldErrors.name}</span>}
        </div>
        <div className="form-field">
          <label htmlFor="contact-email">Email address</label>
          <input {...fieldProps("email")} type="email" autoComplete="email" required maxLength="254" placeholder="you@example.com" />
          {fieldErrors.email && <span className="field-error" id="contact-email-error">{fieldErrors.email}</span>}
        </div>
      </div>
      <div className="form-field">
        <label htmlFor="contact-subject">Subject</label>
        <input {...fieldProps("subject")} required minLength="3" maxLength="120" placeholder="What is this about?" />
        {fieldErrors.subject && <span className="field-error" id="contact-subject-error">{fieldErrors.subject}</span>}
      </div>
      <div className="form-field">
        <label htmlFor="contact-message">Your message</label>
        <textarea {...fieldProps("message")} required minLength="10" maxLength="2000" rows="4" placeholder="Tell us a little more…" />
        {fieldErrors.message && <span className="field-error" id="contact-message-error">{fieldErrors.message}</span>}
      </div>
      <div className="form-submit">
        <button className="button button-lime" type="submit" disabled={status.kind === "loading"}>
          {status.kind === "loading" ? "Sending…" : "Send message"}
          {status.kind === "loading" ? <span className="button-spinner" /> : <Send size={14} />}
        </button>
        <span>Submissions are stored in the site database; no email notification is sent. For direct contact, use the email link on this page.</span>
      </div>
      {status.kind === "error" && <p className="form-feedback error" role="alert">{status.message}</p>}
      {status.kind === "success" && (
        <p className="form-feedback success" role="status">
          <Check size={16} />
          {status.message}
        </p>
      )}
    </form>
  );
}
