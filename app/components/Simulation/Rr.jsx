import React from "react";

export default function RR({ np = [], timeQuantum }) {

  if (!np || !Array.isArray(np)) return <div>No processes</div>;
  if (!timeQuantum || timeQuantum === "0")
    return <div>Please enter time quantum</div>;

  const tq = Number(timeQuantum);

  const processes = np
    .map(p => ({
      id: p.id,
      arrival: Number(p.arrival) || 0,
      burst: Number(p.burst) || 0,
      color: p.color || "bg-gray-500"
    }))
    .sort((a, b) => a.arrival - b.arrival);

  let time = 0;
  let completed = [];
  let queue = [];
  let i = 0; 

  
  if (processes.length > 0) {
    if (processes[0].arrival > 0) {
      completed.push({
        id: "idle",
        start: 0,
        end: processes[0].arrival,
        burst: processes[0].arrival,
        color: "bg-gray-300"
      });
      time = processes[0].arrival;
    }
    queue.push({ ...processes[0] });
    i = 1;
  }


  while (queue.length > 0) {

    const p = queue.shift();

  
    if (p.arrival > time) {
      completed.push({
        id: "idle",
        start: time,
        end: p.arrival,
        burst: p.arrival - time,
        color: "bg-gray-300"
      });
      time = p.arrival;
    }


    const slice = Math.min(p.burst, tq);

    completed.push({
      ...p,
      start: time,
      end: time + slice,
      burst: slice
    });

    time += slice;

 
    while (i < processes.length && processes[i].arrival <= time) {
      queue.push({ ...processes[i] });
      i++;
    }

  
    if (p.burst > slice) {
      queue.push({
        ...p,
        burst: p.burst - slice,
        arrival: time 
      });
    }

    
    if (queue.length === 0 && i < processes.length) {
     
      const nextArrival = processes[i].arrival;
      completed.push({
        id: "idle",
        start: time,
        end: nextArrival,
        burst: nextArrival - time,
        color: "bg-gray-300"
      });
      time = nextArrival;

     
      queue.push({ ...processes[i] });
      i++;
    }
  }

 
  const totalTime = completed.reduce((a, p) => a + p.burst, 0);

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex h-20 min-w-[600px]">

        {completed.map((p, idx) => {
          const pct = (p.burst / totalTime) * 100;

          return (
            <div
              key={idx}
              title={
                p.id === "idle"
                  ? `Idle: ${p.start} - ${p.end}`
                  : `P${p.id}: ${p.start} - ${p.end}`
              }
              style={{ width: `${pct}%` }}
              className={`h-20 rounded-sm flex items-center justify-center text-black ${p.color}`}
            >
              {p.id !== "idle" && (
                <span className="text-xs font-semibold truncate px-1">P{p.id}</span>
              )}
            </div>
          );
        })}

      </div>

      <div className="mt-2 text-xs text-gray-400">
        Total timeline length: {totalTime}
      </div>
    </div>
  );
}
