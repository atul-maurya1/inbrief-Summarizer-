import { useState , useContext } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiCheck, FiEye, FiEyeOff, FiLock, FiMail, FiUser } from "react-icons/fi";
import logo from "../assets/logo.png";
import {authContext} from '../context/authContext'
import { useNavigate } from "react-router-dom";


const Auth = () => {

    const navigate = useNavigate()

    const [mode, setMode] = useState("login");
    const [showPassword, setShowPassword] = useState(false);
    const isSignUp = mode === "signup";

    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [consfirmPassword, setConfirmPassword] =useState("")

    const { signUp , login} = useContext(authContext)

  //login, loading, errors

    const handleSubmit = async (event) => {
        event.preventDefault();

      
        if(mode === 'signup'){
          let res =  await signUp(firstName, lastName, email, password, consfirmPassword)
           if(res.success === true) navigate('/summarizer')
          
        }else{
           let res =  await login(email, password)
           if(res.success === true) navigate('/summarizer')
        }
       
    };

    return (
        <main className="auth-shell flex h-dvh min-h-0 flex-col overflow-hidden px-5 py-6 sm:px-8 lg:px-14">
            <header className="mx-auto flex w-full max-w-7xl items-center justify-between">
                <Link to="/" className="block w-28 sm:w-32" aria-label="InBrief home">
                    <img src={logo} alt="InBrief" />
                </Link>
                <Link to="/summarizer" className="auth-quiet-link">
                    Explore workspace <FiArrowRight size={16} />
                </Link>
            </header>

            <section className="auth-content mx-auto grid min-h-0 w-full max-w-7xl flex-1 items-center gap-12 overflow-hidden py-8 lg:grid-cols-[1fr_460px] lg:gap-24 lg:py-10">
                <div className="max-w-xl self-start">
                    <p className="auth-kicker">A sharper way to think</p>
                    <h1 className="auth-title mt-5">
                        Turn information into your next clear move.
                    </h1>
                    <p className="mt-6 max-w-lg text-base leading-7 text-slate-600 sm:text-lg">
                        Summarize the things that matter, then talk through what comes next with InBrief.
                    </p>
                    <div className="mt-10 grid gap-4 sm:grid-cols-2">
                        <div className="auth-feature">
                            <span className="auth-feature-icon"><FiCheck size={16} /></span>
                            <span>Less reading, more understanding</span>
                        </div>
                        <div className="auth-feature">
                            <span className="auth-feature-icon"><FiCheck size={16} /></span>
                            <span>Your ideas, in one focused space</span>
                        </div>
                    </div>
                </div>

                <div className="auth-card">
                    <div className="mb-8">
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">Welcome to InBrief</p>
                        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                            {isSignUp ? "Create your account" : "Welcome back"}
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            {isSignUp ? "Start making space for better thinking." : "Pick up where your thinking left off."}
                        </p>
                    </div>

                    <div className="auth-tabs" role="tablist" aria-label="Authentication mode">
                        <button
                            type="button"
                            role="tab"
                            aria-selected={!isSignUp}
                            className={!isSignUp ? "auth-tab auth-tab-active" : "auth-tab"}
                            onClick={() => setMode("login")}
                        >
                            Log in
                        </button>
                        <button
                            type="button"
                            role="tab"
                            aria-selected={isSignUp}
                            className={isSignUp ? "auth-tab auth-tab-active" : "auth-tab"}
                            onClick={() => setMode("signup")}
                        >
                            Sign up
                        </button>
                    </div>

                    <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
                        {isSignUp && (
                            <div className="grid gap-4 sm:grid-cols-2">
                                <label className="auth-field">
                                    <span>First name</span>
                                    <span className="auth-input-wrap">
                                        <FiUser className="auth-input-icon" size={18} />
                                        <input onChange={((e) => setFirstName(e.target.value))} type="text" placeholder="fistName" autoComplete="given-name" />
                                    </span>
                                </label>
                                <label className="auth-field">
                                    <span>Last name</span>
                                    <span className="auth-input-wrap">
                                         <FiUser className="auth-input-icon" size={18} />
                                        <input onChange={((e) => setLastName(e.target.value))}  type="text" placeholder="lastName" autoComplete="family-name" />
                                    </span>
                                </label>
                            </div>
                        )}

                        <label className="auth-field">
                            <span>Email address</span>
                            <span className="auth-input-wrap">
                                <FiMail className="auth-input-icon" size={18} />
                                <input onChange={((e) => setEmail(e.target.value))}  type="email" placeholder="you@example.com" autoComplete="email" />
                            </span>
                        </label>

                        <label className="auth-field">
                            <span>Password</span>
                            <span className="auth-input-wrap">
                                <FiLock className="auth-input-icon" size={18} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="........"
                                    autoComplete={isSignUp ? "new-password" : "current-password"}
                                    onChange={((e) => setPassword(e.target.value))} 
                                />
                                <button
                                    type="button"
                                    className="auth-password-toggle"
                                    onClick={() => setShowPassword((visible) => !visible)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <FiEyeOff size={17} /> : <FiEye size={17} />}
                                </button>
                                
                            </span>
                            {isSignUp && (
                                 <label className="auth-field">
                                 <span>Confirm Password</span>
                                <span className="auth-input-wrap">
                                <FiLock className="auth-input-icon" size={18} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="........"
                                    autoComplete={isSignUp ? "new-password" : "current-password"}
                                    onChange={((e) => setConfirmPassword(e.target.value))} 
                                />
                                <button
                                    type="button"
                                    className="auth-password-toggle"
                                    onClick={() => setShowPassword((visible) => !visible)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <FiEyeOff size={17} /> : <FiEye size={17} />}
                                </button>
                                
                            </span>
                                </label>
                                 
                            )}
                        </label>

                        {!isSignUp && (
                            <div className="flex justify-end">
                                <button type="button" className="auth-text-button">Forgot password?</button>
                            </div>
                        )}

                        <button type="submit" className="auth-submit">
                            {isSignUp ? "Create account" : "Log in"}
                            <FiArrowRight size={18} />
                        </button>
                    </form>

                    <Link to="/summarizer"  type="button" className="auth-trial-button  text-center">
                       Get Start
                    </Link>

                    <p className="mt-7 text-center text-xs leading-5 text-slate-500">
                        By continuing, you agree to our Terms and Privacy Policy.
                    </p>
                </div>
            </section>
        </main>
    );
};

export default Auth;
