const FIELD_NAMES = ["name", "email", "subject", "message"];
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");

function apiUrl(path) {
  return `${API_BASE_URL}/api${path}`;
}

export class ContactRequestError extends Error {
  constructor(message, fieldErrors = {}) {
    super(message);
    this.name = "ContactRequestError";
    this.fieldErrors = fieldErrors;
  }
}

export class ProjectRequestError extends Error {
  constructor(message, code = "PROJECT_REQUEST_FAILED") {
    super(message);
    this.name = "ProjectRequestError";
    this.code = code;
  }
}

async function requestJson(url, options, unavailableMessage, ErrorType) {
  let response;
  try {
    response = await fetch(url, options);
  } catch {
    throw new ErrorType(unavailableMessage);
  }

  let result;
  try {
    result = await response.json();
  } catch {
    throw new ErrorType("The server returned an unexpected response. Please try again.");
  }

  return { response, result };
}

export async function sendContactMessage(payload) {
  const { response, result } = await requestJson(
    apiUrl("/contact"),
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    },
    "We couldn't reach the server. Please try again or email me directly.",
    ContactRequestError
  );

  if (!response.ok) {
    const body = result && typeof result === "object" ? result : {};
    const fieldErrors = Object.fromEntries(
      (Array.isArray(body.details) ? body.details : [])
        .filter(issue => FIELD_NAMES.includes(issue.field) && typeof issue.message === "string")
        .map(issue => [issue.field, issue.message])
    );
    throw new ContactRequestError(
      body.error || "Your message could not be sent. Please try again.",
      fieldErrors
    );
  }

  if (!result || typeof result.message !== "string" || !result.message.trim()) {
    throw new ContactRequestError(
      "The server returned an unexpected response. Please try again."
    );
  }

  return result;
}

export async function getProjects() {
  const { response, result } = await requestJson(
    apiUrl("/projects"),
    undefined,
    "We couldn't load projects. Please check your connection and try again.",
    ProjectRequestError
  );

  if (!response.ok) {
    throw new ProjectRequestError(
      result?.error || "Projects could not be loaded. Please try again.",
      result?.code
    );
  }
  if (!Array.isArray(result)) {
    throw new ProjectRequestError("The server returned an unexpected projects response.");
  }
  return result;
}

export async function getProject(slug) {
  const { response, result } = await requestJson(
    apiUrl(`/projects/${encodeURIComponent(slug)}`),
    undefined,
    "We couldn't load this project. Please check your connection and try again.",
    ProjectRequestError
  );

  if (!response.ok) {
    throw new ProjectRequestError(
      result?.error || "This project could not be loaded. Please try again.",
      result?.code
    );
  }
  if (!result || result.slug !== slug) {
    throw new ProjectRequestError("The server returned an unexpected project response.");
  }
  return result;
}

export function validateContact(values) {
  const errors = {};
  const name = values.name.trim();
  const email = values.email.trim();
  const subject = values.subject.trim();
  const message = values.message.trim();

  if (name.length < 2) errors.name = "Enter at least 2 characters.";
  else if (name.length > 80) errors.name = "Use 80 characters or fewer.";

  if (!email) errors.email = "Enter your email address.";
  else if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (subject.length < 3) errors.subject = "Enter at least 3 characters.";
  else if (subject.length > 120) errors.subject = "Use 120 characters or fewer.";

  if (message.length < 10) errors.message = "Enter at least 10 characters.";
  else if (message.length > 2000) errors.message = "Use 2000 characters or fewer.";

  return errors;
}
