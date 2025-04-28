import { screen, render, waitFor } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import userEvent from "@testing-library/user-event";
import { toast } from "react-toastify";
import { UserContext } from "../../utils/UserContext";
import routes from "../../routes/routes";

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

const post = {
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
};

window.fetch = vi.fn(() => {
  return Promise.resolve({
    ok: true,
    status: 200,
    json: vi.fn(() => {
      return Promise.resolve(post);
    }),
  });
});

// Mock TinyMCE because editorRef.current returns null on form submit
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

vi.mock("react-toastify", () => {
  return {
    toast: {
      success: vi.fn(),
    },
  };
});

describe("EditPost component", () => {
  test("Should render EditPost component with all inputs filled with post initial values", async () => {
    const router = createMemoryRouter(routes, { initialEntries: [`/users/posts/${post.id}/edit`] });

    let container;

    await waitFor(() => {
      const result = render(<RouterProvider router={router} />);

      container = result.container;
    });

    expect(container).toMatchSnapshot();
  });

  test("Should render errors if form is submitted with invalid input values", async () => {
    const user = userEvent.setup();

    // Mock fetch twice, the first for useEffect and the second for handleSubmit
    window.fetch.mockImplementationOnce(() => {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: vi.fn(() => {
          return Promise.resolve(post);
        }),
      });
    });

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
    window.scrollTo = vi.fn();

    const router = createMemoryRouter(routes, { initialEntries: [`/users/posts/${post.id}/edit`] });

    await waitFor(() => {
      render(<RouterProvider router={router} />);
    });

    const submitButton = screen.getByRole("button", { name: "Confirm" });
    const titleInput = screen.getByLabelText("Title");

    await user.type(titleInput, " ");
    await user.click(submitButton);

    const listItems = screen.getByRole("listitem");

    expect(listItems).toHaveTextContent("Title can not be empty.");
  });

  test("Should show a success toast", async () => {
    const user = userEvent.setup();

    // Mock fetch twice, the first for useEffect and the second for handleSubmit
    window.fetch.mockImplementationOnce(() => {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: vi.fn(() => {
          return Promise.resolve(post);
        }),
      });
    });
    window.fetch.mockImplementationOnce(() => {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: vi.fn(() => {
          return Promise.resolve({ msg: "Post updated successfully!" });
        }),
      });
    });

    const router = createMemoryRouter(routes, { initialEntries: [`/users/posts/${post.id}/edit`] });

    await waitFor(() => {
      render(<RouterProvider router={router} />);
    });

    const submitButton = screen.getByRole("button", { name: "Confirm" });
    const titleInput = screen.getByLabelText("Title");

    await user.type(titleInput, "Post title");
    await user.click(submitButton);

    expect(toast.success).toHaveBeenCalledWith("Post updated successfully!");
  });
});
