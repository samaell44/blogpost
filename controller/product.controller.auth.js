require('dotenv').config();

app.post('/login', async (req, res) => {
    const username= req.body.username
    const user= {user:username}

    const accessToken = jwt.sign(user, process.env.RANDOM_SECRET_KEY, { expiresIn: '30s' });
    res.json({ accessToken: accessToken });

    function authenticateToken(req, res, next) {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (token == null) return res.sendStatus(401);

        jwt.verify(token, process.env.RANDOM_SECRET_KEY, (err, user) => {
            if (err) return res.sendStatus(403);
            req.user = user;
            next();
        });
    }
})