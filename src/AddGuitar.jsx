import EditGuitar from "./EditGuitar";

function AddGuitar() {
  return (
    <div className="max-w-screen-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Add New Guitar</h1>
      <EditGuitar mode="add" />
    </div>
  );
}

export default AddGuitar;