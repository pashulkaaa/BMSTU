const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Подключение к базе данных
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'qwertyQwerty123',
    database: 'mobile_operator'
});

db.connect((err) => {
    if (err) {
        console.error('Ошибка подключения к базе данных:', err);
        return;
    }
    console.log('Подключение к базе данных успешно!');
});

app.get('/', (req, res) => {
    res.send('Сервер тарифов работает!');
});



app.get('/tariffs', (req, res) => {

    const sql = `
        SELECT 
            t.tariff_id,
            t.tariff_code,
            t.tariff_name,
            s.service_id,
            s.service_code,
            s.param_value,
            s.param_unit,
            st.service_type_id,
            st.service_type_name
        FROM tariffs t
        LEFT JOIN services s ON t.tariff_id = s.tariff_id
        LEFT JOIN service_types st ON s.service_type_id = st.service_type_id
        ORDER BY t.tariff_id, s.service_id
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Ошибка при получении тарифов:', err);
            return res.status(500).json({ error: 'Ошибка при получении данных', details: err });
        }

        const tariffs = {};

        results.forEach(row => {
            const {
                tariff_id,
                tariff_code,
                tariff_name,
                service_id,
                service_code,
                param_value,
                param_unit,
                service_type_id,
                service_type_name
            } = row;

            if (!tariffs[tariff_id]) {
                tariffs[tariff_id] = {
                    tariff_id,
                    tariff_code,
                    tariff_name,
                    services: []
                };
            }

            if (service_id) {
                // Добавляем услугу к тарифу
                tariffs[tariff_id].services.push({
                    service_id,
                    service_code,
                    service_type_id,
                    service_type_name,
                    param_value,
                    param_unit
                });
            }
        });

        res.json(Object.values(tariffs));
    });
});

// Добавление нового тарифа
app.post('/tariffs/add', (req, res) => {
    const { tariff_code, tariff_name } = req.body;

    if (!tariff_code || !tariff_name) {
        return res.status(400).json({ error: 'Необходимо указать tariff_code и tariff_name' });
    }

    const sql = 'INSERT INTO tariffs (tariff_code, tariff_name) VALUES (?, ?)';
    db.query(sql, [tariff_code, tariff_name], (err, result) => {
        if (err) {
            console.error('Ошибка при добавлении тарифа:', err);
            return res.status(500).json({ error: 'Ошибка при добавлении тарифа', details: err });
        }
        res.status(201).json({ message: 'Тариф успешно добавлен', tariff_id: result.insertId });
    });
});







// Редактирование тарифа
app.put('/tariffs/update/:tariff_id', (req, res) => {
    const { tariff_id } = req.params;
    const { tariff_name } = req.body;
    
    // tariff_code нельзя менять
    if (!tariff_name) {
        return res.status(400).json({ error: 'Необходимо указать tariff_name для обновления' });
    }

    const sql = 'UPDATE tariffs SET tariff_name = ? WHERE tariff_id = ?';
    db.query(sql, [tariff_name, tariff_id], (err, result) => {
        if (err) {
            console.error('Ошибка при обновлении тарифа:', err);
            return res.status(500).json({ error: 'Ошибка при обновлении тарифа', details: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Тариф с таким ID не найден' });
        }
        res.status(200).json({ message: 'Тариф успешно обновлён' });
    });
});

// Удаление тарифа
app.delete('/tariffs/delete/:tariff_id', (req, res) => {
    const { tariff_id } = req.params;

    const sql = 'DELETE FROM tariffs WHERE tariff_id = ?';
    db.query(sql, [tariff_id], (err, result) => {
        if (err) {
            console.error('Ошибка при удалении тарифа:', err);
            return res.status(500).json({ error: 'Ошибка при удалении тарифа', details: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Тариф с таким ID не найден' });
        }

        res.status(200).json({ message: 'Тариф успешно удалён' });
    });
});



// Получение всех типов услуг
app.get('/service-types', (req, res) => {
    const sql = 'SELECT * FROM service_types ORDER BY service_type_id';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Ошибка при получении типов услуг:', err);
            return res.status(500).json({ error: 'Ошибка при получении данных', details: err });
        }
        res.json(results);
    });
});

// Добавление нового типа услуги
app.post('/service-types/add', (req, res) => {
    const { service_type_name } = req.body;

    if (!service_type_name) {
        return res.status(400).json({ error: 'Необходимо указать название типа услуги' });
    }

    const sql = 'INSERT INTO service_types (service_type_name) VALUES (?)';
    db.query(sql, [service_type_name], (err, result) => {
        if (err) {
            console.error('Ошибка при добавлении типа услуги:', err);
            return res.status(500).json({ error: 'Ошибка при добавлении типа услуги', details: err });
        }
        res.status(201).json({ message: 'Тип услуги успешно добавлен', service_type_id: result.insertId });
    });
});



// Добавление новой услуги в конкретный тариф
app.post('/services/add', (req, res) => {
    const { service_code, tariff_id, service_type_id, param_value, param_unit } = req.body;

    if (!service_code || !tariff_id || !service_type_id || !param_value || !param_unit) {
        return res.status(400).json({ 
            error: 'Необходимо указать service_code, tariff_id, service_type_id, param_value, param_unit'
        });
    }

    const sql = `
        INSERT INTO services (service_code, tariff_id, service_type_id, param_value, param_unit)
        VALUES (?, ?, ?, ?, ?)
    `;
    db.query(sql, [service_code, tariff_id, service_type_id, param_value, param_unit], (err, result) => {
        if (err) {
            console.error('Ошибка при добавлении услуги:', err);
            return res.status(500).json({ error: 'Ошибка при добавлении услуги', details: err });
        }
        res.status(201).json({ message: 'Услуга успешно добавлена в тариф', service_id: result.insertId });
    });
});

// Удаление услуги
app.delete('/services/delete/:service_id', (req, res) => {
    const { service_id } = req.params;

    const sql = 'DELETE FROM services WHERE service_id = ?';
    db.query(sql, [service_id], (err, result) => {
        if (err) {
            console.error('Ошибка при удалении услуги:', err);
            return res.status(500).json({ error: 'Ошибка при удалении услуги', details: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Услуга с таким ID не найдена' });
        }

        res.status(200).json({ message: 'Услуга успешно удалена' });
    });
});

app.put('/services/move/:service_id', (req, res) => {
    const { service_id } = req.params;
    const { new_tariff_id } = req.body;

    if (!service_id || !new_tariff_id) {
        return res.status(400).json({ error: 'Пожалуйста, укажите service_id и new_tariff_id' });
    }

    // Проверка существования услуги
    const checkSql = 'SELECT * FROM services WHERE service_id = ?';
    db.query(checkSql, [service_id], (err, results) => {
        if (err) {
            console.error('Ошибка при поиске услуги:', err);
            return res.status(500).json({ error: 'Ошибка при поиске услуги', details: err });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Услуга с таким ID не найдена' });
        }

        // Проверка существования нового тарифа
        const checkTariffSql = 'SELECT * FROM tariffs WHERE tariff_id = ?';
        db.query(checkTariffSql, [new_tariff_id], (err, tariffResults) => {
            if (err) {
                console.error('Ошибка при поиске тарифа:', err);
                return res.status(500).json({ error: 'Ошибка при поиске тарифа', details: err });
            }

            if (tariffResults.length === 0) {
                return res.status(404).json({ error: 'Тариф с указанным ID не найден' });
            }

            // Обновление тарифа услуги
            const transferSql = 'UPDATE services SET tariff_id = ? WHERE service_id = ?';
            db.query(transferSql, [new_tariff_id, service_id], (err, updateResult) => {
                if (err) {
                    console.error('Ошибка при переносе услуги:', err);
                    return res.status(500).json({ error: 'Ошибка при переносе услуги', details: err });
                }
                if (updateResult.affectedRows === 0) {
                    return res.status(404).json({ error: 'Услуга с указанным ID не найдена' });
                }
                res.status(200).json({ message: 'Услуга успешно перенесена в другой тариф' });
            });
        });
    });
});


// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});
