import { useUser } from "../../utils/UserContext";

export default function Header() {
  const user = useUser();

  return (
    <>
      <h1>HI {user.firstName}</h1>
    </>
  );
}
