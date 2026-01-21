import Link from "next/link";

export interface LoginFormProps {
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  error: string | null;
  handleSubmit: (e: React.FormEvent) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  error,
  handleSubmit,
}) => (
  <form
    onSubmit={handleSubmit}
    className="bg-white p-8 rounded-2xl shadow-md w-96"
  >
    <h2 className="text-2xl font-semibold text-center mb-6">Log In</h2>

    {error && <p className="text-red-500 text-center mb-4">{error}</p>}

    <div className="mb-4">
      <label className="block mb-1 font-medium">Email</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border rounded-lg p-2"
        required
      />
    </div>

    <div className="mb-6">
      <label className="block mb-1 font-medium text-gray-700">Password</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
        required
      />
      <div className="flex justify-end">
        <Link
          href="/forgotPassword"
          className="text-[11px] text-blue-500 hover:text-blue-700 font-medium mt-0.5"
        >
          Forgot password?
        </Link>
      </div>
    </div>

    <button
      type="submit"
      className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg"
    >
      Log In
    </button>

    <div className="mt-6 space-y-2 text-center text-sm text-gray-600">
      <p>
        Don't have an account?
        <Link
          href="/register"
          className="text-blue-500 hover:text-blue-700 font-semibold ml-1"
        >
          Sign Up here
        </Link>
      </p>
    </div>
  </form>
);
