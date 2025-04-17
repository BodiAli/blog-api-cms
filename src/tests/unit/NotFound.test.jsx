import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import routes from "../../routes/routes";

describe("NotFound component", () => {
  test("Should render user profile and posts with expected management buttons", async () => {
    const router = createMemoryRouter(routes, { initialEntries: ["/undefined-path"] });

    render(<RouterProvider router={router} />);

    expect(screen.getByRole("heading", { level: 1, name: "404 Not found" })).toBeInTheDocument();
  });
});
