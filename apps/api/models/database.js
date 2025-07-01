const sqlite3 = require('sqlite3').verbose();

class sqlORM {
    constructor (dbFileName) {
        this.db = new sqlite3.Database(dbFileName, (error) => {
            if (error) {
                 console.log('Error de conexión: ', error.message ) 
                } else {
                    this.db.run('PRAGMA foreign_keys = ON', (err) => {
                        if (err) { console.log({ error: 'Error activando claves foráneas', details: err.message })}
                    });
                };
        });
    };

    define (tableName, params, foreignKeys = []) {
        const columns = Object.keys(params)
        .map(key => `${key} ${params[key]}`)
        .join(', ');

        const foreignKeysSQL = foreignKeys.length > 0
         ? `, ${foreignKeys.map(fk => `FOREIGN KEY (${fk.column}) REFERENCES ${fk.references}(${fk.refColumn}) ON DELETE CASCADE`).join(', ')}`
         : '';

        const sql = `CREATE TABLE IF NOT EXISTS ${tableName} (${columns}${foreignKeysSQL})`;

        this.db.run(sql, (error) => {
            if (error) { console.log({ error: 'definiendo tablas', details: error.message })}
        });
    };

    insert (tableName, params) {
        const columns = Object.keys(params).join(', ');
        const placeholders = Object.keys(params).map(() => '?' ).join(', ');
        const values = Object.values(params);

        const sql = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`;

        return new Promise((resolve, reject) => {
            this.db.run(sql, values, function (err) {
                if (err) {
                    reject({ error: 'error insertando datos: ', details: err.message})
                } else {
                    resolve(this.lastID);
                };
            });
        })
    };

    update(tableName, params, whereParams) {
        const columns = Object.keys(params)
            .map(key => `${key} = ?`)
            .join(', ');
        const whereClause = Object.keys(whereParams)
            .map(key => `${key} = ?`)
            .join(' AND ');

        const values = [...Object.values(params), ...Object.values(whereParams)];

        const sql = `UPDATE ${tableName} SET ${columns} WHERE ${whereClause}`;

        return new Promise((resolve, reject) => {
            this.db.run(sql, values, function (error) {
                if (error) {
                    reject({ error: 'Error actualizando datos: ', details: error.message });
                } else {
                    resolve({ message: 'Datos actualizados correctamente', changes: this.changes });
                };
            });
        });
    };


    find(tableName, params) {
        const columns = Object.keys(params).map(key => `${key} = ?`).join(' AND ');
        const values = Object.values(params);

        const sql = `SELECT * FROM ${tableName} WHERE ${columns}`;

        return new Promise((resolve, reject) => {
            this.db.get(sql, values, (error, row) => {
                if (error) {
                    reject({ error: 'Error obteniendo los datos', details: error.message });
                } else if (!row) {
                    reject({ error: 'No existen los datos' });
                } else {
                    resolve(row);
                }
            });
        });
    }

    findAll (tableName, params) {
        const columns = Object.keys(params).join(' ');
        const values = Object.values(params);

        const sql = `SELECT * FROM ${tableName} ${columns} ${values}`;

        return new Promise((resolve, reject) => {
            this.db.all(sql, (error, rows) => {
                if (error) {
                    reject({ error: 'Error obteniendo los datos limitado', details: error.message });
                } else {
                    resolve(rows);
                };
            });
        });
    };

    findLimit(tableName, order, limit) {
        if (typeof limit !== 'number' || limit < 1) {
            return Promise.reject({ error: 'El límite debe ser un número entero mayor o igual a 1' });
        }

        let sql = `SELECT * FROM ${tableName}`;

        const validDirections = ['ASC', 'DESC'];

        if (typeof order === 'string' && validDirections.includes(order.toUpperCase())) {
            sql += ` ORDER BY id ${order.toUpperCase()}`;
        }

        else if (Array.isArray(order) && Array.isArray(order[0])) {
            const clauses = order
                .filter(([key, dir]) =>
                    typeof key === 'string' &&
                    /^[a-zA-Z0-9_]+$/.test(key) &&
                    validDirections.includes(dir?.toUpperCase())
                )
                .map(([key, dir]) => `${key} ${dir.toUpperCase()}`)
                .join(', ');
            if (clauses) {
                sql += ` ORDER BY ${clauses}`;
            }
        }

        else if (Array.isArray(order) && order.length === 2) {
            const [key, dir] = order;
            const direction = dir?.toUpperCase();
            if (
                typeof key === 'string' &&
                /^[a-zA-Z0-9_]+$/.test(key) &&
                validDirections.includes(direction)
            ) {
                sql += ` ORDER BY ${key} ${direction}`;
            }
        }

        sql += ' LIMIT ?';

        return new Promise((resolve, reject) => {
            this.db.all(sql, [limit], (error, rows) => {
                if (error) {
                    reject({ error: 'Error obteniendo datos con límites', details: error.message });
                } else {
                    resolve(rows);
                }
            });
        });
    }


    findAllJoin({ sql, params = [] }) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (error, rows) => {
                if (error) {
                    reject({ error: 'Error ejecutando la consulta JOIN', details: error.message });
                } else {
                    resolve(rows);
                }
            });
        });
    };


    getAll(tableName) {
        const sql = `SELECT * FROM ${tableName}`;

        return new Promise((resolve, reject) => {
            this.db.all(sql, (error, rows) => {
                if (error) {
                    reject({ error: 'Error obteniendo todos los datos', details: error.message });
                } else {
                    resolve(rows);
                };
            });
        });
    };

    delete(tableName, params) {
        const columns = Object.keys(params).map(key => `${key} = ?`).join(' AND ');
        const values = Object.values(params);

        const sql = `DELETE FROM ${tableName} WHERE ${columns}`;

        return new Promise((resolve, reject) => {
            this.db.run(sql, values, function (error) {
                if (error) {
                    reject({ error: 'Error eliminando datos', details: error.message });
                } else {
                    resolve({ message: 'Datos eliminados correctamente', changes: this.changes });
                }
            });
        });
    }        

};

module.exports = { sqlORM };