/* eslint-disable no-unused-vars */
import { useForm } from "react-hook-form";
import {Send} from "lucide-react";
import { useState,useEffect ,useRef } from "react";
import axiosClient from "../utils/axiosClient";

function ChatAI({problem}){
    const [messages,setMessages]=useState([
        {role:"model",content:"Hi , how are you "},
        {role:"user",content:"I am good "}
    ]);

    const {register,handleSubmit,reset,formState:{errors}}=useForm();
    const messagesEndRef=useRef(null);

    useEffect(()=>{
        messagesEndRef.current?.scrollIntoView({behaviour:"smooth"});
    },[messages]);

    const onSubmit=async(data)=>{
        setMessages(prev=>[...prev,{role:"user",content:data.message}]);
        reset();

        try{
            const response=await axiosClient.post("chat/ai",{
                message:data.message
            })

            setMessages(prev=>[...prev,{
                role:"model",
                content:response.data.message|| response.data.content
            }]);
        }catch(error){
            console.error("API ERROR:",error);
            setMessages(prev=>[...prev,{
                role:"model",
                content:"Sorry, I encountered an errorr"
            }]);
        }
    };

    return (
        <div className="flex flex-col h-screen max-h-[80vh] min-h-[500px]">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg,index)=>(
                    <div
                    key={index}
                    className={`chat ${msg.role==="user"?"chat-end":"chat-start"}`}
                    >
                        <div className="chat-bubble bg-base-200 text-base-content">{msg.content}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef}/>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}
            className="sticky bottom-0 p-4 bg-base-100 border-t bg-gray-900"
            >
                <div className="flex items-center">
                    <input placeholder="Ask me anything" className="input input-bordered flex-1  text-black" {...register("message",{required:true,minLength:2})}/>
                    <button type="submit" className="btn btn-ghost ml-2" disabled={errors.message}><Send size={20}/></button>
                </div>
            </form>
        </div>
    )
}


export default ChatAI;