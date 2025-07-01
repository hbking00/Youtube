
//Advanced method 
const asyncHandler=(requestHandler)=>{
    return (req,  res , next)=>{
        Promise.resolve(requestHandler(req,res,next)).catch((error)=>{
            next(error)
        })
    }
}
export {asyncHandler}

//Regular Try catch 

/*
const asyncHandler(function)=> async (req , res , next)=>{
    try{
    await function(req , res , next)
}
    catch(error){
    res.status(error.code ||500 ).json({
    success:false
    message : error.message})

    }
)
*/