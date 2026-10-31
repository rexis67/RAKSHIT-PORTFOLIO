import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";
import "@testing-library/jest-dom/vitest";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

if (typeof window !== "undefined") {
  Object.defineProperty(window, "scrollTo", { value: vi.fn(), writable: true });
  Object.defineProperty(window.HTMLElement.prototype, "scrollIntoView", {
    value: vi.fn(),
    writable: true
  });
}
