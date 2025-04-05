import "./App.css";
import { useUser } from "./utils/UserContext";

export default function App() {
  const user = useUser();

  return <h1>Welcome back, {user.firstName}</h1>;
}
