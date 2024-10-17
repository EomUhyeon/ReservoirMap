import Queue from "./Queue.js";
import Map from "./map/map_241015_001.js";
import MapUploader from "./map/map.js";
import CounterComponent from "./test.js"


function App() {
  const testQueue = Queue();

  return (
    <>
      <Map />
      {/* <MapUploader get={testQueue.get} />
      <CounterComponent put={testQueue.put} /> */}
    </>
  );
};


export default App;
