import { render, screen } from "@testing-library/react";
import Form from "../../components/Form/Form";

describe("Form component", () => {
  test("should render a form", () => {
    const { container } = render(
      <Form>
        <p>Form</p>
      </Form>
    );

    expect(container).toMatchSnapshot();
  });

  test("should render children passed to the Form component", () => {
    render(
      <Form>
        <h1>heading 1</h1>
        <h2>heading 2</h2>
      </Form>
    );

    expect(screen.getByRole("heading", { level: 1, name: "heading 1" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "heading 2" })).toBeInTheDocument();
  });
});
