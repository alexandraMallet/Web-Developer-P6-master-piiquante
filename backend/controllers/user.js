const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

//TODO : vérifier email valide
//TODO : vérifier email pas déjà présent dans la BDD
//TODO : vérifier password minimum 8 caractères


exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({ message: "Nouvel utilisateur.ice créé.e" }))
                .catch(error => res.status);
        })
        .catch(error => res.status(500).json({ error }));
};




exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: "paire identifiant - mot de passe incorrecte" });
            } else {
                bcrypt.compare(req.body.password, user.password)
                    .then(valid => {
                        if (!valid) {
                            return res.status(401).json({ message: "paire identifiant - mot de passe incorrecte" });
                        } else {
                            res.status(200).json({
                                userId: user._id,
                                token: jwt.sign(
                                    { userId: user._id },
                                    process.env.SECRET_TOKEN,
                                    { expiresIn: "24h" }
                                )
                            });
                        }
                    })
                    .catch(error => res.status(500).json({error}));
            }
        })
        .catch(error => res.status(500).json({error}));
};

