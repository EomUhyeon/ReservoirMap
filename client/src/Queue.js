import { useState } from 'react';

function Queue() {
  const [queue, setQueue] = useState([]);

  const put = (item) => {
    setQueue((prevQueue) => [...prevQueue, item]);
  };

  const get = () => {
    if (queue.length > 0) {
      const firstItem = queue[0]; 
      setQueue(prevQueue => prevQueue.slice(1)); 
      return firstItem;
    }
    return null; 
  };

  const isEmpty = () => queue.length === 0;

  return { put, get, isEmpty, queue };
}

export default Queue;
