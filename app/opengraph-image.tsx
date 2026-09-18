import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

export const alt = "Digital Observatory";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{width:"100%",height:"100%",display:"flex",flexDirection:"column",justifyContent:"space-between",padding:68,background:"linear-gradient(135deg,#0a0a09 0%,#151820 55%,#173261 100%)",color:"white",fontFamily:"sans-serif"}}>
      <div style={{display:"flex",fontSize:24,fontWeight:800,letterSpacing:2}}>DIGITAL OBSERVATORY</div>
      <div style={{display:"flex",flexDirection:"column",gap:18}}>
        <div style={{display:"flex",fontSize:64,fontWeight:900,lineHeight:1.02,maxWidth:950}}>Observe the digital world without losing the plot.</div>
        <div style={{display:"flex",fontSize:24,color:"#c8cfdb"}}>{SITE.description}</div>
      </div>
    </div>,
    size
  );
}