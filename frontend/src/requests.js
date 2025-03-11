// ---------- Адрес сервера ----------
const URL = "http://localhost:3001";

// ---------- Запрос на получение всех тарифов (без коллбэка setData) ----------
export const fetchAllTariffs = async () => {
  try {
    const response = await fetch(`${URL}/tariffs`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Ошибка при получении тарифов");
    }

    // Возвращаем данные, а не вызываем setData
    const data = await response.json();
    return data; 
  } catch (error) {
    console.error("Ошибка при загрузке тарифов:", error.message);
    alert("Ошибка при загрузке тарифов: " + error.message);
    // Бросаем ошибку, чтобы вызвать .catch() в вызывающем коде
    throw error;
  }
};

// ---------- Запрос на добавление тарифа ----------
export const addTariff = async (data) => {
  try {
    const response = await fetch(`${URL}/tariffs/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Ошибка при добавлении тарифа");
    }

    alert("Тариф успешно добавлен!");
    return await response.json(); // Можно вернуть что-то, если сервер шлёт { message: "...", tariff_id: ... }
  } catch (error) {
    console.error("Ошибка:", error.message);
    alert("Ошибка при добавлении тарифа: " + error.message);
    throw error;
  }
};

// ---------- Запрос на обновление данных о тарифе ----------
export const updateTariff = async (id, data) => {
  try {
    const response = await fetch(`${URL}/tariffs/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data), 
    });

    if (!response.ok) {
      throw new Error("Ошибка при обновлении данных тарифа");
    }

    alert("Данные о тарифе успешно обновлены!");
    return await response.json();
  } catch (error) {
    console.error("Ошибка:", error.message);
    alert("Ошибка при обновлении тарифа: " + error.message);
    throw error;
  }
};

// ---------- Запрос на удаление тарифа ----------
export const deleteTariff = async (id) => {
  try {
    const response = await fetch(`${URL}/tariffs/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Ошибка при удалении тарифа");
    }

    const result = await response.json();
    // В result обычно { message: "...", ... } — можно вернуть
    return result; 
  } catch (error) {
    console.error("Ошибка:", error.message);
    alert("Ошибка при удалении тарифа: " + error.message);
    throw error;
  }
};

// ---------- Запрос на получение всех типов услуг ----------
export const getServiceTypes = async () => {
  try {
    const response = await fetch(`${URL}/service-types`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Ошибка при получении типов услуг");
    }

    const data = await response.json();
    return data; 
  } catch (error) {
    console.error("Ошибка при загрузке типов услуг:", error.message);
    alert("Ошибка при загрузке типов услуг: " + error.message);
    throw error;
  }
};

// ---------- Запрос на добавление типа услуги ----------
export const addServiceType = async (data) => {
  try {
    const response = await fetch(`${URL}/service-types/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Ошибка при добавлении типа услуги");
    }

    alert("Тип услуги успешно добавлен!");
    return await response.json();
  } catch (error) {
    console.error("Ошибка:", error.message);
    alert("Ошибка при добавлении типа услуги: " + error.message);
    throw error;
  }
};

// ---------- Запрос на добавление услуги в тариф ----------
export const addService = async (data) => {
  try {
    const response = await fetch(`${URL}/services/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Ошибка при добавлении услуги");
    }

    alert("Услуга успешно добавлена!");
    return await response.json();
  } catch (error) {
    console.error("Ошибка:", error.message);
    alert("Ошибка при добавлении услуги: " + error.message);
    throw error;
  }
};

// ---------- Запрос на удаление услуги ----------
export const deleteService = async (id) => {
  try {
    const response = await fetch(`${URL}/services/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Ошибка при удалении услуги");
    }

    const result = await response.json();
    return result; 
  } catch (error) {
    console.error("Ошибка:", error.message);
    alert("Ошибка при удалении услуги: " + error.message);
    throw error;
  }
};

// ---------- Запрос на перенос услуги между тарифами ----------
export const moveService = async (id, data) => {
  try {
    const response = await fetch(`${URL}/services/move/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Ошибка при переносе услуги");
    }

    alert("Услуга успешно перенесена в другой тариф!");
    return await response.json();
  } catch (error) {
    console.error("Ошибка:", error.message);
    alert("Ошибка при переносе услуги: " + error.message);
    throw error;
  }
};
