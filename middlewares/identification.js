import jwt from "jsonwebtoken";

exports.identifier = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(403).json({ success: false, message: "Unauthorized" });
    }
    try {
        const userToken = token.split(" ")[1];
        const jwtVerified = jwt.verify(userToken, process.env.TOKEN_SECRET);
        if (jwtVerified) {
            req.user = jwtVerified;
            next();
        } else {
            throw new Error("Error in token");
        }
    } catch (error) {
        console.log(error);
    }
}