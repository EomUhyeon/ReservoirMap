import Queue from "./Queue.js";
import Map from "./map/map.js";
import Menu from "./menu/menu.js";

function App() {
  const searchQueue = Queue();

  return (
    <>
      <Map getSearch={searchQueue.get} isEmptySearch={searchQueue.isEmpty} />
      <Menu putSearch={searchQueue.put} />
    </>
  );
};

export default App;
