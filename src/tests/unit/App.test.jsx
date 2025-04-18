import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import userEvent from "@testing-library/user-event";
import routes from "../../routes/routes";
import { UserContext } from "../../utils/UserContext";

const user = {
  firstName: "first name",
  lastName: "last name",
  Profile: { profileImgUrl: "imageUrl" },
};

vi.mock("../../routes/ProtectedRoute.jsx", async () => {
  return {
    default: vi.fn(({ children }) => {
      return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
    }),
  };
});

describe("App component", () => {
  test("Should render user profile and posts with expected management buttons", async () => {
    const router = createMemoryRouter(routes);

    const { container } = render(<RouterProvider router={router} />);

    expect(container).toMatchSnapshot();
  });

  test("navbar should navigate to '/create-post' path when Create post link is clicked", async () => {
    const user = userEvent.setup();

    const router = createMemoryRouter(routes);
    render(<RouterProvider router={router} />);

    const createPostLink = screen.getByRole("link", { name: "Create post" });

    await user.click(createPostLink);

    expect(router.state.location.pathname).toBe("/create-post");
  });

  test("navbar should navigate to '/' path when Manage posts link is clicked", async () => {
    const user = userEvent.setup();

    const router = createMemoryRouter(routes, { initialEntries: ["/create-post"] });
    render(<RouterProvider router={router} />);

    const managePostsLink = screen.getByRole("link", { name: "Manage posts" });

    await user.click(managePostsLink);

    expect(router.state.location.pathname).toBe("/");
  });
});
