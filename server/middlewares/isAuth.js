import jwt from "jsonwebtoken";
const isAuth = (req,res,next)=>{
    try {
        const token = req.cookies.token;
       
        if(!token){
            return res.status(401).json({
                message:"Unauthorized please login.",
            });
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({message:"invalid or expired token.",});
    }
};
export default isAuth;