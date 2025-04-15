import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useGuitarContext } from "./context/GuitarContext";
import { getCombinedUrl } from "./imageUtils";

function Guitars() {
  const { guitars, loading, fetchGuitars, loadMore, page, totalGuitars } = useGuitarContext();

  useEffect(() => {
    fetchGuitars();
  }, [fetchGuitars]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Guitars</h1>
      <div className="guitar-list">
        {guitars.map((guitar) => (
          <div key={guitar.id} className="guitar-item">
            <Link to={`/guitars/${guitar.id}`}>
              <img src={getCombinedUrl(guitar.image)} alt={guitar.name} />
              <h2>{guitar.name}</h2>
            </Link>
          </div>
        ))}
      </div>
      {page * 10 < totalGuitars && (
        <button onClick={loadMore}>Load More</button>
      )}
    </div>
  );
}

export default Guitars;