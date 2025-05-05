import { render, screen } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import userEvent from "@testing-library/user-event";
import CommentCard from "../../components/CommentCard/CommentCard";

vi.stubGlobal("fetch", vi.fn());

vi.mock("date-fns", async (importOriginal) => {
  const result = await importOriginal();
  return {
    ...result,
    formatDistanceToNow: vi.fn(() => "1 day ago"),
  };
});

const fakeComment = {
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
};

const fakeOnDelete = vi.fn();

const Stub = createRoutesStub([
  {
    path: "/",
    Component: () => <CommentCard comment={fakeComment} onDelete={fakeOnDelete} />,
  },
]);

describe("CommentCard component", () => {
  test("Should render comment data", async () => {
    const { container } = render(<Stub />);

    expect(container).toMatchSnapshot();
  });

  test("Should call onDelete when delete button is clicked", async () => {
    const user = userEvent.setup();

    fetch.mockImplementationOnce(() => {
      return Promise.resolve({
        ok: true,
        status: 204,
      });
    });

    render(<Stub />);

    const deleteButton = screen.getByRole("button", { name: "Delete" });

    await user.click(deleteButton);

    expect(fakeOnDelete).toHaveBeenCalledWith(fakeComment);
  });
});
