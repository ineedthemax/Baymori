"use client";
import {useEffect} from 'react';
export default function ScrollReveals(){
 useEffect(()=>{
  const media=window.matchMedia('(prefers-reduced-motion: reduce)');
  let disposed=false;let cleanup=()=>{};
  async function setup(){cleanup();if(media.matches||disposed)return;
   const {gsap}=await import('gsap');if(disposed||media.matches)return;
   const root=document.querySelector('main');if(!root)return;
   const ctx=gsap.context(()=>{},root);
   const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){ctx.add(()=>{gsap.fromTo(entry.target,{opacity:.35,y:12},{opacity:1,y:0,duration:.5,ease:'power2.out',clearProps:'opacity,transform'});});observer.unobserve(entry.target);}},{threshold:.12});
   root.querySelectorAll('.section-head, .hosting-grid, .process-grid, #work .wrap, .faq-grid').forEach(el=>observer.observe(el));
   cleanup=()=>{observer.disconnect();ctx.revert();};
  }
  void setup();const change=()=>{void setup();};media.addEventListener('change',change);
  return()=>{disposed=true;media.removeEventListener('change',change);cleanup();};
 },[]);return null;
}
