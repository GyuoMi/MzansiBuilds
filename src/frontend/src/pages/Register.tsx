import { useState } from 'react';
import { registerUser } from '../services/api';
import { Link } from 'react-router-dom';

export default function Register() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            await registerUser({ email, username, password });
            setSuccess('Account created successfully. You can now log in.');
            // We will add routing to the login page here shortly
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen bg-mzansi-black flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-mzansi-white">
                    Create your MzansiBuilds account
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && <div className="text-red-500 text-sm">{error}</div>}
                        {success && <div className="text-mzansi-green text-sm font-semibold">{success}</div>}
                        
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                            <div className="mt-1">
                                <input id="email" type="email" required
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-mzansi-green focus:border-mzansi-green sm:text-sm"
                                    value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                            <div className="mt-1">
                                <input id="username" type="text" required
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-mzansi-green focus:border-mzansi-green sm:text-sm"
                                    value={username} onChange={(e) => setUsername(e.target.value)} />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                            <div className="mt-1">
                                <input id="password" type="password" required
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-mzansi-green focus:border-mzansi-green sm:text-sm"
                                    value={password} onChange={(e) => setPassword(e.target.value)} />
                            </div>
                        </div>

                        <div>
                            <button type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-mzansi-green hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mzansi-green">
                                Register
                            </button>
                        </div>
                    </form>
                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">
                                    Already have an account?
                                </span>
                            </div>
                        </div>
                        <div className="mt-6 text-center">
                            <Link to="/login" className="font-medium text-mzansi-green hover:text-green-600">
                                Sign in here
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}