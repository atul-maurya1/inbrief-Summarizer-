
export const verifyJWT = async(req, res) => {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

}