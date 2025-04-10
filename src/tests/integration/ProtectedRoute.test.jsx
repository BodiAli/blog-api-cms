import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import routes from "../../routes/routes";
import { act } from "react";
import { vi } from "vitest";

const fakeToken = [
  btoa(JSON.stringify({ alg: "HS256", type: "JWT" })),
  btoa(JSON.stringify({ sub: "123" })),
  "signature",
].join(".");

vi.stubGlobal("localStorage", {
  getItem: vi.fn(() => fakeToken),
});

window.fetch = vi.fn(() => {
  return Promise.resolve({
    ok: true,
    json: vi.fn(() =>
      Promise.resolve({
        user: {
          firstName: "bodi",
          lastName: "ali",
        },
      })
    ),
  });
});

describe("App authentication test", () => {
  test("If token is valid render protected route", async () => {
    const router = createMemoryRouter(routes);

    await act(async () => {
      render(<RouterProvider router={router} />);
    });

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Welcome back, bodi ali");
    expect(router.state.location.pathname).toBe("/");
  });

  test("If there is no token redirect to login page", () => {
    const router = createMemoryRouter(routes);

    localStorage.getItem = vi.fn(() => "");

    render(<RouterProvider router={router} />);

    expect(router.state.location.pathname).toBe("/log-in");
    expect(screen.getByRole("textbox", { name: "Email" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Password" })).toBeInTheDocument();
  });

  test("If JWT token is invalid redirect to login page", () => {
    const router = createMemoryRouter(routes);

    localStorage.getItem = vi.fn(() => "Invalid token");

    render(<RouterProvider router={router} />);

    expect(router.state.location.pathname).toBe("/log-in");
    expect(screen.getByRole("textbox", { name: "Email" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Password" })).toBeInTheDocument();
  });
});
