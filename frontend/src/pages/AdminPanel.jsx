import { useForm,useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {z} from "zod";
import axiosClient from "../utils/axiosClient";
import { useNavigate } from "react-router"; 

const problemSchema=z.object({
    title:z.string().min(1,"Title is required"),
    description:z.string().min(1,"Description is required"),
    difficulty:z.enum(["easy","medium","hard"]),
    tags:z.enum(["array","linkedList","graph","dp"]),
    visibleTestCases:z.array(
        z.object({
            input:z.string().min(1,"Input is required"),
            output:z.string().min(1,"Output is required"),
            explanation:z.string().min(1,"Explanation is required"),
        })
    ).min(1,"At least one visible test case required"),
    hiddenTestCases:z.array(
        z.object({
            input:z.string().min(1,"Input is required"),
            output:z.string().min(1,"Output is required"),
        })
    ).min(1,"At least one hidden test case required"),
    startCode:z.array(
        z.object({
            language:z.enum(["C++","Java","JavaScript"]),
            initialCode:z.string().min(1,"Initial code is required")
        })
    ).length(3,"All three languages required"),
    referenceSolution:z.array(
        z.object({
            language:z.enum(["C++","Java","JavaScript"]),
            completeCode:z.string().min(1,"Complete code is required")
        })
    ).length(3,"All three languages required")
});

// Helper component for error messages
const ErrorMessage = ({ error }) => {
    return error ? <span className="text-red-400 text-sm mt-1">{error.message}</span> : null;
};

function AdminPanel(){
    const navigate=useNavigate();
    const {
        register,
        control,
        handleSubmit,
        formState:{errors, isSubmitting }
    } = useForm({
        resolver: zodResolver(problemSchema),
        // --- Set default values to match schema ---
        defaultValues: {
            title: "",
            description: "",
            difficulty: "easy",
            tags: "array",
            visibleTestCases: [{ input: "", output: "", explanation: "" }],
            hiddenTestCases: [{ input: "", output: "" }],
            startCode: [
                { language: "C++", initialCode: "" },
                { language: "Java", initialCode: "" },
                { language: "JavaScript", initialCode: "" }
            ],
            referenceSolution: [
                { language: "C++", completeCode: "" },
                { language: "Java", completeCode: "" },
                { language: "JavaScript", completeCode: "" }
            ]
        }
    });

    // --- Setup all 4 Field Arrays ---
    const { fields: visibleFields, append: appendVisible, remove: removeVisible } = useFieldArray({
        control, name: "visibleTestCases"
    });

    const { fields: hiddenFields, append: appendHidden, remove: removeHidden } = useFieldArray({
        control, name: "hiddenTestCases"
    });

    // These are static (length 3), so we only need `fields`
    const { fields: startCodeFields } = useFieldArray({
        control, name: "startCode"
    });

    const { fields: solutionFields } = useFieldArray({
        control, name: "referenceSolution"
    });

    // --- Submit Handler ---
    const onSubmit = async (data) => {
        try {
            await axiosClient.post("/problem/create", data);
            alert("Problem created successfully!");
            navigate("/"); // Navigate to homepage
        } catch (error) {
            console.error("Failed to create problem:", error);
            alert("Failed to create problem. Check console.");
        }
    };

    // --- Helper styles ---
    const inputStyle = "w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500";
    const textareaStyle = `${inputStyle} min-h-[100px] font-mono`;
    const cardStyle = "bg-gray-800 p-6 rounded-lg shadow-lg space-y-4";
    const labelStyle = "block text-sm font-medium text-gray-300 mb-1";

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 p-4 sm:p-8">
            <form 
                onSubmit={handleSubmit(onSubmit)}
                className="w-full max-w-4xl mx-auto space-y-8"
            >
                <h1 className="text-4xl font-bold">Create New Problem</h1>

                {/* --- CARD 1: Problem Details --- */}
                <div className={cardStyle}>
                    <h2 className="text-2xl font-semibold">Problem Details</h2>
                    {/* Title */}
                    <div>
                        <label htmlFor="title" className={labelStyle}>Title</label>
                        <input id="title" {...register("title")} className={inputStyle} placeholder="e.g., Two Sum" />
                        <ErrorMessage error={errors.title} />
                    </div>
                    {/* Description */}
                    <div>
                        <label htmlFor="description" className={labelStyle}>Description</label>
                        <textarea id="description" {...register("description")} className={textareaStyle} placeholder="Detailed problem description..." />
                        <ErrorMessage error={errors.description} />
                    </div>
                    {/* Difficulty & Tags (in a grid) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="difficulty" className={labelStyle}>Difficulty</label>
                            <select id="difficulty" {...register("difficulty")} className={inputStyle}>
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                            </select>
                            <ErrorMessage error={errors.difficulty} />
                        </div>
                        <div>
                            <label htmlFor="tags" className={labelStyle}>Tag</label>
                            <select id="tags" {...register("tags")} className={inputStyle}>
                                <option value="array">Array</option>
                                <option value="linkedList">Linked List</option>
                                <option value="graph">Graph</option>
                                <option value="dp">DP</option>
                            </select>
                            <ErrorMessage error={errors.tags} />
                        </div>
                    </div>
                </div>

                {/* --- CARD 2: Visible Test Cases --- */}
                <div className={cardStyle}>
                    <h2 className="text-2xl font-semibold">Visible Test Cases</h2>
                    <ErrorMessage error={errors.visibleTestCases?.root} />
                    {visibleFields.map((field, index) => (
                        <div key={field.id} className="p-4 border border-gray-700 rounded-md space-y-3">
                            <h3 className="font-medium">Test Case #{index + 1}</h3>
                            <div>
                                <label className={labelStyle}>Input</label>
                                <textarea {...register(`visibleTestCases.${index}.input`)} className={textareaStyle} />
                                <ErrorMessage error={errors.visibleTestCases?.[index]?.input} />
                            </div>
                            <div>
                                <label className={labelStyle}>Output</label>
                                <textarea {...register(`visibleTestCases.${index}.output`)} className={textareaStyle} />
                                <ErrorMessage error={errors.visibleTestCases?.[index]?.output} />
                            </div>
                            <div>
                                <label className={labelStyle}>Explanation</label>
                                <textarea {...register(`visibleTestCases.${index}.explanation`)} className={textareaStyle} />
                                <ErrorMessage error={errors.visibleTestCases?.[index]?.explanation} />
                            </div>
                            <button 
                                type="button" 
                                className="btn btn-sm btn-error"
                                onClick={() => removeVisible(index)}
                            >
                                Remove Case
                            </button>
                        </div>
                    ))}
                    <button 
                        type="button" 
                        className="btn btn-secondary"
                        onClick={() => appendVisible({ input: "", output: "", explanation: "" })}
                    >
                        Add Visible Case
                    </button>
                </div>
                
                {/* --- CARD 3: Hidden Test Cases --- */}
                <div className={cardStyle}>
                    <h2 className="text-2xl font-semibold">Hidden Test Cases</h2>
                    <ErrorMessage error={errors.hiddenTestCases?.root} />
                    {hiddenFields.map((field, index) => (
                        <div key={field.id} className="p-4 border border-gray-700 rounded-md space-y-3">
                            <h3 className="font-medium">Hidden Case #{index + 1}</h3>
                            <div>
                                <label className={labelStyle}>Input</label>
                                <textarea {...register(`hiddenTestCases.${index}.input`)} className={textareaStyle} />
                                <ErrorMessage error={errors.hiddenTestCases?.[index]?.input} />
                            </div>
                            <div>
                                <label className={labelStyle}>Output</label>
                                <textarea {...register(`hiddenTestCases.${index}.output`)} className={textareaStyle} />
                                <ErrorMessage error={errors.hiddenTestCases?.[index]?.output} />
                            </div>
                            <button 
                                type="button" 
                                className="btn btn-sm btn-error"
                                onClick={() => removeHidden(index)}
                            >
                                Remove Case
                            </button>
                        </div>
                    ))}
                    <button 
                        type="button" 
                        className="btn btn-secondary"
                        onClick={() => appendHidden({ input: "", output: "" })}
                    >
                        Add Hidden Case
                    </button>
                </div>

                {/* --- CARD 4: Starter Code (Static) --- */}
                <div className={cardStyle}>
                    <h2 className="text-2xl font-semibold">Starter Code</h2>
                    <ErrorMessage error={errors.startCode?.root} />
                    {startCodeFields.map((field, index) => (
                        <div key={field.id} className="p-4 border border-gray-700 rounded-md space-y-3">
                            <label className={`${labelStyle} text-lg`}>{field.language}</label>
                            {/* We don't need to register language, it's set in defaultValues */}
                            <textarea 
                                {...register(`startCode.${index}.initialCode`)} 
                                className={textareaStyle} 
                                rows={8}
                            />
                            <ErrorMessage error={errors.startCode?.[index]?.initialCode} />
                        </div>
                    ))}
                </div>

                {/* --- CARD 5: Reference Solution (Static) --- */}
                <div className={cardStyle}>
                    <h2 className="text-2xl font-semibold">Reference Solution</h2>
                    <ErrorMessage error={errors.referenceSolution?.root} />
                    {solutionFields.map((field, index) => (
                        <div key={field.id} className="p-4 border border-gray-700 rounded-md space-y-3">
                            <label className={`${labelStyle} text-lg`}>{field.language}</label>
                            <textarea 
                                {...register(`referenceSolution.${index}.completeCode`)} 
                                className={textareaStyle} 
                                rows={10}
                            />
                            <ErrorMessage error={errors.referenceSolution?.[index]?.completeCode} />
                        </div>
                    ))}
                </div>

                {/* --- Submit Button --- */}
                <div>
                    <button 
                        type="submit" 
                        className="btn btn-primary btn-lg w-full"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Creating..." : "Create Problem"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AdminPanel;
