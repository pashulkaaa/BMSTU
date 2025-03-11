import { useState } from "react";
import { deleteTariff } from "../../requests";
import AddTariff from "../forms/AddTariff";
import AddService from "../forms/AddService";
import ServiceCard from "./ServiceCard";

export default function TariffCard({ data, allTariffs }) {
  const { tariff_id, tariff_code, tariff_name, services = [] } = data;

  const [editMode, setEditMode] = useState(false);
  const [addServiceMode, setAddServiceMode] = useState(false);

  const handleDelete = async () => {
    if (window.confirm(`Вы уверены, что хотите удалить тариф ${tariff_name}?`)) {
      try {
        await deleteTariff(tariff_id);
        window.location.reload();
      } catch (err) {
        alert("Ошибка при удалении тарифа");
        console.error(err);
      }
    }
  };

  return (
    <div className="card-block">
      {editMode ? (
        <AddTariff setShown={setEditMode} initialData={data} />
      ) : (
        <>
          <div className="card-block-title">
            <h2 className="card-block-title-name">
              {tariff_name} ({tariff_code})
            </h2>
            <div>
              <img
                src="/images/icon-edit.png"
                alt="Изменить"
                onClick={() => setEditMode(true)}
                className="card-block-title-edit-button"
              />
              <img
                src="/images/icon-remove.png"
                alt="Удалить"
                onClick={handleDelete}
                className="card-block-title-delete-button"
              />
            </div>
          </div>
          <div className="card-block-content">
            <div className="card-block-content-left-part">
              <div className="card-block-subitems">
                <h3>Услуги в тарифе:</h3>
                {services.length === 0 && <div>Нет добавленных услуг</div>}
                <div className="card-block-subitems-list">
                  {services.map((srv) => (
                    <ServiceCard
                      key={srv.service_id}
                      data={srv}
                      parentTariffId={tariff_id}
                      allTariffs={allTariffs}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="card-block-content-right-part">
              {addServiceMode ? (
                <AddService
                  setShown={setAddServiceMode}
                  parentTariffId={tariff_id}
                />
              ) : (
                <div className="buttons-block">
                  <button
                    className="unfiled-button card-block-title-add-button"
                    onClick={() => setAddServiceMode(true)}
                  >
                    Добавить услугу
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
