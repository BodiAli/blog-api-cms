import { render, screen, waitFor } from "@testing-library/react";
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

vi.mock("date-fns", () => {
  return {
    formatDistanceToNow: vi.fn(() => "about 1 hour ago"),
  };
});

window.fetch = vi.fn(() => {
  return Promise.resolve({
    ok: true,
    status: 200,
    json: vi.fn(() => {
      return Promise.resolve({
        posts: [
          {
            id: 1,
            userId: 1,
            title: "Post 1",
            content: "Post content",
            published: true,
            likes: 5,
            createdAt: "2025-04-27T03:03:02.292Z",
            updatedAt: "2025-04-27T03:03:02.292Z",
            imgUrl: null,
            Topics: [
              { id: 1, name: "Topic 1" },
              { id: 2, name: "Topic 2" },
            ],
          },
        ],
        pages: 1,
      });
    }),
  });
});

describe("App component", () => {
  test("Should render header component with user data, and posts with expected management buttons and pagination", async () => {
    const router = createMemoryRouter(routes);

    let container;

    await waitFor(() => {
      const result = render(<RouterProvider router={router} />);

      container = result.container;
    });

    expect(container).toMatchSnapshot();
  });

  test("Should navigate to 'users/posts/1/edit' when card's edit link is clicked", async () => {
    const user = userEvent.setup();

    const router = createMemoryRouter(routes);

    await waitFor(() => {
      render(<RouterProvider router={router} />);
    });

    const editLink = screen.getByRole("link", { name: "Edit" });

    await user.click(editLink);

    expect(router.state.location.pathname).toBe("/users/posts/1/edit");
  });

  test("Should navigate to 'users/posts/1' when card's view post link icon is clicked", async () => {
    const user = userEvent.setup();

    const router = createMemoryRouter(routes);

    await waitFor(() => {
      render(<RouterProvider router={router} />);
    });

    const viewPostLink = screen.getByTestId("view-post");

    await user.click(viewPostLink);

    expect(router.state.location.pathname).toBe("/users/posts/1");
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
