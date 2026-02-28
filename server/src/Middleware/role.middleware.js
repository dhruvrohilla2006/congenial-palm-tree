export const roleMiddleware = async (request,response,next) => {
    try {
        const Role = request.role ;

        console.log(Role);
        return response.send({"role":Role})
    } catch (error) {
        console.log("Error at role Middleware \t"+ error.message)
        return response.status(400).json({
        "message":"Role Not Found",
        "success":false
      })
    }
}

