const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.an;
    const decoded = jwt.verify(token, "shhhhh");
    console.log(decoded);
    console.log("decoded one");
    next();
  } catch (e) {
    console.log(e);
    res.status(401).send({ error: "Please authenticate to become admin" });
  }
};

module.exports = auth;
