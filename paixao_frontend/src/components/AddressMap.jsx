import { useState } from "react";
import styles from "./AddressMap.module.css";

export default function AddressMap({ onSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const searchAddress = async () => {
    if (!query) return;

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${query}, Angola`
    );

    const data = await response.json();
    setResults(data);
  };

  return (
    <div className={styles.container}>
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Buscar endereço em Angola"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={styles.input}
        />

        <button
          onClick={searchAddress}
          className={styles.button}
        >
          Buscar
        </button>
      </div>

      {results.map((place) => (
        <div
          key={place.place_id}
          className={styles.resultItem}
          onClick={() =>
            onSelect({
              address: place.display_name,
              lat: place.lat,
              lon: place.lon
            })
          }
        >
          {place.display_name}
        </div>
      ))}
    </div>
  );
}
