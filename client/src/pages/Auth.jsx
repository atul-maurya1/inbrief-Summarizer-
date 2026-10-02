import { useState, useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FiArrowRight, FiCheck, FiEye, FiEyeOff, FiLock, FiMail, FiUser, FiAlertCircle } from "react-icons/fi"
import { PiSpinnerGapBold } from "react-icons/pi"
import logo from "../assets/logo.png"
import { authContext } from "../context/authContext"

const Auth = () => {
    const navigate = useNavigate()
    const { signUp, login, loading } = useContext(authContext)

    const [mode, setMode] = useState("login")
    const [showPassword, setShowPassword] = useState(false)
    const [formError, setFormError] = useState("")

    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const isSignUp = mode === "signup"

    const switchMode = (newMode) => {
        setMode(newMode)
        setFormError("")
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setFormError("")

        try {
            if (mode === "signup") {
                if (password !== confirmPassword) {
                    setFormError("Passwords do not match.")
                    return
                }
                if (password.length < 6) {
                    setFormError("Password must be at least 6 characters.")
                    return
                }
                const res = await signUp(firstName, lastName, email, password, confirmPassword)
                if (res?.success === true) navigate("/summarizer")
                else setFormError(res?.message || "Sign up failed. Please try again.")
            } else {
                const res = await login(email, password)
                if (res?.success === true) navigate("/summarizer")
                else setFormError(res?.message || "Invalid email or password.")
            }
        } catch (err) {
            setFormError(
                err?.response?.data?.message ||
                err?.message ||
                "Something went wrong. Please try again."
            )
        }
    }

    return (
        <main className="auth-shell flex h-dvh min-h-0 flex-col overflow-hidden px-5 py-6 sm:px-8 lg:px-14">
            <header className="mx-auto flex w-full max-w-7xl items-center justify-between">
                <Link to="/" className="block w-28 sm:w-32" aria-label="InBrief home">
                    <img src={logo} alt="InBrief" />
                </Link>
                <Link to="/summarizer" className="auth-quiet-link flex items-center gap-1">
                    Explore workspace <FiArrowRight size={16} />
                </Link>
            </header>

            <section className="auth-content mx-auto grid min-h-0 w-full max-w-7xl flex-1 items-center gap-12 overflow-hidden py-8 lg:grid-cols-[1fr_460px] lg:gap-24 lg:py-10">
                {/* Left column */}
                <div className="max-w-xl self-start hidden lg:block">
                    <p className="auth-kicker">A sharper way to think</p>
                    <h1 className="auth-title mt-5">
                        Turn information into your next clear move.
                    </h1>
                    <p className="mt-6 max-w-lg text-base leading-7 text-slate-600 sm:text-lg">
                        Summarize the things that matter, then talk through what comes next with InBrief.
                    </p>
                    <div className="mt-10 grid gap-4 sm:grid-cols-2">
                        {[
                            "Less reading, more understanding",
                            "Your ideas, in one focused space",
                            "AI-powered video transcription",
                            "Ask AI about your content",
                        ].map((feature) => (
                            <div key={feature} className="auth-feature">
                                <span className="auth-feature-icon"><FiCheck size={16} /></span>
                                <span>{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right column – auth card */}
                <div className="auth-card">
                    <div className="mb-6">
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">
                            Welcome to InBrief
                        </p>
                        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                            {isSignUp ? "Create your account" : "Welcome back"}
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            {isSignUp
                                ? "Start making space for better thinking."
                                : "Pick up where your thinking left off."}
                        </p>
                    </div>

                    {/* Tabs */}
                    <div className="auth-tabs" role="tablist" aria-label="Authentication mode">
                        <button
                            type="button"
                            role="tab"
                            aria-selected={!isSignUp}
                            className={!isSignUp ? "auth-tab auth-tab-active" : "auth-tab"}
                            onClick={() => switchMode("login")}
                        >
                            Log in
                        </button>
                        <button
                            type="button"
                            role="tab"
                            aria-selected={isSignUp}
                            className={isSignUp ? "auth-tab auth-tab-active" : "auth-tab"}
                            onClick={() => switchMode("signup")}
                        >
                            Sign up
                        </button>
                    </div>

                    {/* Error banner */}
                    {formError && (
                        <div className="mt-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
                            <FiAlertCircle className="mt-0.5 shrink-0" size={16} />
                            <span>{formError}</span>
                        </div>
                    )}

                    <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
                        {isSignUp && (
                            <div className="grid gap-4 sm:grid-cols-2">
                                <label className="auth-field">
                                    <span>First name</span>
                                    <span className="auth-input-wrap">
                                        <FiUser className="auth-input-icon" size={18} />
                                        <input
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            type="text"
                                            placeholder="First name"
                                            autoComplete="given-name"
                                            required
                                        />
                                    </span>
                                </label>
                                <label className="auth-field">
                                    <span>Last name</span>
                                    <span className="auth-input-wrap">
                                        <FiUser className="auth-input-icon" size={18} />
                                        <input
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            type="text"
                                            placeholder="Last name"
                                            autoComplete="family-name"
                                        />
                                    </span>
                                </label>
                            </div>
                        )}

                        <label className="auth-field">
                            <span>Email address</span>
                            <span className="auth-input-wrap">
                                <FiMail className="auth-input-icon" size={18} />
                                <input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    type="email"
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                    required
                                />
                            </span>
                        </label>

                        <label className="auth-field">
                            <span>Password</span>
                            <span className="auth-input-wrap">
                                <FiLock className="auth-input-icon" size={18} />
                                <input
                                    value={password}
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Min. 6 characters"
                                    autoComplete={isSignUp ? "new-password" : "current-password"}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="auth-password-toggle"
                                    onClick={() => setShowPassword((v) => !v)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <FiEyeOff size={17} /> : <FiEye size={17} />}
                                </button>
                            </span>
                        </label>

                        {isSignUp && (
                            <label className="auth-field">
                                <span>Confirm password</span>
                                <span className="auth-input-wrap">
                                    <FiLock className="auth-input-icon" size={18} />
                                    <input
                                        value={confirmPassword}
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Re-enter password"
                                        autoComplete="new-password"
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                </span>
                            </label>
                        )}

                        {!isSignUp && (
                            <div className="flex justify-end">
                                <button type="button" className="auth-text-button">
                                    Forgot password?
                                </button>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="auth-submit flex items-center justify-center gap-2"
                            disabled={loading}
                        >
                            {loading ? (
                                <PiSpinnerGapBold className="animate-spin" size={18} />
                            ) : (
                                <>
                                    {isSignUp ? "Create account" : "Log in"}
                                    <FiArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    <Link to="/summarizer" className="auth-trial-button text-center mt-4 block">
                        Continue without an account
                    </Link>

                    <p className="mt-5 text-center text-xs leading-5 text-slate-500">
                        By continuing, you agree to our Terms and Privacy Policy.
                    </p>
                </div>
            </section>
        </main>
    )
}

export default Auth
