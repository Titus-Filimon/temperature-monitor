import './App.css';
import { useEffect, useState } from 'react';
import getData from './S3-Functions';
//import data from './data.json'; mock data
import Card from './Card';
import {BiRefresh} from 'react-icons/bi';

function App() {
  const [files, setFiles] = useState([]);
  const [refreshing, isRefreshing] = useState();
  const [timer, setTimer] = useState();

  useEffect(()=>{
    if(files === undefined || files === null || files.length < 1){
      handleRefresh();  
    }
  },[]);

  
  useEffect(()=>{
    if(timer > 0){
    setTimeout(() => {
      setTimer(val => val-1);
    }, 1000);
    }
    else
      isRefreshing(false);
  },[timer]);

  function renderDisplayCards(){
    return(
    <>
      <Card data={(files[0]?.tempF)?.toFixed(2)} dataLabel={"Temperature"}/> 
      <Card data={files[0]?.humidity} dataLabel={"Relative Humidity"}/>
    </>)
  }

  function refreshData(){
    getData().then(data=>
      {setFiles(data);});
  }
  
  function handleRefresh(){
    if(!refreshing){
      console.log("REFRESH DATA");
      isRefreshing(true);
      refreshData();
      setTimer(30);
    }
  }

  function formatUnixTimestamp(unixTimestamp) {
    if(!unixTimestamp){
      return `Loading...`;
    }
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
    const date = new Date(unixTimestamp * 1000);
    
    const dayOfWeek = daysOfWeek[date.getUTCDay()];
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = months[date.getUTCMonth()];
    const year = String(date.getUTCFullYear()).substring(2);
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');
    
    return `${dayOfWeek}, ${day}-${month}-${year} ${hours}:${minutes}:${seconds} UTC`;
  }
  
  return (
    <div className="App mx-2 lg:mx-[10vw] mt-[10vh]">
      <div className='flex flex-col gap-8'>
        <div className='flex flex-row justify-center items-center gap-3'>
        <div className='text-stone-200 font-bold text-xl md:text-2xl text-center'>
          DHT11 Temperature Monitor
        </div>
        <div className={`${timer > 0 ? '' : 'cursor-pointer'} bg-stone-900 rounded-lg flex justify-center items-center align-middle w-12 h-12`} onClick={handleRefresh}>
          { !refreshing ? 
          <BiRefresh className='text-3xl text-stone-200' />
          : <p className='text-xl text-stone-300'>{timer}</p>
          }
        </div>
        </div>
        
        {files ? <div className='text-stone-200 font-normal md:text-2xl text-center'>{formatUnixTimestamp(files[0]?.timestamp)}</div>
        : <></>
        }
        <div className='flex flex-col gap-10 justify-center items-center'>

        {files ? 
        renderDisplayCards()
        : <></>
        }
        </div>
      </div>
    </div>
  );
}

export default App;
