import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/AuthService";
import { toastError } from "../api/ToastService";

export default function Login({ setIsAuthenticated }) {
  const navigate = useNavigate();

  const [data, setData] = useState({
    email: "",
    password: ""
  });

  const onChange = (e) =>
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    try {
      await loginUser(data);
      setIsAuthenticated(true);
      navigate("/contacts");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Invalid email or password";

      toastError(message);
    }
  };

  return (
    <div className="auth">
      <form onSubmit={submit}>
        <h2>Login</h2>

        <input
          name="email"
          placeholder="Email"
          value={data.email}
          onChange={onChange}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={data.password}
          onChange={onChange}
          required
        />

        <button type="submit">Login</button>

        <div className="auth-link">
          Don’t have an account? <Link to="/register">Register</Link>
        </div>
      </form>
    </div>
  );
}
