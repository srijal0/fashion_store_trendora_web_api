import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import LoginForm from "@/app/(auth)/_components/LoginForm";


jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
}));

jest.mock("next/link", () => {
  return function Link({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>;
  };
});

jest.mock("@/lib/action/auth-action", () => ({
  handleLogin: jest.fn(),
}));

import { handleLogin } from "@/lib/action/auth-action";
const mockHandleLogin = handleLogin as jest.Mock;

describe("LoginForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should render email and password fields", () => {
    render(<LoginForm />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  test("should render login button", () => {
    render(<LoginForm />);
    expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
  });

  test("should render forgot password link", () => {
    render(<LoginForm />);
    expect(screen.getByText(/forgot password/i)).toBeInTheDocument();
  });

  test("should render sign up link", () => {
    render(<LoginForm />);
    expect(screen.getByText(/sign up/i)).toBeInTheDocument();
  });

  test("should show validation error for empty form", async () => {
    render(<LoginForm />);
    const submitButton = screen.getByRole("button", { name: /log in/i });
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    });
  });

  test("should show error message on failed login", async () => {
    mockHandleLogin.mockResolvedValue({
      success: false,
      message: "Invalid credentials",
    });
    render(<LoginForm />);
    await userEvent.type(screen.getByLabelText(/email/i), "test@example.com");
    await userEvent.type(screen.getByLabelText(/password/i), "wrongpassword");
    fireEvent.click(screen.getByRole("button", { name: /log in/i }));
    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });

  test("should call handleLogin with correct data on submit", async () => {
    mockHandleLogin.mockResolvedValue({
      success: true,
      user: { role: "user", email: "test@example.com" },
    });
    render(<LoginForm />);
    await userEvent.type(screen.getByLabelText(/email/i), "test@example.com");
    await userEvent.type(screen.getByLabelText(/password/i), "password123");
    fireEvent.click(screen.getByRole("button", { name: /log in/i }));
    await waitFor(() => {
      expect(mockHandleLogin).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });
  });

  test("should call handleLogin when form is submitted", async () => {
    mockHandleLogin.mockResolvedValue({
      success: true,
      user: { role: "user", email: "test@example.com" },
    });
    render(<LoginForm />);
    await userEvent.type(screen.getByLabelText(/email/i), "test@example.com");
    await userEvent.type(screen.getByLabelText(/password/i), "password123");
    fireEvent.click(screen.getByRole("button", { name: /log in/i }));
    await waitFor(() => {
      expect(mockHandleLogin).toHaveBeenCalled();
    });
  });
});