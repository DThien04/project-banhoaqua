import { useLogin } from "~/features/auth/hooks/useLogin";
import LoginView from "./LoginView";

export default function Login() {
  const props = useLogin();
  return <LoginView {...props} />;
}
