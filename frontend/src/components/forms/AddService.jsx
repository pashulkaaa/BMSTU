import { useEffect, useState } from "react";
import { getServiceTypes, addService } from "../../requests";

export default function AddService({ setShown, parentTariffId }) {
  const [newData, setNewData] = useState({
    service_code: "",
    service_type_id: "",
    param_value: "",
    param_unit: "",
    tariff_id: parentTariffId,
  });

  const [typesList, setTypesList] = useState([]);

  useEffect(() => {
    getServiceTypes().then((data) => setTypesList(data));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newData.param_value <= 0) {
      alert("Значение параметра не может быть отрицательным или нулевым.");
      return;
    }

    try {
      await addService(newData);
      setShown(false);
      window.location.reload();
    } catch (error) {
      alert("Ошибка при добавлении услуги. Возможно, услуга с таким типом уже есть в тарифе.");
      console.error(error);
    }
  };

  return (
    <div className="form-block">
      <h2>Добавление услуги</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-input-block">
          <label>Код услуги (неизменяемое поле):</label>
          <input
            name="service_code"
            type="text"
            value={newData.service_code}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-select-block">
          <label>Тип услуги:</label>
          <select
            name="service_type_id"
            value={newData.service_type_id}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              --Выберите тип--
            </option>
            {typesList.map((el) => (
              <option key={el.service_type_id} value={el.service_type_id}>
                {el.service_type_name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-input-block">
          <label>Значение параметра:</label>
          <input
            name="param_value"
            type="number"
            value={newData.param_value}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-input-block">
          <label>Ед. измерения (например, "ГБ", "мин."):</label>
          <input
            name="param_unit"
            type="text"
            value={newData.param_unit}
            onChange={handleChange}
            required
          />
        </div>

        <div className="buttons-block">
          <button className="grey-button" type="button" onClick={() => setShown(false)}>
            Отменить
          </button>
          <button className="filed-button" type="submit">
            Добавить
          </button>
        </div>
      </form>
    </div>
  );
}
