import { screen, render } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import userEvent from "@testing-library/user-event";
import { toast } from "react-toastify";
import Card from "../../components/Card/Card";

vi.mock("date-fns", () => {
  return {
    formatDistanceToNow: vi.fn(() => "about 1 hour ago"),
  };
});

vi.mock("react-toastify", () => {
  return {
    toast: {
      success: vi.fn(),
      error: vi.fn(),
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
};

const requestPostDelete = vi.fn();
const onUpdate = vi.fn();

const updatedPost = {
  ...post,
  published: false,
};

window.fetch = vi.fn(() => {
  return Promise.resolve({
    ok: true,
    status: 200,
    json: vi.fn(() => {
      return Promise.resolve({
        post: updatedPost,
        msg: "Post updated successfully!",
      });
    }),
  });
});

const Stub = createRoutesStub([
  {
    path: "/",
    Component: () => <Card post={post} requestPostDelete={requestPostDelete} onUpdate={onUpdate} />,
  },
]);

describe("Card component", () => {
  test("Should render post data", () => {
    const { container } = render(<Stub />);

    expect(container).toMatchSnapshot();
  });

  test("Should call requestPostDelete with post object", async () => {
    const user = userEvent.setup();
    render(<Stub />);

    const deleteButton = screen.getByRole("button", { name: "Delete" });

    await user.click(deleteButton);

    expect(requestPostDelete).toHaveBeenCalledWith(post);
  });

  test("Should call onUpdate with updated post and show a success toast", async () => {
    const user = userEvent.setup();
    render(<Stub />);

    const publishButton = screen.getByTestId("publish-button");

    await user.click(publishButton);

    expect(onUpdate).toHaveBeenCalledWith(updatedPost);
    expect(toast.success).toHaveBeenCalledWith("Post updated successfully!");
  });

  test("Should show an error toast if fetch fails", async () => {
    window.fetch = vi.fn(() => {
      return {
        ok: false,
        status: 401,
      };
    });

    const user = userEvent.setup();
    render(<Stub />);

    const publishButton = screen.getByTestId("publish-button");

    await user.click(publishButton);

    expect(toast.error).toHaveBeenCalledWith("Failed to update post");
  });
});
