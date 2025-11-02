import {useForm} from "react-hook-form";
//we cant directly use zod in our code. We need to install hook-form resolver to use zod
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import { useDispatch,useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { loginUser} from "../authSlice";
import { useEffect,useState } from "react";

const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

// Icon for "Hide Password"
const EyeOffIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.996 0 1.953-.138 2.863-.401M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243l-4.243-4.243" />
    </svg>
);

//for frontend level validations , we will use zod.
//we can use react-hook-form for frontend level validations but we dont use it as the syntax is difficult


//frontend validations for signup form
const signupSchema=z.object({
    emailId:z.email("Invalid Email"),
    password: z.string().min(8, "Password must be at least 8 characters long")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^a-zA-Z0-9]/,"Password must contain at least one special character")
})


function Login(){
    const [showPassword,setShowPassword]=useState(false);
    const dispatch=useDispatch();
    const navigate=useNavigate();
    // eslint-disable-next-line no-unused-vars
    const {isAuthenticated,loading,error}=useSelector((state)=>state.auth);

    const {register,handleSubmit,formState:{errors},}=useForm({resolver:zodResolver(signupSchema)});

    useEffect(()=>{
        if(isAuthenticated){
            navigate("/");
        }
    },[isAuthenticated,navigate]);

    
    const submittedData=(data)=>{
        dispatch(loginUser(data));
    }

    //register function returns an object and it handles everything itself

    // && operator
    // console.log(2&&30) -> agar pehli condition true huyi (2) , toh jo dusri condition hoti hai wo output bnti hai. OP:30
    // console.log(0&&10)->aur agar pehli condition false hoti hai toh first condition output aati hai. OP:0
    return (
        // These classes make the component full-screen and centered
        <div className="min-h-screen w-full bg-gray-900 text-gray-200 flex flex-col justify-center items-center p-4 sm:p-8">
            
            <h1 className="text-5xl md:text-5xl font-bold mb-10">Leetcode</h1>

            <form 
                onSubmit={handleSubmit(submittedData)} 
                // This class limits the form width for readability
                className="w-full max-w-md space-y-5"
            >

                {/* Email Field */}
                <div>
                    <label 
                        htmlFor="emailId" 
                        className="block text-sm font-medium mb-1"
                    >
                        Email
                    </label>
                    <input 
                        id="emailId"
                        {...register("emailId")} 
                        placeholder="john@example.com"
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {errors.emailId && (
                        <span className="text-red-400 text-sm mt-1">
                            {errors.emailId.message}
                        </span>
                    )}
                </div>

                {/* Password Field with Show/Hide Icon */}
                <div>
                    <label 
                        htmlFor="password" 
                        className="block text-sm font-medium mb-1"
                    >
                        Password
                    </label>
                    <div className="relative">
                        <input 
                            id="password"
                            // Toggle input type
                            type={showPassword ? "text" : "password"}
                            {...register("password")} 
                            placeholder="••••••••"
                            // Add padding-right to make space for the icon
                            className="w-full p-3 pr-10 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        {/* Show/Hide Button */}
                        <button
                            type="button" // Important: type="button" prevents form submission
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-200"
                            onClick={() => setShowPassword(!showPassword)} // Toggle state
                        >
                            {showPassword ? (
                                <EyeOffIcon /> // Icon when password is visible
                            ) : (
                                <EyeIcon /> // Icon when password is hidden
                            )}
                        </button>
                    </div>
                    {errors.password && (
                        <span className="text-red-400 text-sm mt-1">
                            {errors.password.message}
                        </span>
                    )}
                </div>

                {/* Submit Button */}
                <button 
                    type="submit" 
                    disabled={loading} // Disable button when loading
                    className="w-full p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-semibold text-lg transition-colors disabled:bg-indigo-400"
                >
                    {loading ? "Logging In..." : "Login"}
                </button>

                {/* Signup Link */}
                <p className="text-center text-sm text-gray-400">
                    Don't have an account?{' '}
                    {/* In your real app, this would be a <Link> from react-router-dom */}
                    <a href="/signup" className="font-medium text-indigo-400 hover:text-indigo-300">
                        Sign Up
                    </a>
                </p>

                
            </form>
        </div>
    );
}

export default Login;
