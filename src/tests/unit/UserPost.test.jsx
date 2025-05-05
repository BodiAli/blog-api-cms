import { render, waitFor, screen } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import { toast } from "react-toastify";
import userEvent from "@testing-library/user-event";
import UserPost from "../../components/UserPost/UserPost";

vi.mock("date-fns", async (importOriginal) => {
  const result = await importOriginal();
  return {
    ...result,
    formatDistanceToNow: vi.fn(() => "1 day ago"),
  };
});

vi.mock("react-toastify", () => {
  return {
    toast: {
      success: vi.fn(),
    },
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
  Comments: [
    {
      id: "7397319e-58ef-4e42-bc94-aa8788db4090",
      userId: 1,
      postId: "57c20dfb-8135-42eb-8abe-0bffbaffd668",
      content: "Comment content",
      likes: 1,
      createdAt: "2025-05-03T07:51:49.273Z",
      updatedAt: "2025-05-04T06:19:03.092Z",
      User: {
        id: 1,
        firstName: "Bodi",
        lastName: "Ali",
        Profile: {
          profileImgUrl: "imageUrl",
        },
      },
    },
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

const Stub = createRoutesStub([
  {
    path: "/users/posts/:postId",
    Component: () => <UserPost />,
  },
]);

describe("UserPost component", () => {
  test("Should render post data", async () => {
    let container;
    await waitFor(() => {
      const result = render(<Stub initialEntries={[`/users/posts/${post.id}`]} />);

      container = result.container;
    });

    expect(container).toMatchSnapshot();
  });

  test("Should delete comment and show a success toast when delete button is clicked", async () => {
    const user = userEvent.setup();

    window.fetch
      .mockImplementationOnce(() => {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: vi.fn(() => {
            return Promise.resolve(post);
          }),
        });
      })
      .mockImplementationOnce(() => {
        return Promise.resolve({
          ok: true,
          status: 204,
        });
      });

    await waitFor(() => {
      render(<Stub initialEntries={[`/users/posts/${post.id}`]} />);
    });

    const deleteButton = screen.getByRole("button", { name: "Delete" });

    await user.click(deleteButton);

    expect(screen.queryByText("Comment content")).not.toBeInTheDocument();
    expect(toast.success).toBeCalledWith("Comment deleted successfully!");
  });
});
