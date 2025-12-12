import React from "react";

function Sjf({ np = [] }) {
  const normalized = (Array.isArray(np) ? np : [])
    .map((p) => ({
      id: p.id,
      arrival: Number(p.arrival) || 0,
      burst: Number(p.burst) || 0,
      extra: p.extra !== undefined ? p.extra : 0,
      color: typeof p.color === "string" && p.color.length ? p.color : "bg-gray-500",
    }))
    .filter((p) => p.id !== 0);

  if (normalized.length === 0) {
    return <div className="text-sm text-gray-400">No processes to simulate</div>;
  }


  const sorted = [...normalized].sort((a, b) => a.arrival - b.arrival);
  let currentTime = sorted[0].arrival;
  let completed = [];
  let pending =[];
  let i=0;
  completed.push(sorted[0]);
  currentTime+=sorted[0].burst;
  i=1;

  while(completed.length< sorted.length){
    while(i<sorted.length && sorted[i].arrival<=currentTime){
        pending.push(sorted[i]);
        i++;
    }
    if(pending.length===0){
        completed.push(sorted[i]);
        i++;
        currentTime=sorted[i].arrival+ sorted[i].burst;
    }
    pending.sort((a,b)=>a.burst- b.burst);
     next=pending.shift();
    completed.push(next);

    currentTime +=next.burst;
  }
  let t = 0;
  let totalTime=0;

const timeline = completed.map(p => {
  const start = Math.max(t, p.arrival);
  const gap = start - t;    
  const end = start + p.burst;

 
  t = end;
  totalTime+=t;
  return {
    ...p,
    start,
    end,
    gap,
    
  };
});


 
  return (
    <div className="w-full overflow-x-auto">
      <div className="relative w-full min-w-[600px] h-20 "> 
        <div className="absolute left-0 top-0 bottom-0 flex" style={{ width: "100%" }}>
          {timeline.map((s, idx) => {
           
            const gapPct = (s.gap / totalTime) * 100;
            const barPct = (s.burst / totalTime) * 100;
           
            return (
              <React.Fragment key={`${s.id}-${idx}`}>
                {s.gap > 0 && (
                  <div
                    title={`Idle: ${s.start - s.gap} - ${s.start}`}

                    style={{ width: `${gapPct}%` }}
                    className="h-20 rounded-sm  bg-gray-300"
                    
                  />
                )}
                   
                <div
                  title={`P${s.id}: ${s.start} - ${s.end}`}
                  style={{ width: `${barPct}%` }}
                  className={`h-20 rounded-sm flex items-center justify-center text-black ${s.color}`}
                >
                  <span className="text-xs font-semibold truncate px-1">P{s.id}</span>
                </div>
                
              </React.Fragment>
             
            );
          })}
        </div>
      </div>
          
      
      <div className="mt-2 text-xs text-gray-400">
        Timeline length: <b>{totalTime}</b>.
      </div>
    </div>
  );
}

export default Sjf;
