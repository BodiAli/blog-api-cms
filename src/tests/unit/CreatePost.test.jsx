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

window.fetch = vi.fn(() => {
  return Promise.resolve({
    ok: true,
    status: 200,
    json: vi.fn(() => {
      return Promise.resolve({ msg: "Post created successfully!" });
    }),
  });
});

// Mock TinyMCE because editorRef.current returns null
vi.mock("@tinymce/tinymce-react", () => {
  return {
    Editor: vi.fn(({ onInit }) => {
      const fakeEditor = {
        getContent: vi.fn(() => "<p>Test content</p>"),
      };

      if (onInit) onInit(null, fakeEditor);

      return <textarea id="tiny-react_16442152911745160014578"></textarea>;
    }),
  };
});

describe("CreatePost component", () => {
  test("Should render form with inputs and TinyMCE library to create a new post", () => {
    const router = createMemoryRouter(routes, { initialEntries: ["/create-post"] });
    const { container } = render(<RouterProvider router={router} />);

    expect(container).toMatchSnapshot();
  });

  test("Should render errors if form is submitted with invalid input values", async () => {
    const user = userEvent.setup();

    window.fetch.mockImplementationOnce(() => {
      return Promise.resolve({
        ok: false,
        status: 400,
        json: vi.fn(() =>
          Promise.resolve({
            errors: [{ msg: "Title can not be empty." }],
          })
        ),
      });
    });

    // Prevent Error: Not implemented: window.scrollTo in jsdom library
    window.scrollTo = vi.fn(() => {});

    const router = createMemoryRouter(routes, { initialEntries: ["/create-post"] });
    render(<RouterProvider router={router} />);

    const submitButton = screen.getByRole("button", { name: "Create post" });
    const titleInput = screen.getByLabelText("Title");

    await user.type(titleInput, " ");
    await user.click(submitButton);

    const listItems = screen.getByRole("listitem");

    expect(listItems).toHaveTextContent("Title can not be empty.");
  });

  test("Should navigate to '/' path on successful form submit", async () => {
    const user = userEvent.setup();

    const router = createMemoryRouter(routes, { initialEntries: ["/create-post"] });
    render(<RouterProvider router={router} />);

    const submitButton = screen.getByRole("button", { name: "Create post" });
    const titleInput = screen.getByLabelText("Title");

    await user.type(titleInput, "Post title");
    await user.click(submitButton);

    expect(router.state.location.pathname).toBe("/");
  });
});
