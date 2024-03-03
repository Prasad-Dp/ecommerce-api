const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers['authorization'].split(" ")[1];
        //console.log(token)
        jwt.verify(token, process.env.JWT_KEY, (error, decoded) => {
            if (error) {
                return res.json({ error: error.message }); // Fix typo here (change 'josn' to 'json')
            } else {
                //console.log(decoded.id)
                req.user = decoded.id;

                next();
            }
        });
    } catch (error) {
        return res.json({ error: error.message }); // Fix typo here (change 'josn' to 'json')
    }
};

module.exports = authMiddleware;
