'use client';
import { signIn } from "next-auth/react";
import { useState } from "react";


const SignInModal = ({ isOpen, onClose, providers }) => {
    const [isSignIn, setIsSignIn] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [error, setError] = useState(false);

    const handleToggle = () => {
        setIsSignIn(prev => !prev);
        setEmail('');
        setPassword('');
        setPassword2('');

    }

    const handleLogin = async(e) => {
        e.preventDefault();

        try {
            const result = await signIn('credentials', {
                redirect: false,
                email,
                password
            });

            if(result.error){
                console.log('Error signing in: ',result.error);
                alert('Sign in failed. Please check your email and password');
            }
            else{
                alert('Signed in successfully');
                onClose();
            }
        } catch (error) {
            console.log('Error during sign in:', error);
            alert('An error occurred during sign in.');
        }
    }

    const handleRegister = async(e) => {
        e.preventDefault();

        if(!email || !password | !password2){
            alert(`All fields are required!`);
            return;
        }
        else {
            if(password != password2){
                setError(true);
                alert(`Password not match!`);
            }
            else {
                setError(false);
                try {
                    const userExists = await fetch('/api/userExists', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({email})
                    });

                    const { user, googleUser } = await userExists.json();

                    if(user || googleUser){
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

                    if(response.ok){
                        alert('User registered successfully.')
                        handleToggle();
                    }
                } catch (error) {
                    console.log('Error during reistration: ',error );
                }
            }
        }
    }

    if(!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 mt-40 md:mt-10">
            <div className="fixed inset-0 bg-gray-900 opacity-50" onClick={onClose}></div>
            <div className="relative bg-white p-8 rounded-lg shadow-lg h-[600px] w-full max-w-md mx-auto">
                <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                X
                </button>
                {/* Sign in display */}
                {isSignIn ? (
                    <>
                    <div>
                        <h1 className='text-xl font-semibold'>Sign in</h1>
                    </div>

                    <form onSubmit={handleLogin} className='flex flex-col mt-4'>
                        <label className='pb-2'>Email: </label>
                        <input 
                            type="email" 
                            className='h-14 border-2 rounded-lg px-3 py-2 sm:text-base'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <label className='mt-2 pb-2'>Password: </label>
                        <input 
                            type="password" 
                            className='h-14 border-2 rounded-lg px-3 py-2 sm:text-base'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button className='bg-blue-500 text-white mt-6 h-14 rounded-full hover:bg-blue-700'>Login</button>
                    </form>
                    
                    <div className='flex flex-col mt-32'>
                        <span className="flex justify-center items-center">Don't have an account yet? &nbsp;<button href='#' className='hover:underline underline-offset-4' onClick={handleToggle}>Sign Up</button></span>
                        {providers && 
                            Object.values(providers)
                            .filter(provider => provider.name === "Google")
                            .map((provider) => (
                            <button 
                                key={provider.name}
                                className='hover:underline underline-offset-4'
                                onClick={() => signIn(provider.id)}>Sign in with {provider.name}</button>
                            ))
                        }
                    </div>
                    </>
                ) : (
                    <>
                    <div>
                        <h1 className='text-xl font-semibold'>Sign Up</h1>
                    </div>
                    <form onSubmit={handleRegister} className='flex flex-col mt-4'>
                        <label className='pb-2'>Email: </label>
                        <input 
                            type="email" 
                            className='h-14 border-2 rounded-lg px-3 py-2 sm:text-base'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <label className='mt-2 pb-2'>Password: </label>
                        <input 
                            type="password" 
                            className={`h-14 border-2 rounded-lg px-3 py-2 sm:text-base ${error ? 'border-red-500' : ''}`}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <label className='mt-2 pb-2'>Re-enter Password: </label>
                        <input 
                            type="password" 
                            className={`h-14 border-2 rounded-lg px-3 py-2 sm:text-base ${error ? 'border-red-500' : ''}`}
                            value={password2}
                            onChange={(e) => setPassword2(e.target.value)}
                        />
                        <button 
                            className='bg-white text-slate-900 mt-6 h-14 border-blue-600 border-2 rounded-full hover:bg-blue-600 hover:text-white'
                        >Register</button>
                    </form>
                    
                    <div className='flex flex-col mt-8'>
                    <span className="flex justify-center items-center">Already have an account? &nbsp;<button href='#' className='hover:underline underline-offset-4' onClick={handleToggle}>Sign In</button></span>
                        {providers && 
                            Object.values(providers)
                            .filter(provider => provider.name === "Google")
                            .map((provider) => (
                            <button 
                                key={provider.name}
                                className='hover:underline underline-offset-4'
                                onClick={() => signIn(provider.id)}>Sign in with {provider.name}</button>
                            ))
                        }
                    </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default SignInModal