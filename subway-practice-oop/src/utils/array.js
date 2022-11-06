export const hasTextsUnderSpecificLength=(length, ...texts)=>{
    return texts.some((check)=>check.length<length);
};