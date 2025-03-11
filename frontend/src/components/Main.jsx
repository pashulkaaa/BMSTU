import { useEffect, useState } from "react";
import { fetchAllTariffs, addTariff } from "../requests";

import TariffCard from "./ui/TariffCard";
import AddTariff from "./forms/AddTariff";
import AddServiceType from "./forms/AddServiceType"; 

export default function Main() {
  const [data, setData] = useState([]);
  const [shown, setShown] = useState(false);
  const [shownServiceType, setShownServiceType] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTariffs = async () => {
      try {
        setIsLoading(true);
        const res = await fetchAllTariffs();
        setData(res);
        setError(null);
      } catch (err) {
        setError("Failed to load tariffs. Please try again later.");
        console.error("Error loading tariffs:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadTariffs();
  }, []);

  const handleAddTariff = () => {
    setShown(true);
    setShownServiceType(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddServiceType = () => {
    setShownServiceType(true);
    setShown(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <div className="main-block-menu">
        <div className="menu-buttons">
          {!shown && (
            <button
              className="filed-button"
              onClick={handleAddTariff}
            >
              Добавить тариф
            </button>
          )}
          {!shownServiceType && (
            <button
              className="filed-button"
              onClick={handleAddServiceType}
            >
              Добавить тип услуги
            </button>
          )}
        </div>
      </div>

      <main className="main-block">
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {(shown || shownServiceType) && (
          <div className="main-block-form">
            {shown && <AddTariff setShown={setShown} requestFunction={addTariff} />}
            {shownServiceType && (
              <AddServiceType setShown={setShownServiceType} />
            )}
          </div>
        )}

        {isLoading ? (
          <div className="loading-spinner">Loading...</div>
        ) : (
          <div className="main-block-list">
            {data.map((element, index) => (
              <TariffCard 
                key={element.id || index} 
                data={element} 
                allTariffs={data}
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
