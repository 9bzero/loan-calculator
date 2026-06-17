import{useState,useMemo}from'react'
  const fmt=(n:number)=>n.toLocaleString("en-US",{style:"currency",currency:"USD",minimumFractionDigits:0})
  export default function App(){
    const[principal,setPrincipal]=useState(200000)
    const[rate,setRate]=useState(5.5)
    const[years,setYears]=useState(30)
    const{emi,totalPayment,totalInterest,schedule}=useMemo(()=>{
      const r=rate/(100*12),n=years*12
      const emi=r===0?principal/n:principal*(r*Math.pow(1+r,n))/(Math.pow(1+r,n)-1)
      let balance=principal
      const schedule=[]
      for(let m=1;m<=Math.min(n,24);m++){
        const interest=balance*r;const principal2=emi-interest;balance-=principal2
        schedule.push({m,payment:emi,interest,principal:principal2,balance:Math.max(0,balance)})
      }
      return{emi,totalPayment:emi*n,totalInterest:emi*n-principal,schedule}
    },[principal,rate,years])
    const SLIDERS=[{l:"Loan Amount",v:principal,set:setPrincipal,min:10000,max:1000000,step:5000,fmt:fmt},{l:"Annual Rate (%)",v:rate,set:setRate,min:0.5,max:20,step:0.1,fmt:(v:number)=>v.toFixed(1)+"%"},{l:"Loan Term (years)",v:years,set:setYears,min:1,max:30,step:1,fmt:(v:number)=>v+"yr"}]
    const ipct=totalInterest/(totalInterest+principal)*100
    return(
      <div style={{minHeight:"100vh",fontFamily:"Inter,system-ui,sans-serif",color:"#e2e8f0",padding:"2rem"}}>
        <div style={{maxWidth:900,margin:"0 auto"}}>
          <h1 style={{fontWeight:800,fontSize:"1.75rem",marginBottom:"1.5rem",color:"#f8fafc"}}>🏦 Loan Calculator</h1>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1.5rem",marginBottom:"1.5rem"}}>
            <div style={{background:"#111827",border:"1px solid #1e293b",borderRadius:12,padding:"1.5rem",display:"flex",flexDirection:"column",gap:"1.25rem"}}>
              {SLIDERS.map(({l,v,set,min,max,step,fmt:f})=>(
                <div key={l}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:"0.4rem",fontSize:"0.85rem"}}>
                    <span style={{color:"#94a3b8"}}>{l}</span><span style={{color:"#38bdf8",fontWeight:700}}>{f(v)}</span>
                  </div>
                  <input type="range" min={min} max={max} step={step} value={v} onChange={e=>set(+e.target.value)} style={{width:"100%",accentColor:"#38bdf8"}}/>
                </div>
              ))}
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:"1rem"}}>
              <div style={{background:"#111827",border:"1px solid #1e293b",borderRadius:12,padding:"1.5rem"}}>
                <div style={{color:"#94a3b8",fontSize:"0.8rem",marginBottom:"0.5rem"}}>MONTHLY PAYMENT</div>
                <div style={{fontWeight:900,fontSize:"2.2rem",color:"#38bdf8"}}>{fmt(emi)}</div>
              </div>
              {[{l:"Total Payment",v:totalPayment,c:"#f1f5f9"},{l:"Total Interest",v:totalInterest,c:"#ef4444"},{l:"Principal",v:principal,c:"#22c55e"}].map(({l,v,c})=>(
                <div key={l} style={{background:"#111827",border:"1px solid #1e293b",borderRadius:10,padding:"1rem",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{color:"#94a3b8",fontSize:"0.85rem"}}>{l}</span>
                  <span style={{fontWeight:700,color:c}}>{fmt(v)}</span>
                </div>
              ))}
              <div style={{background:"#111827",border:"1px solid #1e293b",borderRadius:10,padding:"1rem"}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.8rem",marginBottom:"0.5rem"}}>
                  <span style={{color:"#22c55e"}}>Principal {(100-ipct).toFixed(0)}%</span>
                  <span style={{color:"#ef4444"}}>Interest {ipct.toFixed(0)}%</span>
                </div>
                <div style={{height:8,background:"#ef4444",borderRadius:4,overflow:"hidden"}}>
                  <div style={{height:"100%",background:"#22c55e",width:(100-ipct)+"%"}}/>
                </div>
              </div>
            </div>
          </div>
          <div style={{background:"#111827",border:"1px solid #1e293b",borderRadius:12,overflow:"hidden"}}>
            <div style={{padding:"0.75rem 1.25rem",borderBottom:"1px solid #1e293b",fontWeight:700,color:"#94a3b8",fontSize:"0.78rem",letterSpacing:"0.05em"}}>AMORTIZATION SCHEDULE (first 24 months)</div>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead><tr style={{borderBottom:"1px solid #1e293b"}}>{["Mo","Payment","Principal","Interest","Balance"].map(h=><th key={h} style={{padding:"0.5rem 0.75rem",color:"#475569",fontSize:"0.75rem",fontWeight:600,textAlign:"right",whiteSpace:"nowrap"}}>{h}</th>)}</tr></thead>
                <tbody>{schedule.map(r=>(
                  <tr key={r.m} style={{borderBottom:"1px solid #0f172a"}}>
                    <td style={{padding:"0.4rem 0.75rem",textAlign:"right",color:"#475569",fontSize:"0.8rem"}}>{r.m}</td>
                    <td style={{padding:"0.4rem 0.75rem",textAlign:"right",color:"#f1f5f9",fontSize:"0.8rem"}}>{fmt(r.payment)}</td>
                    <td style={{padding:"0.4rem 0.75rem",textAlign:"right",color:"#22c55e",fontSize:"0.8rem"}}>{fmt(r.principal)}</td>
                    <td style={{padding:"0.4rem 0.75rem",textAlign:"right",color:"#ef4444",fontSize:"0.8rem"}}>{fmt(r.interest)}</td>
                    <td style={{padding:"0.4rem 0.75rem",textAlign:"right",color:"#94a3b8",fontSize:"0.8rem"}}>{fmt(r.balance)}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    )
  }