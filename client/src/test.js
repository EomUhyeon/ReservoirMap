import React from 'react';

function CounterComponent({ put }) {
  const incrementZoom = () => {
    console.log("test click"); // 콘솔 출력
    put(1); // Queue에 1을 넣음 (zoom 증가값)
  };

  return (
    <div>
      <p>Click the button to increase zoom level:</p>
      <button onClick={incrementZoom}>Increase Zoom</button>
    </div>
  );
}

export default CounterComponent;
