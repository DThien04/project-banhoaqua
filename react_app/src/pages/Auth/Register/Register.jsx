import { useRegister } from "~/features/auth/hooks/useRegister";
import RegisterView from "./RegisterView";

export default function Register() {
  const props = useRegister();
  return <RegisterView {...props} />;
}
