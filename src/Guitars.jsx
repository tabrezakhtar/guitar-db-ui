import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useGuitarContext } from "./context/GuitarContext";
import { getCombinedUrl } from "./imageUtils";

function Guitars() {
  const { equipment, loading, fetchEquipment, loadMore, page, totalEquipment } = useGuitarContext();

  useEffect(() => {
    fetchEquipment("guitar");
  }, [fetchEquipment]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Guitars</h1>
      <div className="guitar-list">
        {equipment.map((item) => (
          <div key={item.id} className="guitar-item">
            <Link to={`/guitars/${item.id}`}>
              <img src={getCombinedUrl(item.image)} alt={item.name} />
              <h2>{item.name}</h2>
            </Link>
          </div>
        ))}
      </div>
      {page * 10 < totalEquipment && (
        <button onClick={loadMore}>Load More</button>
      )}
    </div>
  );
}

export default Guitars;