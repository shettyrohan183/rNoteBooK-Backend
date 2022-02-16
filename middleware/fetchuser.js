var jwt = require('jsonwebtoken');
const JWT_SECRET ="Harryisagoodcoder";

const fetchuser = (req, res, next)=>{
    // get the user from the jwt token and add id to req object 
    const token = req.header('auth-token');
    if(!token){
        res.status(401).send({erroe:"please auth using a valid user"})
    }
    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
       next();

    } catch (error) {
        res.status(401).send({error:"please auth using a valid user"})

    }
    
};

module.exports = fetchuser;