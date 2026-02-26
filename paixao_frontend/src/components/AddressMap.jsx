import { useState } from "react";
import styles from "./AddressMap.module.css";

export default function AddressMap({ onSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const searchAddress = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}, Angola`
      );
      const data = await response.json();
      setResults(data);
    } catch (err) {
      console.error("Erro ao buscar endereço", err);
    }
    setLoading(false);
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setSelectedId(null);
    onSelect(null);
  };

  return (
    <div className={styles.wrapperCard}>
      {/* Barra de pesquisa */}
      <div className={styles.searchRowCard}>
        <input
          type="text"
          placeholder="Buscar endereço em Angola"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={styles.inputCard}
        />

        <button
          type="button"
          onClick={searchAddress}
          className={styles.searchButtonCard}
        >
          {loading ? "..." : "Buscar"}
        </button>

        <button
          type="button"
          onClick={clearSearch}
          className={styles.clearButtonCard}
        >
          Limpar
        </button>
      </div>

      {/* Loader */}
      {loading && <div className={styles.loaderCard}></div>}

      {/* Resultados */}
      {results.length > 0 && (
        <div className={styles.resultsCard}>
          {results.map((place) => (
            <div
              key={place.place_id}
              className={`${styles.resultItemCard} ${
                selectedId === place.place_id ? styles.activeCard : ""
              }`}
              onClick={() => {
                setSelectedId(place.place_id);
                onSelect({
                  address: place.display_name,
                  lat: parseFloat(place.lat),
                  lon: parseFloat(place.lon),
                });
              }}
            >
              <span className={styles.iconCard}>📍</span>
              <span className={styles.textCard}>{place.display_name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}