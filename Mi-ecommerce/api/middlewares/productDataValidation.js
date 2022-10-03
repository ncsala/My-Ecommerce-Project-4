function dataValidation(req, res, next){
    const{title, price, description, gallery, stock, mostwanted, category} = req.body;
    
    if(title == undefined || price == undefined){
        return res.status(400).json({
            ok:false,
            msg:"los atributos precio titulo y galeria son obligatorios"
        })
    }

    if(title == "" || price == 0){
        return res.status(400).json({
            ok:false,
            msg:"Los parametros de entrada no son correctos"
        })
    }

    next();
}

module.exports = dataValidation;