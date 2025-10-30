import {useForm} from "react-hook-form";

function Signup(){

    const {register,handleSubmit,formState:{errors},}=useForm();
    const submittedData=(data)=>{
        console.log(data);
    }

    //register function returns an object and it handles everything itself
    return(
        <>
        <form onSubmit={handleSubmit(submittedData)}>
            <input {...register("firstName")} placeholder="Enter your Name here"/>     
            <input {...register("email")} placeholder="Enter your Email here"/>
            <input {...register("password")} placeholder="Enter your Password here"/>
            <button type="submit" className="btn">Submit</button>
        </form>
        </>
    )
}

export default Signup;




// import { useState } from "react";

// function Signup(){
//     const [name,setName]=useState("");
//     const [email,setEmail]=useState("");
//     const [password,setPassword]=useState("");

//     const handleSubmit=(e)=>{
//         e.preventDefault();
//         //form ko submit krdenge
//         console.log(name , email, password)
//     }

//     return(
//         <form onSubmit={handleSubmit} className="min-h-screen flex flex-col justify-center items-center gap-y-3">
//             <input type="text" value={name} placeholder="Enter your firstName here" onChange={(e)=>setName(e.target.value)} />
//             <input type="email" value={email} placeholder="Enter your email here" onChange={(e)=>setEmail(e.target.value)} />
//             <input type="password" value={password} placeholder="Enter your password here" onChange={(e)=>setPassword(e.target.value)} />
//             <button type="submit">Submit</button>
//         </form>
//     )
// }