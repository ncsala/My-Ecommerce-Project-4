const db = require('../database/models');
const categoryControler = {
    listCategory: async function(req,res){
        const allcategorys= await db.Category.findAll();
        try {
            res.status(200).json({
                error:false,
                msg: "Category List",
                data:allcategorys
            });   
        } catch (error) {
            next(error);  
        }
    },
    createCategory:async function(req,res){ 
        try {
            const categoryExists = await db.Category.findOne({where:{
                category_name:req.body.name 
            }});
            if(categoryExists){
                    return res.status(400).json({
                    error:true,
                    msg: 'Category already exist',
                });
            }
            const newcategory =await db.Category.create({
                category_name:req.body.name
            });
            res.status(201).json({
                error:false,
                msg: "Se creo la categoria",
                data:newcategory
            });
        } catch (error) {
            next(error)
        }
    },
    deleteCategory:async function(req,res){
        try {
            const categoryId = req.params.id;
            const categoryExists = await db.Category.findByPk(categoryId);
            if(!categoryExists){
                return res.status(404).json({
                    error:true,
                    msg: 'Category not found',
                });
            }
            const catDelete=await db.Category.destroy({
                where:{
                    category_id:categoryId
                }
            });
            res.status(200).json({
                error:false,
                msg:"Category delete",
                data:categoryExists
            });
        } catch (error) {
            next(error)
        }
    },
    updateCategory: async function(req,res){
        try {
            const categoryId = req.params.id;
            const categoryExists = await db.Category.findByPk(categoryId);
                if(!categoryExists){
                    return res.status(404).json({
                        error:true,
                        msg: 'Category not found',
                    });

                }
            await db.Category.update({
                category_name:req.body.name
            },{
                where:{
                    category_id:categoryId
                }
            });
            res.status(200).json({
                error:false,
                msg:"Category update",
                data:categoryExists
            });
        } catch (error) {
            next(error)
        }
    }
}

module.exports = categoryControler;