import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App.jsx";

function renderApp(path = "/") {
  return render(<MemoryRouter initialEntries={[path]}><App /></MemoryRouter>);
}

function stubFetch(handler = () => Promise.resolve({
  ok: true,
  json: async () => ({ message: "Message received." })
})) {
  vi.stubGlobal("fetch", vi.fn(handler));
}

function fillContactForm() {
  fireEvent.change(screen.getByLabelText("Your name"), { target: { value: "Jamie Doe" } });
  fireEvent.change(screen.getByLabelText("Email address"), { target: { value: "jamie@example.com" } });
  fireEvent.change(screen.getByLabelText("Subject"), { target: { value: "Hello there" } });
  fireEvent.change(screen.getByLabelText("Your message"), { target: { value: "I would love to chat about your work." } });
}

describe("portfolio", () => {
  beforeEach(() => {
    stubFetch();
  });

  it("renders the hero, skills, projects, and journey sections", () => {
    renderApp();
    expect(screen.getByRole("heading", { level: 1, name: "Rakshit Thakur" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Rakshit Thakur home" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("heading", { name: /things i.m learning/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /built to be useful/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /learning by doing/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /curiosity is part/i })).toBeInTheDocument();
    expect(screen.getAllByText("CivicGuard").length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: /view civicguard case study/i })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /rakshit wearing a blue shirt/i })).toHaveAttribute(
      "src",
      "/images/rakshit-portrait-cutout.webp"
    );
    expect(screen.getByLabelText("Main navigation")).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "About" })[0]).toHaveAttribute("href", "/about");
    expect(screen.getAllByRole("link", { name: /github/i }).length).toBeGreaterThan(0);
  });

  it("renders the about page without school, class, or address details", () => {
    renderApp("/about");
    expect(screen.getByRole("heading", { level: 1, name: /curious by nature/i })).toBeInTheDocument();
    expect(screen.getByText("PW Data Analyst course")).toBeInTheDocument();
    expect(screen.getAllByText(/full-stack & data/i).length).toBeGreaterThan(0);

    const text = document.body.textContent;
    expect(text).not.toMatch(/DAV/i);
    expect(text).not.toMatch(/Narela/i);
    expect(text).not.toMatch(/Delhi/i);
    expect(text).not.toMatch(/Class IX/i);
    expect(text).not.toMatch(/IX-A/i);
  });

  it("renders a project case study", () => {
    renderApp("/projects/civicguard");
    expect(screen.getByRole("heading", { level: 1, name: "CivicGuard" })).toBeInTheDocument();
    expect(screen.getAllByText(/Gemini-assisted triage/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/JWT authentication/i).length).toBeGreaterThan(0);
    expect(document.title).toBe("CivicGuard — Rakshit Thakur");
    expect(screen.getByRole("link", { name: /view source/i })).toHaveAttribute(
      "href",
      "https://github.com/rexis67/civicguard"
    );
    expect(screen.getByRole("link", { name: /visit hosted demo/i })).toHaveAttribute(
      "href",
      "https://civicguard-o1ik.onrender.com/"
    );
    expect(screen.getByText(/availability depends on the external service/i)).toBeInTheDocument();
    expect(screen.getByText(/illustrative interface preview, not a screenshot/i)).toBeInTheDocument();
  });

  it("shows a project unavailable state for an unknown slug", () => {
    renderApp("/projects/not-a-project");
    expect(screen.getByRole("heading", { name: /that case study/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /back to all projects/i })).toHaveAttribute("href", "/projects");
  });

  it("shows a custom not found page", () => {
    renderApp("/somewhere-else");
    expect(screen.getByRole("heading", { name: /took a wrong turn/i })).toBeInTheDocument();
    expect(document.title).toBe("Page not found — Rakshit Thakur");
  });

  it("submits a contact message and announces success", async () => {
    renderApp("/contact");
    fillContactForm();
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("Message received."));
    expect(fetch).toHaveBeenCalledWith("/api/contact", expect.objectContaining({ method: "POST" }));
  });

  it("disables the submit button until the request completes", async () => {
    let resolveRequest;
    stubFetch(() => new Promise(resolve => { resolveRequest = resolve; }));
    renderApp("/contact");
    fillContactForm();
    const submit = screen.getByRole("button", { name: /send message/i });
    fireEvent.click(submit);

    expect(submit).toBeDisabled();
    resolveRequest({ ok: true, json: async () => ({ message: "Message received." }) });
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("Message received."));
    expect(submit).toBeEnabled();
  });

  it("shows accessible inline validation errors without sending invalid data", () => {
    renderApp("/contact");
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    expect(screen.getByRole("alert")).toHaveTextContent("Please correct the highlighted fields.");
    expect(screen.getByLabelText("Your name")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByLabelText("Your name")).toHaveAttribute("aria-describedby", "contact-name-error");
    expect(screen.getByText("Enter at least 2 characters.")).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalledWith("/api/contact", expect.anything());
  });

  it("maps backend field validation to an accessible field error", async () => {
    stubFetch(() => Promise.resolve({
      ok: false,
      json: async () => ({
        error: "Please check the form fields and try again.",
        details: [{ field: "email", message: "Enter a valid email address." }]
      })
    }));
    renderApp("/contact");
    fillContactForm();
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    expect(await screen.findByText(/Please check the form fields/)).toBeInTheDocument();
    expect(screen.getByLabelText("Email address")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText("Enter a valid email address.")).toBeInTheDocument();
  });

  it("shows a useful error when the API is unavailable", async () => {
    stubFetch(() => Promise.reject(new TypeError("fetch failed")));
    renderApp("/contact");
    fillContactForm();
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    expect(await screen.findByText(/We couldn't reach the server/)).toBeInTheDocument();
  });

  it("toggles the menu and closes it with Escape", () => {
    renderApp();
    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    expect(screen.getByRole("button", { name: "Close menu" })).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("button", { name: "Close menu overlay" })).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.getByRole("button", { name: "Open menu" })).toHaveAttribute("aria-expanded", "false");
  });

  it("moves keyboard users to the main content from the skip link", () => {
    renderApp();
    fireEvent.click(screen.getByRole("link", { name: "Skip to content" }));
    expect(document.activeElement).toBe(document.getElementById("main-content"));
  });
});
