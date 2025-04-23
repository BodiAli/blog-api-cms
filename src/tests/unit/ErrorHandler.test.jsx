import { render } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import ErrorHandler from "../../components/ErrorHandler/ErrorHandler";

function ThrowErrorComponent() {
  throw new Error("ERROR!!!");
}

describe("ErrorHandler component", () => {
  test("Should render error message with a reload button", () => {
    const Stub = createRoutesStub([
      {
        path: "/",
        Component: ThrowErrorComponent,
        ErrorBoundary: ErrorHandler,
      },
    ]);
    const { container } = render(<Stub initialEntries={["/"]} />);

    expect(container).toMatchSnapshot();
  });
});
