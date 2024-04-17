 
function validUser(req,res){
    const userSessionId =req.session.userSessionId ? req.session.userSessionId : "";
    const userCookieId=req.cookies.userCookieId ? req.cookies.userCookieId : "";
    if( userSessionId &&  userCookieId && userSessionId === userCookieId){
        return true;
    }
    else{
        return false
    }
}

module.exports={validUser};