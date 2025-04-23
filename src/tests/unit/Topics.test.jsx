import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Topics from "../../components/Topics/Topics";

describe("Topics component", () => {
  test("Should render a label, input, and button to create topics", () => {
    const { container } = render(<Topics />);

    expect(container).toMatchSnapshot();
  });

  test("Should create topic when button is clicked and topics is not empty", async () => {
    const user = userEvent.setup();

    render(<Topics />);

    const topicInput = screen.getByLabelText("Topics");
    const createButton = screen.getByRole("button", { name: "Create" });

    await user.type(topicInput, "Topic 1");
    await user.click(createButton);

    await user.type(topicInput, "Topic 2");
    await user.click(createButton);

    const topic1 = screen.getByLabelText("Topic 1");
    const topic2 = screen.getByLabelText("Topic 2");

    expect(topic1).toBeInTheDocument();
    expect(topic2).toBeInTheDocument();
  });
});
