'use client';
import { signIn } from "next-auth/react";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";

const SignInModal = ({ isOpen, onClose, providers }) => {
    const [isSignIn, setIsSignIn] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleToggle = () => {
        setIsSignIn(prev => !prev);
        setEmail('');
        setPassword('');
        setPassword2('');
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            alert('All fields required!');
            return;
        } else {
            setLoading(true);
            try {
                const result = await signIn('credentials', {
                    redirect: false,
                    email,
                    password
                });

                if (result.error) {
                    console.log('Error signing in: ', result.error);
                    alert('Sign in failed. Please check your email and password');
                } else {
                    alert('Signed in successfully');
                    onClose();
                }
            } catch (error) {
                console.log('Error during sign in:', error);
                alert('An error occurred during sign in.');
            } finally {
                setLoading(false);
            }
        }
    }

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!email || !password || !password2) {
            alert(`All fields are required!`);
            return;
        } else {
            if (password !== password2) {
                setError(true);
                alert(`Password not match!`);
                return;
            } else {
                setError(false);
                setLoading(false);
                try {
                    const userExists = await fetch('/api/userExists', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ email })
                    });

                    const { user, googleUser } = await userExists.json();

                    if (user || googleUser) {
                        alert('Email already used.');
                        return;
                    }

                    const response = await fetch('/api/register', {
                        method: 'POST',
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ email, password })
                    });

                    if (response.ok) {
                        alert('User registered successfully.')
                        handleToggle();
                    }
                } catch (error) {
                    console.log('Error during registration: ', error);
                } finally {
                    setLoading(false);
                }
            }
        }
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Overlay */}
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
            {/* Modal Card */}
            <div className={`relative bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md mx-auto flex flex-col items-center ${loading ? 'opacity-80 pointer-events-none' : ''}`} style={{ minHeight: 480 }}>
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-orange-600 text-2xl font-bold focus:outline-none"
                    aria-label="Close"
                >
                    &times;
                </button>
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10 rounded-2xl">
                        <img src="/assets/icons/loading.svg" alt="Loading" width={60} height={60} />
                    </div>
                )}
                {/* Header */}
                <div className="w-full text-center mb-6 mt-2">
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">
                        {isSignIn ? 'Sign In' : 'Sign Up'}
                    </h1>
                    <p className="text-sm text-gray-500">
                        {isSignIn ? 'Welcome back! Please sign in to your account.' : 'Create a new account to get started.'}
                    </p>
                </div>
                {/* Form */}
                {isSignIn ? (
                    <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                className="w-full h-12 border border-gray-300 rounded-lg px-3 focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="email"
                                disabled={loading}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input
                                type="password"
                                className="w-full h-12 border border-gray-300 rounded-lg px-3 focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="current-password"
                                disabled={loading}
                            />
                        </div>
                        <button
                            disabled={loading}
                            className="w-full h-12 bg-orange-600 text-white rounded-full font-semibold text-lg shadow hover:bg-orange-700 transition disabled:opacity-60"
                        >
                            Sign In
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleRegister} className="w-full flex flex-col gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                className="w-full h-12 border border-gray-300 rounded-lg px-3 focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="email"
                                disabled={loading}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input
                                type="password"
                                className={`w-full h-12 border rounded-lg px-3 focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition ${error ? 'border-red-500' : 'border-gray-300'}`}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="new-password"
                                disabled={loading}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Re-enter Password</label>
                            <input
                                type="password"
                                className={`w-full h-12 border rounded-lg px-3 focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition ${error ? 'border-red-500' : 'border-gray-300'}`}
                                value={password2}
                                onChange={(e) => setPassword2(e.target.value)}
                                autoComplete="new-password"
                                disabled={loading}
                            />
                        </div>
                        <button
                            disabled={loading}
                            className="w-full h-12 bg-white text-orange-600 border-2 border-orange-600 rounded-full font-semibold text-lg shadow hover:bg-orange-600 hover:text-white transition disabled:opacity-60"
                        >
                            Register
                        </button>
                    </form>
                )}
                {/* Divider */}
                <div className="flex items-center w-full my-4">
                    <div className="flex-1 h-px bg-gray-200" />
                    <span className="mx-3 text-gray-400 text-xs uppercase">or</span>
                    <div className="flex-1 h-px bg-gray-200" />
                </div>
                {/* Google Sign In */}
                {providers && Object.values(providers).filter(p => p.name === "Google").map((provider) => (
                    <button
                        key={provider.name}
                        className="flex items-center justify-center w-full gap-3 border border-gray-300 rounded-lg py-3 bg-slate-50 text-slate-700 font-semibold hover:bg-orange-50 transition mb-2"
                        onClick={() => signIn(provider.id)}
                        disabled={loading}
                    >
                        <FcGoogle size={24} /> Sign in with {provider.name}
                    </button>
                ))}
                {/* Toggle link */}
                <div className="w-full text-center mt-2">
                    {isSignIn ? (
                        <span className="text-sm text-gray-600">Don't have an account?{' '}
                            <button type="button" className="text-orange-600 underline hover:text-orange-800 font-semibold" onClick={handleToggle} disabled={loading}>
                                Sign Up
                            </button>
                        </span>
                    ) : (
                        <span className="text-sm text-gray-600">Already have an account?{' '}
                            <button type="button" className="text-orange-600 underline hover:text-orange-800 font-semibold" onClick={handleToggle} disabled={loading}>
                                Sign In
                            </button>
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SignInModal;