import { describe, expect, it, vi } from "vitest";
import {
  ContactRequestError, getProject, getProjects, ProjectRequestError, sendContactMessage
} from "./api.js";

describe("contact API service", () => {
  it("reports a useful error when a failed response has no JSON body", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: false,
      json: async () => null
    }));

    await expect(sendContactMessage({}))
      .rejects.toMatchObject({
        name: "ContactRequestError",
        message: "Your message could not be sent. Please try again."
      });
  });

  it("does not accept an empty success response as a receipt", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      json: async () => null
    }));

    await expect(sendContactMessage({})).rejects.toBeInstanceOf(ContactRequestError);
  });

  it("loads the public project collection and an individual project", async () => {
    const project = { slug: "civicguard", name: "CivicGuard" };
    vi.stubGlobal("fetch", vi.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => [project] })
      .mockResolvedValueOnce({ ok: true, json: async () => project }));

    await expect(getProjects()).resolves.toEqual([project]);
    await expect(getProject("civicguard")).resolves.toEqual(project);
    expect(fetch).toHaveBeenNthCalledWith(1, "/api/projects", undefined);
    expect(fetch).toHaveBeenNthCalledWith(2, "/api/projects/civicguard", undefined);
  });

  it("preserves project not-found errors from the API", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Project not found.", code: "PROJECT_NOT_FOUND" })
    }));

    await expect(getProject("missing")).rejects.toMatchObject({
      name: "ProjectRequestError",
      code: "PROJECT_NOT_FOUND"
    });
  });
});
