"use client"
import {useState} from 'react'
import DropDown from '../components/DropDown';
import Process from '../components/Process';
import Fifo from '../components/Simulation/Fifo';
import Sjf from '../components/Simulation/Sjf'
import Rr from '../components/Simulation/Rr';
import Mlfq from '../components/Simulation/Mlfq';
import Cfs from '../components/Simulation/Cfs';

const algorithms=[
  {
    id:0,
    shortForm:"FIFO",
    title:"First In First Out",
    des:"This algorithem schedules processes in the order they arrive.The process that reaches the CPU queue first will run first.",
    realWorld: "Just like people standing in a queue at a billing counter,whoever comes first gets served first.",
    drawbacks:"A long process at the front can delay all other processes this delay is called the convoy effect.",
    input_req:["arrivalTime", "burstTime"],
    url:'https://pages.cs.wisc.edu/~remzi/OSTEP/cpu-sched.pdf'
  },
  {
    id:1,
    shortForm:"SJF",
    title:"Shortest Job First",
    des:"This algorithm picks the process with the shortest burst time(Total time taken by the Process to complete)first. It aims to minimize waiting time.",
    realWorld:"Like letting someone with least number of items checkout first so everyone gets through quicker.",
    drawbacks:"Long processes may starve if short ones keep arriving.",
    input_req:["arrivalTime", "burstTime"],
    url:'https://pages.cs.wisc.edu/~remzi/OSTEP/cpu-sched.pdf'
  },
  {
    id:2,
    shortForm:"RR",
    title:"Round Robin",
    des:"Each process gets a fixed time slice. After its turn, it goes to the back of the queue, ensuring fairness.",
    realWorld:"Like people taking turns while speaking in a meeting, each gets equal time before the next person talks.",
    drawbacks:"The performance depends heavily on the time quantum(time slice).A time slice too small causes overhead where as too large behaves like FIFO.",
    input_req:["arrivalTime", "burstTime", "timeQuantum"],
    url:'https://pages.cs.wisc.edu/~remzi/OSTEP/cpu-sched.pdf'
  },
  {
    id:3,
    shortForm:"MLFQ",
    title:"Multi Level Feedback Queue",
    des:"This algorithm uses multiple queues with different priorities. Processes move between queues based on how much CPU time they use, short or interactive tasks with higher priority.",
    realWorld:"Like at a hospital: emergency cases go first, regular patients wait, and critical cases can move up if their condition changes.",
    drawbacks:"Choosing the right rules (time slices, queue count, priority boost/penalty) is tricky. If not tuned well, low-priority processes may suffer starvation.",
    input_req:["arrivalTime", "burstTime", "priority"],
    url:'https://pages.cs.wisc.edu/~remzi/OSTEP/cpu-sched-mlfq.pdf'
  },
  {
  id:4,
  shortForm:"CFS",
  title:"Completely Fair Scheduler",
  des:"Each process gets CPU time based on its weight or priority. The goal is to share CPU time fairly among all processes.This algorithem is used in Linux",
  realWorld:"Like sharing a pizza based on hunger level — bigger appetite gets a bigger slice, but everyone gets some.",
  drawbacks:"Fairness doesn't always mean best performance. Some interactive tasks may feel slower.",
  input_req:["arrivalTime", "burstTime", "weight"],
  url:'https://pages.cs.wisc.edu/~remzi/OSTEP/cpu-sched-lottery.pdf'
}
]
const colors=['bg-blue-400','bg-violet-500', 'bg-amber-400','bg-red-500', 'bg-lime-400', 'bg-green-300', 'bg-rose-300','bg-slate-400' ]



 export default function Scheduling(){
  const [schedulingAlgo, setSchedulingAlgo]=useState(null);
  const [open,setOpen]=useState(false);
  const [processes,setProcesses]=useState([{id:0,arrival:0,burst:0,extra:0,color:''}]);
  const [arrivalTime, setArrivalTime]=useState(0);
  const [burstTime, setBurstTime]=useState(0);
  const [extraInfo, setExtraInfo]=useState(0);
  const [pid,setPid]=useState(1);
  const [selectedsim, setSelectedsim]=useState('');
  
  const inputTitles = {
  'arrivalTime': "Time at which the process arrives for execution.",
  'burstTime': "Total CPU time required by the process",
  'timeQuantum': "The fixed CPU time slice given to each process.",
  'weight': "Relative importance of the process in scheduling.",
  'priority': "Value that determines which process runs first.",
  };
  
  function addProcess(a, b, e=0){
    const usedColors = processes.map(p => p.color);
    const available = colors.filter(c => !usedColors.includes(c));

    const randomColor =
    available.length > 0
      ? available[Math.floor(Math.random() * available.length)]
      : colors[Math.floor(Math.random() * colors.length)]; 

    const newProcess={id:pid,arrival:a,burst:b, extra:e, color:randomColor}
    setProcesses(prev => [...prev, newProcess]);
    setPid(pid + 1);

    
  }
  function removeProcess(id){
      setProcesses(prev=>prev.filter(p=>
       p.id!==id
      ))
  }

  return(
    <div className='bg-black h-fit min-h-screen  text-white'>
    <div className='p-6 md:p-10'>
    <h1 className='text-white font-extrabold text-4xl flex align-middle justify-center'>Scheduling Algorithms </h1>
      <p className={`text-center text-gray-300 mx-auto mt-5 md:mt-4 mb-5 md:mb-4 max-w-4xl text-lg`}>
        Multiple processes run inside your computer, deciding the order in
        which they run is called <span className="font-semibold">Scheduling</span> <br/>
        <i className='text-sm'>Think of the CPU as a single cashier and processes as people waiting in line.Scheduling decides who gets served next.</i> </p>
      <div className=' flex justify-center '>
         <button onClick={()=>setOpen(!open)} className={`text-white relative border-2 border-white px-5 py-2 flex items-center justify-center rounded-4xl hover:bg-white hover:text-black w-50 max-w-50 z-50 ${open?'border-b-0 border-l-0 border-r-0':' '}`}>
          <span className=''>{schedulingAlgo ? schedulingAlgo.shortForm : "Choose Algorithm"}</span>
           <span className="ml-2 absolute right-4">⌄</span></button>
         {open && (
          <DropDown 
          list= {algorithms}
          parameter={schedulingAlgo}
          onSelect={(item)=>{
           setSchedulingAlgo(item)
            setOpen(!open)
          }
         
          }/>)}</div>
      {schedulingAlgo && (
        <div className="flex flex-col md:flex-row md:items-start gap-6 mx-2 my-5 md:m-2">
        <div className='w-full md:w-2/5'>
        <div className="border-white border-2 rounded-2xl  ">
    <div className="p-3 sm:p-4">
      <h2 className="text-xl sm:text-2xl font-bold mb-3">{schedulingAlgo.title}</h2>
      <p className="text-base sm:text-base mb-3">{schedulingAlgo.des}</p>
      <p className="text-base sm:text-base mb-3  italic">{schedulingAlgo.realWorld}</p>
      <p className="text-base sm:text-base mb-3"><b>Drawbacks: </b>{schedulingAlgo.drawbacks}</p>
      <p className="text-xs 2xs:text-base mb-3">
        Isn't it interesting?? <a target="_blank" href={schedulingAlgo.url}><u>Click me</u></a> to know more about this algorithm
      </p>
     </div>
      
  </div>
  <p className="text-[13px] [13px]:text-base max-w-lg mt-2">
        If you want to dig <b>deep</b> and unravel the mysteries of OS this book is for you:{" "}
        <a target="_blank" href="https://pages.cs.wisc.edu/~remzi/OSTEP/">
          <b>Operating Systems: Three Easy Pieces (OSTEP)</b>
        </a>
      </p>
  </div>
  <div className='w-full justify-center md:w-3/5'>
    <div className='flex flex-col justify-center md:flex-row md:items-start  m-2  gap-3'>
  <div className='flex flex-col justify-center md:justify-start md:w-3/4 gap-3'>
  <div className='flex flex-col mx-auto justify-center lg:flex-row lg:items-start lg:gap-4 gap-3'>
    <h1 className=' text-xl mt-3 mr-1'>Process:</h1>

   <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 ${
  schedulingAlgo.shortForm === 'FIFO' || schedulingAlgo.shortForm === 'SJF'
    ? 'lg:grid-cols-2'
    : 'lg:grid-cols-3'
}`}>

      {schedulingAlgo.input_req.map(i=> (
        <input 
          key={i}
           title={inputTitles[i]}
          onChange={(e)=>{

            if(i=='arrivalTime') setArrivalTime(e.target.value);
            else if(i=='burstTime')setBurstTime(e.target.value);
            else if( i=='timeQuantum'||i=='weight'|| i=='priority') setExtraInfo(e.target.value);
          }}
          className='border-2 border-gray-300 px-3 py-2 w-full md:min-w-auto max-w-fit min-w-xs rounded-md text-white'
          placeholder={i}
        />
      ))}
    </div>

    <button 
    title='add Process'
      onClick={()=>{addProcess(arrivalTime,burstTime,extraInfo)}} 
      className='border-2 max-h-10 min-h-10 max-w-fit border-gray-300 rounded-lg px-3 bg-gray-900 hover:bg-white hover:text-black'
    >
      Add
    </button>
  </div>

 <div className='flex justify-center'>
  <button  onClick={()=>setSelectedsim(schedulingAlgo.shortForm)} className='border-2 border-gray-200 px-4 py-2 rounded-4xl w-fit bg-black hover:bg-white hover:text-black'>
    Simulate
  </button>
  </div>
</div>
      <div className='border-2 border-gray-200 w-fit mx-auto rounded-2xl md:w-1/4 md:ml-4 min-h-6 max-h-fit'>
          <div className='p-5 flex flex-wrap flex-col justify-center'>
            <p className='text-center font-bold mb-1'> Processes</p>
             {schedulingAlgo.shortForm==='RR' &&
              <p className='text-white mb-1'>Time Quantum: {extraInfo}</p>
              }
           <Process p={processes} algorithm={schedulingAlgo} rmProcess={removeProcess}>
            </Process>
          </div>
        </div>
      
       
    </div>
    <div>
       {selectedsim === "FIFO"  && <Fifo np={processes} />}
        {selectedsim=='SJF' && <Sjf np={processes}></Sjf>}
        {selectedsim =='RR' && <Rr np={processes} timeQuantum={extraInfo}></Rr>}
        {selectedsim =='MLFQ' && <Mlfq></Mlfq> }
        {selectedsim == 'CFS' && <Cfs></Cfs>}
    </div>
    
  </div>

  </div>

  
   
  )
}
</div>
</div>
  )
}