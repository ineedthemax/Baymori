"use client";
import {useEffect,useState} from 'react';
import {ArrowUpRight} from 'lucide-react';
import {DotField} from './ui/dot-field';
export default function AnimatedHero(){
 const [motion,setMotion]=useState(false);
 useEffect(()=>{const preference=window.matchMedia('(prefers-reduced-motion: reduce)');const update=()=>setMotion(!preference.matches);update();preference.addEventListener('change',update);return()=>preference.removeEventListener('change',update);},[]);
 const description='Websites and maintenance for businesses and creators. We build, host, optimize, and connect the digital tools behind your work.';
 const action=<a className="btn btn-copper" href="#contact">Start a project <ArrowUpRight size={16}/></a>;
 if(!motion)return <section className="audit-hero wrap" aria-labelledby="hero-title"><h1 id="hero-title">Less busywork.<br/><em>More business.</em></h1><p>{description}</p>{action}</section>;
 return <DotField className="baymori-hero" style={{height:'155svh'}} headline="Less busywork. More business." eyebrow="BAYMORI / WEBSITES & MAINTENANCE" description={description} accent="#B86D49" fontFamily='"Public Sans", ui-sans-serif, system-ui, sans-serif' grid={[22,15]} repelRadius={110} scrollScatter scrollHint={{scatter:'Scroll to explore',gather:'Back to the beginning'}} actions={action}/>;
}
