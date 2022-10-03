const db = require("../database/models");

const userAuthMiddleware = {
    listUsers: function (req, res, next) {
        const role = req.newUsers.role;
        if(role === "admin" || role === "god") {return next();}
        res.status(403).json({error: true,
                            msg: "Not authorized"});
    },

    getUser: function (req, res, next) {
        const role = req.newUsers.role;
        const id = req.newUsers.user_id;
        if(role === "admin" || role === "god" || id === Number(req.params.id)) {return next();}
        res.status(403).json({error: true,
                            msg: "Not authorized"});
    },
    
    createUser: function (req, res, next) {
        next();
    },

    login: function (req, res, next) {
        next();
    },

    updateUser: function (req, res, next) {
        try{
            const roleLoggedUser = req.newUsers.role;
            const idLoggedUser = req.newUsers.user_id;
            const roleUpdate = req.body.role;
            const idUpdate = Number(req.params.id);

            if(roleLoggedUser === "god") {return next();}
            if(idLoggedUser === idUpdate)
            {
                if(roleLoggedUser === "admin" && 
                  (roleUpdate === "admin" || roleUpdate === "guest"))
                  {return next();}
                if(roleLoggedUser === "guest" && 
                  roleUpdate === "guest")
                  {return next();}
            }
            return res.status(403).json({error: true,
                                        msg: "Not authorized"});
        }catch{

        }

    },

    deleteUser: function (req, res, next) {
        const role = req.newUsers.role;
        const id = req.newUsers.user_id;
        if(role === "god" || id === Number(req.params.id)) {return next();}
        res.status(403).json({error: true,
                            msg: "Not authorized"});
    }
}

module.exports = userAuthMiddleware;