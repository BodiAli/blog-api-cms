import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import routes from "../../routes/routes";
import { act } from "react";
import { vi } from "vitest";
import ProtectedRoute from "../../routes/ProtectedRoute";

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
          Profile: {
            profileImgUrl: "imageUrl",
          },
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

    expect(router.state.location.pathname).toBe("/");
  });

  test("Protected route should render children", async () => {
    await act(async () => {
      render(
        <ProtectedRoute>
          <h1>Child element</h1>
        </ProtectedRoute>
      );
    });

    expect(screen.getByRole("heading", { level: 1, name: "Child element" })).toBeInTheDocument();
  });

  test("If there is no token redirect to login page", () => {
    const router = createMemoryRouter(routes);

    localStorage.getItem = vi.fn(() => "");

    render(<RouterProvider router={router} />);

    expect(router.state.location.pathname).toBe("/log-in");
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });

  test("If JWT token is invalid redirect to login page", () => {
    const router = createMemoryRouter(routes);

    localStorage.getItem = vi.fn(() => "Invalid token");

    render(<RouterProvider router={router} />);

    expect(router.state.location.pathname).toBe("/log-in");
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });
});
