const validator=require("validator");

const validate=(data)=>{
    const mandatoryField=["firstName","emailId","password"];
    const isAllowed=mandatoryField.every((k)=>Object.keys(data).includes(k));

    if(!isAllowed) throw new Error("Some field missing");

    if(!validator.isEmail(data.emailId)) throw new Error("Invalid Email ID");
    if(!validator.isStrongPassword(data.password)) throw new Error("Enter Strong Password");

}

module.exports=validate;