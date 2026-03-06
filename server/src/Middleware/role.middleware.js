export const roleMiddleware = async (request,response,next) => {
    try {
        const Role = request.role ;

        if(Role !== "admin"){
            return response.status(403).json({
                "message":"Access Denied",
                "success":false
            })
        }
      next();
    } catch (error) {
        console.log("Error at role Middleware \t"+ error.message)
        return response.status(400).json({
        "message":"Role Not Found",
        "success":false
      })
    }
}

