import { render, screen, waitFor } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import routes from "../../routes/routes";

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
        firstName: "bodi",
        lastName: "ali",
        Profile: {
          profileImgUrl: "imageUrl",
        },
      })
    ),
  });
});

describe("App component", () => {
  test("Should render user profile and posts with expected management buttons", async () => {
    const router = createMemoryRouter(routes);

    let container;

    await waitFor(() => {
      const result = render(<RouterProvider router={router} />);

      container = result.container;
    });

    expect(container).toMatchSnapshot();
  });
});
