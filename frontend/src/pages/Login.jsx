import {useForm} from "react-hook-form";
//we cant directly use zod in our code. We need to install hook-form resolver to use zod
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import { useDispatch,useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { loginUser} from "../authSlice";
import { useEffect } from "react";

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

                {/* Password Field */}
                <div>
                    <label 
                        htmlFor="password" 
                        className="block text-sm font-medium mb-1"
                    >
                        Password
                    </label>
                    <input 
                        id="password"
                        type="password"
                        {...register("password")} 
                        placeholder="........"
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {errors.password && (
                        <span className="text-red-400 text-sm mt-1">
                            {errors.password.message}
                        </span>
                    )}
                </div>

                {/* Submit Button */}
                <button 
                    type="submit" 
                    className="w-full p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-semibold text-lg transition-colors"
                >
                    Login
                </button>
            </form>
        </div>
    );
}

export default Login;
