const {equipo, club, categoria, torneo}=require("../../database/models/index")

module.exports={
    allClubes:async(req,res)=>{
        try{

            let clubes = await club.findAll({
                order:[
                    ["name","ASC"]
                ],
                include:[
                    {
                        model:equipo,
                        as:"equipos",
                        atributes:["color_1","color_2","color_3"]
                    }
                ]
            })
            clubes = clubes.map(club=>{
                let equipos = club.equipos.filter(equipo=> equipo.color_1!= null && equipo.color_1 != "")
                let data = {
                    id:club.id,
                    name:club.name,
                    name_url:club.name_url,
                    colores:[]
                }
                if(equipos[0]?.color_1){
                    data.colores.push(equipos[0].color_1)
                }
                if(equipos[0]?.color_2){
                    data.colores.push(equipos[0].color_2)
                }
                if(equipos[0]?.color_3){
                    data.colores.push(equipos[0].color_3)
                }
                return  data
            })

            
            return res.send({clubes}).status(200)
        }catch(error){
            return res.status(505).json(error)
        }
    },
    oneClub:async(req,res)=>{
        try{
            let elClub = await club.findOne({
                where:{
                    name_url:req.params.name_url
                }
            })
            oneClub = {
                id:elClub.id,
                name: elClub.name,
                name_url:elClub.name_url,
            }
            
            let equipos = await equipo.findAll({
                include:[
                    {
                        model:categoria,
                        as:"categoria",
                        atributes:["name"]
                    },
                    {
                        model:torneo,
                        as:"torneos",
                        attributes:["name","temporada", "name_url"]
                    }
                ],
                where:{
                    club_id:oneClub.id
                },
                order:[
                    ["categoria_id", "ASC"],
                    ["name", "ASC"]
                ]
            })
            equipos = equipos.map(e=>{
               
                let data={
                    id:e.id,
                    name: e.name,
                    name_url:`${e.name.toLowerCase().replace(/\s+/g, '_')}_${e.categoria.name.toLowerCase().charAt(0)}`,
                    categoria:e.categoria.name,
                    torneos:e.torneos.map(t=>{
                        let dataT={
                            name: `${t.name} ${t.temporada}`,
                            name_url:t.name_url,
                        }
                        return dataT
                    }),
                    colores:[]
                }
                if(e.color_1 != null && e.color_1 != ""){
                    data.colores.push(e.color_1)
                }
                if(e.color_2 != null && e.color_2 != ""){
                    data.colores.push(e.color_2)
                }
                if(e.color_3 != null && e.color_3 != ""){
                    data.colores.push(e.color_3)
                }
                return data
            })
            return res.send({club:oneClub, equipos:equipos}).status(200)
        }catch(error){
            return res.status(505).json(error)
        }
    }
}
