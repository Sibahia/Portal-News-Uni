const sqlite3 = require('sqlite3').verbose();

class sqlORM {
    constructor (dbFileName) {
        this.db = new sqlite3.Database(dbFileName, (error) => {
            if (error) {
                 console.log('Error de conexión: ', error.message ) 
                } else {
                    this.db.run('PRAGMA foreign_keys = ON', (err) => {
                        if (err) { console.log('Error activando claves foráneas: ', err.message)}
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
            if (error) { console.log('Error definiendo tabla: ', error.message)}
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
                    reject({ message: 'error insertando datos: ', error: err.message})
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
                    reject({ message: 'Error actualizando datos: ', error: error.message });
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
                    reject('Error obteniendo los datos: ' + error.message);
                } else if (!row) {
                    reject('No existen los datos');
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
                    reject('Error obteniendo los datos limitado: ' + error.message);
                } else {
                    resolve(rows);
                };
            });
        });
    };

    findAllJoin(params) {
        return new Promise((resolve, reject) => {
            this.db.all(params, (error, rows) => {
                if (error) {
                    reject({ message: 'Error ejecutando la consulta JOIN', error: error.message })
                } else {
                    resolve(rows);
                };
            });
        });
    };

    getAll(tableName) {
        const sql = `SELECT * FROM ${tableName}`;

        return new Promise((resolve, reject) => {
            this.db.all(sql, (error, rows) => {
                if (error) {
                    reject('Error obteniendo todos los datos: ' + error.message);
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
                    reject('Error eliminando datos: ' + error.message);
                } else {
                    resolve({ message: 'Datos eliminados correctamente', changes: this.changes });
                }
            });
        });
    }        

};

module.exports = { sqlORM };