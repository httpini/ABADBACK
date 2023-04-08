import Fechas from '@/components/Fechas'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import InformacionEquipo from '@/components/InformacionEquipo'
import LinksTorneos from '@/components/LinksTorneos'
import axios from 'axios'
import React, { useState, useEffect } from 'react'
import FechasEquipo from '@/components/FechasEquipo'
import Link from 'next/link'
import { useRouter } from 'next/router'
import LinksEquipos from '@/components/LinksEquipos'
import LinksTorneoEquipo from '@/components/LinksTorneoEquipo'
import { redirect } from 'next/navigation';
import ColoresEquipo from '@/components/ColoresEquipo'
import GoleadoresSanciones from '@/components/GoleadoresSanciones'


export default function ClubId({ id, club, equipos, torneos, equipo }) {
  const [query, setQuery] = useState({})
  const [equ, setEqu] = useState({})
  const [torn, setTorn] = useState({})
  let router = useRouter();

  useEffect(() => {
    if (router.query.equipo) setEqu(equipos.find(e => e.name_url === router.query.equipo));
    if (router.query.torneo) setTorn(torneos.find(t => t.name_url === router.query.torneo));
    setQuery(router.query)
  }, [equipos, torneos, query])

  return (
    <div>
      <Header />
      {/* <ColoresEquipo colores={equipo.equipo.colores} width={100} height={100}/> */}
      <section className='w-full'>
        {/* <LinksTorneos torneos={torneos} id={id} /> */}
        <h2 className='text-2xl text-center mt-5'>Equipos</h2>
        <div className='flex flex-wrap w-full justify-around px-20'>
          {
            equipos && equipos.map(e => (
              <LinksEquipos key={e.name_url} id={id} query={query} equipo={e} categoria={e.categoria} torneo={query.torneo}/>
            ))
          }
        </div>
        {
          torneos &&
          <div>
            <h2 className='text-2xl text-center mt-5'>Historial de torneos</h2>
            <div className='flex flex-wrap w-full justify-around'>
              {
                torneos.map(t => (
                  <LinksTorneoEquipo key={t.name_url} query={query} torneo={t} />
                ))
              }
            </div>
          </div>
        }

        {
          equipo && (
            <div className='flex flex-col break:grid grid-cols-2 w-full flex-wrap gap-10 justify-around py-10 sm:px-10'>
              <InformacionEquipo nombreTorneo={torn.name} nombreEquipo={equ.name} equipo={equipo.equipo} fairPlay={equipo.fair_play} goleadores={equipo.goleadores} tabla={equipo.tabla} sancionados={equipo.sancionados} />
              <FechasEquipo partidos={equipo.partidos} />
              <GoleadoresSanciones nombreTorneo={torn.name} nombreEquipo={equ.name} equipo={equipo.equipo} fairPlay={equipo.fair_play} goleadores={equipo.goleadores} tabla={equipo.tabla} sancionados={equipo.sancionados} />
            </div>
          )
        }
      </section>
      <Footer />
    </div>
  )
}


export const getServerSideProps = async ({ params: { id }, query: { torneo, equipo } }) => {
  try {

    let clubData = await axios.post('http://localhost:3500/api/club-url', { club: id })
    // console.log('club', clubData.data.club.equipos[0]);
    if (!clubData) {
      return redirect('/');
    }
    // console.log(torneo, equipo);
    // let primerEquipo = clubData.data.club?.equipos[0]?.name_url
    // let primerTorneo = clubData.data.club?.equipos[0]?.torneo[0]
    // console.log(primer);
    let equipoData
    if (torneo && equipo) equipoData = await axios.post(`http://localhost:3500/api/equipo-torneo`, { torneo, equipo })
    // if (!torneo && !equipo) equipoData = await axios.post(`http://localhost:3500/api/equipo-torneo`, { torneo: primerTorneo, equipo: primerEquipo})

    
    if (clubData == null) redirect('/')
    // console.log(equipoData.data);
    // let dataEquipo = calls[1]
    // console.log(dataClub.data.club.equipos, equipo);
    let torneos
    if (equipo) {
      torneos = clubData.data.club.equipos.find(e => e.name_url === equipo).torneos
    }
    // if (!equipo) {
    //   primerTorneo = clubData.data.club.equipos.find(e => e.name_url === equipo).torneos
    // }
    

    let props = {
      id,
      club: clubData.data.club.club,
      equipos: clubData.data.club.equipos
    }

    if (torneos) props.torneos = torneos
    // console.log(equipoData.data);
    if (equipoData) props.equipo = equipoData.data.equipos


    return {
      props
    }
  } catch (error) {
    console.log(error);
    return {
      redirect: {
        permanent: false,
        destination: "/club",
      }
    };
  }
}