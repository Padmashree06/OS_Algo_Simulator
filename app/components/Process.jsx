import React from 'react'

function Process({ p = [], algorithm, rmProcess }) {
  return (
    <div className="space-y-4">
      {p.map(process => (
        process.id !== 0 && (
         
  <div 
  key={process.id} 
  className="flex flex-col justify-center w-full max-w-50 mb-2 overflow-hidden">
  
  <div className="flex items-center justify-between mx-auto w-full">
    <div className="flex items-center gap-2 mx-auto md:mx-0 min-w-0">
      <div className={`w-3 h-3 rounded-full ${process.color}`}></div>
      <p className="truncate ">Process {process.id}</p>
    </div>

    <p
      title='remove process' 
      onClick={() => rmProcess(process.id)} 
      className="text-red-400 cursor-pointer ml-2"
    >
      x
    </p>
  </div>

 
  <div className="flex flex-wrap gap-x-3 gap-y-1 mx-auto text-sm mt-1">

    
    <span>Arrival: {process.arrival}</span>
    <span>Burst: {process.burst}</span>

    {process.extra !== 0 && (algorithm.input_req[2]!=='timeQuantum' &&
      <span>{algorithm.input_req[2]}: {process.extra}</span>)
    }
     

  </div>
</div>

)
      ))}
    </div>
  );
}

export default Process;
