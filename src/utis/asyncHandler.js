
//Advanced method 
const asyncHandler=(requestHandler)=>{
    (req,  res , next)=>{
        Promise.resolve(requestHandler()).catch((err)=>{
            next(err)
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