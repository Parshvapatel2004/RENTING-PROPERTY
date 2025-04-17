async function Session(req, res) {
    try {

        const userDatas = req.session.user;
 
        if (!userDatas) {
            return res.status(401).json({ success: false, message: "No sesssion created!" });
        } else {
            res.status(200)
                .json({ sessionData: userDatas, success: true, message: "got Successful" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}

module.exports = Session;