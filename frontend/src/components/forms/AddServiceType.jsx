import React, { useState, useEffect } from 'react';
import { getServiceTypes, addServiceType } from '../../requests';

export default function AddServiceType({ setShown }) {
  const [service_type_name, setName] = useState('');
  const [typesList, setTypesList] = useState([]);

  useEffect(() => {
    getServiceTypes().then((data) => setTypesList(data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Проверка на дубликат по названию (примерная логика):
    const exists = typesList.some(
      (t) => t.service_type_name.toLowerCase() === service_type_name.toLowerCase()
    );
    if (exists) {
      alert('Тип услуги с таким названием уже существует.');
      return;
    }

    try {
      await addServiceType({ service_type_name });
      setShown(false);
      window.location.reload();
    } catch (error) {
      alert('Ошибка при добавлении типа услуги');
      console.error(error);
    }
  };

  return (
    <div className="form-block">
      <h2>Добавление типа услуги</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-input-block">
          <label>Название типа:</label>
          <input
            type="text"
            value={service_type_name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="buttons-block">
          <button className="grey-button" onClick={() => setShown(false)}>
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
