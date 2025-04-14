import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res
            .status(401)
            .json({ success: false, message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        // console.log("Decoded JWT:", req.user, req.user.id);

        next();
    } catch (error) {
        res.status(401).json({ success: false, message: "Invalid token" });
    }
};
