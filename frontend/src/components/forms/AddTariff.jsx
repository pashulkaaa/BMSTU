import React, { useState } from 'react';
import { addTariff, updateTariff } from '../../requests'; // ваши функции запросов

export default function AddTariff({ setShown, initialData = {} }) {
  const { tariff_id, tariff_code, tariff_name } = initialData;

  const [newData, setNewData] = useState({
    tariff_code: tariff_code || '',
    tariff_name: tariff_name || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (tariff_id) {
        // Редактирование существующего тарифа
        await updateTariff(tariff_id, { tariff_name: newData.tariff_name });
      } else {
        // Добавление нового тарифа
        // tariff_code и tariff_name
        await addTariff(newData);
      }
      setShown(false);
      window.location.reload();
    } catch (error) {
      alert('Ошибка при сохранении тарифа');
      console.error(error);
    }
  };

  return (
    <div className="form-block">
      <h2>{tariff_id ? 'Редактирование тарифа' : 'Добавление тарифа'}</h2>
      <form onSubmit={handleSubmit}>
        {!tariff_id && ( // Код тарифа редактируем/задаём только при создании
          <div className="form-input-block">
            <label>Код тарифа (неизменяемое поле):</label>
            <input
              name="tariff_code"
              type="text"
              value={newData.tariff_code}
              onChange={handleChange}
              required
            />
          </div>
        )}
        <div className="form-input-block">
          <label>Название тарифа:</label>
          <input
            name="tariff_name"
            type="text"
            value={newData.tariff_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="buttons-block">
          <button className="grey-button" type="button" onClick={() => setShown(false)}>
            Отменить
          </button>
          <button className="filed-button" type="submit">
            {tariff_id ? 'Сохранить' : 'Добавить'}
          </button>
        </div>
      </form>
    </div>
  );
}
