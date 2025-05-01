import { render, waitFor } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import UserPost from "../../components/UserPost/UserPost";

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

vi.mock("date-fns", async (importOriginal) => {
  const result = await importOriginal();
  return {
    ...result,
    formatDistanceToNow: vi.fn(() => "1 day ago"),
  };
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
});
