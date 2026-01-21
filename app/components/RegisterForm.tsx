import { useState } from "react";

interface RegisterFormProps {
  error: string;
  onRegisterSubmit: (
    firstname: string,
    lastname: string,
    email: string,
    password: string,
    phoneNumber: string
  ) => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  error,
  onRegisterSubmit,
}) => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRegisterSubmit(firstname, lastname, email, password, phoneNumber);
  };

  return (
    <div className="p-8 w-full max-w-2xl bg-white rounded-2xl border border-gray-100 shadow-xl mx-auto text-black">
      <h2 className="text-3xl font-extrabold text-center mb-8 text-gray-800">
        Create an Account
      </h2>

      {error && (
        <div
          className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg"
          role="alert"
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              First Name
            </label>
            <input
              type="text"
              required
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-xl block w-full p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              required
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-xl block w-full p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
          />
        </div>
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Phone Number (Optional)
          </label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
          />
        </div>

        <button
          type="submit"
          className="w-full text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        >
          Register
        </button>
      </form>
    </div>
  );
};
