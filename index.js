const express = require('express');
const pool = require('./db');
const app = express();
const PORT = 2000;
app.use(express.json());

app.get('/User', (req, res) => {
    res.status(200);
    res.send("Pruebas para consumo de la api")
    console.log("entraron")
});

app.post('/inicio', (req, res) => {
    const { usuario, contrasena } = req.body;
    const usuarioValido = usuarios.find(u => u.Usuario === usuario && u.Password === contrasena);

    if (usuarioValido) {
        res.status(200).json({ message: `¡Bienvenido, ${usuario}!` });
    } else {
        res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
    }
});
    app.post('/registro', (req, res) => {
        const { nombre, usuario, contrasena } = req.body;
        res.status(200).json({ nombre, usuario, contrasena });
    });

const usuarios = [
    { id: '1',Usuario: 'martina1', Password: 'cepillo123' },
    {id: '2', Usuario: 'martin34', Password: 'mantequilla456' },
    {id: '3', Usuario: 'pancho98', Password: 'molotov789' },
  ];
  
 
app.get('/usuarios', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM usuarios');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});
 

app.put('/usuarios/:id', (req, res) => {
  const { id } = req.params;
  const { usuario, nombre } = req.body;

  if (!usuario || !nombre) {
      return res.status(400).json({ mensaje: 'Usuario y nombre son requeridos.' });
  }

  const query = 'UPDATE usuarios SET usuario = $1, nombre = $2 WHERE id = $3';
  pool.query(query, [usuario, nombre, id], (err, result) => {
      if (err) {
          console.error('Error ejecutando la consulta:', err);
          return res.status(500).json({ mensaje: 'Error interno en el servidor.' });
      }

      if (result.rowCount === 0) {
          return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
      }

      res.status(200).json({ mensaje: 'Usuario y nombre actualizados exitosamente.' });
  });
});


app.delete('/usuarios/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM usuarios WHERE id = $1';
  pool.query(query, [id], (err, result) => {
      if (err) {
          console.error('Error ejecutando la consulta:', err);
          return res.status(500).json({ mensaje: 'Error interno en el servidor.' });
      }

      if (result.rowCount === 0) {
          return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
      }

      res.status(200).json({ mensaje: 'Usuario eliminado exitosamente.' });
  });
});

//metodo de la tabla de instrumentos
app.get('/instrumentos', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM instrumento');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/instrumentos', async (req, res) => {
  const { id, nombre, tipo } = req.body;

  try {
    const [result] = await pool.query(
      'INSERT INTO instrumento (id, nombre, tipo) VALUES (?, ?, ?)',
      [id, nombre, tipo]
    );
    res.status(201).json({ mensaje: 'Instrumento creado', id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});


app.put('/instrumentos/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, tipo } = req.body;

  try {
    const [result] = await pool.query(
      'UPDATE instrumento SET nombre = ?, tipo = ? WHERE id = ?',
      [nombre, tipo, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Instrumento no encontrado' });
    }

    res.status(200).json({ mensaje: 'Instrumento actualizado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

  
app.delete('/instrumentos/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query(
      'DELETE FROM instrumento WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Instrumento no encontrado' });
    }

    res.status(200).json({ mensaje: 'Instrumento eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

  
//metodo de la tabla paises
app.get('/pais', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM pais');
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  app.post('/pais', async (req, res) => {
    const { id, nombre, codigo_telefono } = req.body;
    try {
      const result = await pool.query(
        'INSERT INTO pais (id, nombre, codigo_telefono) VALUES ($1, $2, $3) RETURNING *',
        [id, nombre, codigo_telefono]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  
  app.put('/pais/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, codigo_telefono } = req.body;
    try {
      const result = await pool.query(
        'UPDATE pais SET nombre = $1, codigo_telefono = $2 WHERE id = $3 RETURNING *',
        [nombre, codigo_telefono, id]
      );
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete('/pais/:id', async (req, res) => {
    const { id } = req.params;
    try {
      // Elimina las referencias en usuario_instrumento
      await pool.query('DELETE FROM usuarios WHERE pais = $1', [id]);
  
      // Luego elimina el instrumento
      const result = await pool.query('DELETE FROM pais WHERE id = $1 RETURNING *', [id]);
  
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'pais no encontrado' });
      }
  
      res.json({ mensaje: 'pais eliminado correctamente', eliminado: result.rows[0] });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

app.patch('/usuarios/:id', (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;

  if (!nombre) {
      return res.status(400).json({ mensaje: 'El campo nombre es requerido.' });
  }

  const query = 'UPDATE usuarios SET nombre = $1 WHERE id = $2';
  pool.query(query, [nombre, id], (err, result) => {
      if (err) {
          console.error('Error ejecutando la consulta:', err);
          return res.status(500).json({ mensaje: 'Error interno en el servidor.' });
      }

      if (result.rowCount === 0) {
          return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
      }

      res.status(200).json({ mensaje: 'Nombre del usuario actualizado parcialmente.' });
  });
});

app.head('/usuarios/:id', (req, res) => {
  const { id } = req.params;

  const query = 'SELECT id FROM usuarios WHERE id = $1';
  pool.query(query, [id], (err, result) => {
      if (err) {
          console.error('Error ejecutando la consulta:', err);
          return res.status(500).json({ mensaje: 'Error interno en el servidor.' });
      }

      if (result.rowCount === 0) {
          return res.status(404).end(); 
      }

      res.status(200).end(); 
  });
});

app.options('/usuarios', (req, res) => {
  res.set('Allow', 'GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS');
  res.status(200).end();
});


//Validar PIN
app.post('/validar-pin', async (req, res) => {
    const { pin } = req.body;
    try {
        const { rows } = await pool.query('SELECT id, saldo FROM usuarios WHERE pin = $1', [pin]);

        if (rows.length > 0) {
            res.json({ mensaje: 'PIN válido', usuario_id: rows[0].id, saldo: rows[0].saldo });
        } else {
            res.status(404).json({ mensaje: 'PIN incorrecto' });
        }
    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor', error });
    }
});

//  Consultar saldo
app.get('/consultar-saldo/:id', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT saldo FROM usuarios WHERE id = $1', [req.params.id]);

        if (rows.length > 0) {
            res.json({ saldo: rows[0].saldo });
        } else {
            res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor', error });
    }
});

//  Depositar dinero
app.post('/deposito', async (req, res) => {
    const { usuario_id, monto } = req.body;
    try {
        await pool.query('UPDATE usuarios SET saldo = saldo + $1 WHERE id = $2', [monto, usuario_id]);
        await pool.query('INSERT INTO transacciones (usuario_id, tipo, monto) VALUES ($1, $2, $3)', [usuario_id, 'deposito', monto]);
        res.json({ mensaje: 'Depósito realizado' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor', error });
    }
});

// Retirar dinero
app.post('/retiro', async (req, res) => {
    const { usuario_id, monto } = req.body;
    try {
        const { rows } = await pool.query('SELECT saldo FROM usuarios WHERE id = $1', [usuario_id]);

        if (rows.length > 0 && rows[0].saldo >= monto) {
            await pool.query('UPDATE usuarios SET saldo = saldo - $1 WHERE id = $2', [monto, usuario_id]);
            await pool.query('INSERT INTO transacciones (usuario_id, tipo, monto) VALUES ($1, $2, $3)', [usuario_id, 'retiro', monto]);
            res.json({ mensaje: 'Retiro exitoso' });
        } else {
            res.status(400).json({ mensaje: 'Fondos insuficientes o usuario no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor', error });
    }
});

app.post('/procedimiento', async (req, res) => {
    const { usuario, email, contraseña } = req.body;

    try {
        await pool.query('CALL pr_agregar_usuario($1, $2, $3)', [usuario, email, contraseña]);
        res.status(201).send({ mensaje: 'Usuario registrado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ mensaje: 'Error al registrar usuario', error });
    }
});



app.post('/funcion', async (req, res) => {
    const { usuario, email, contraseña} = req.body;
    try {
        await pool.query('SELECT spina_ingresa_usuario($1, $2, $3)', [usuario, email, contraseña]);
        res.status(201).send({ mensaje: 'Usuario registrado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ mensaje: 'Error al registrar usuario', error });
    }
});


 if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
}

module.exports = app; 