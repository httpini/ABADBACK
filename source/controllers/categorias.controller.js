const {categoria}= require("../database/models/index")

module.exports={
    create: async(req,res)=>{
        let listaCategorias = await categoria.findAll({
            include:{all:true},
            order:[
                ["name", "ASC"]
            ]
        })
        return res.render("categorias/create",{
            title: "Categorias",
            categorias: listaCategorias,
        })
    },
    edit: async(req, res)=>{
        let categorias= categoria.findByPk({include:{all:true}})
        if (!categorias){
            res.redirect("/categorias/")
        }
        return res.render("/categorias/edit",{
            title:"Editar Categoria",
            categoria: categorias
        })
    },
    created:async (req,res)=>{
        await categoria.create(req.body)
        return res.redirect("/categorias/")
    },
    edited: async(req,res)=>{
        let categorias= await categoria.findByPk(req.params.id,{include:{all:true}})
        await categorias.update(req.body)
        return res.redirect("categorias/")
    },
    destroid: async (req,res)=>{
        let categorias= categoria.findByPk({include:{all:true}})
        if (!categorias){
            res.redirect("/categorias/")
        }
        await categoria.destroy()
        res.redirect("/categorias/")
    }



}