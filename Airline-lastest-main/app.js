const { table } = require("console");
const { json } = require("express");
const express = require("express");
const { ClientRequest } = require("http");
const app = express();
const path = require('path');
const pg = require('pg')
const fs = require('fs');
const { Client } = require('pg')
const client = new Client({
    host: '3380db.cs.uh.edu',
    user: 'dbs063',
    password: '1887820L',
    port: 5432,
    database: 'COSC3380'
});

//Create or overwrite transaction.sql and query.sql
fs.closeSync(fs.openSync('transaction.sql', 'w'));
fs.closeSync(fs.openSync('query.sql', 'w'));

//Append to a file
function toFile(fileName, content) {
    fs.appendFileSync(fileName, content + "\n", err => {
		if (err){
			console.error(err)
			return
		}
	});
}

//Send query and append it to query.sql
async function sendQuery(q){
	toFile("query.sql",q);
	let respond = await client.query(q);
    return respond;
}

//Send transaction and append it to transaction.sql
async function sendTransaction(q){
	toFile("transaction.sql",q);
	let respond = await client.query(q);
    return respond;
}


app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.urlencoded({ extended: true }))

client.connect()
// const connect = async () => {
//     const table1313 = await client.query("SELECT * FROM TICKETS")
//     console.log(table1313.rows)
// }

//Homepage
app.get('/', (req, res) => {
    res.render('index')
})

//ER Diagram
app.get('/er', (req, res) => {
    res.render('er')
})

//result of flight status
app.get('/flight_status', async (req, res) => {
    const q = req.query
    const depart = q.depart_input
    const arrive = q.arrive_input
    const flight = q.flight_number.toUpperCase()
    if (flight) {
        try {
            const table = await client.query(`Select * from flights 
            where departure_airport='${depart.toUpperCase()}'
            and arrival_airport='${arrive.toUpperCase()}'
            and flight_id='${flight}'`)
            if (table.rows.length) {
                const size = table.rows.length
                const dep_date = []
                const dep_time = []
                const arr_time = []
                const aircraft = []
                for (let i = 0; i < size; i++) {
                    const table1 = await client.query(`Select model from aircrafts 
                    where aircraft_code='${table.rows[i].aircraft_code}'`)
                    dep_date.push(JSON.stringify(table.rows[i].scheduled_departure).slice(1, 11))
                    dep_time.push(JSON.stringify(table.rows[i].scheduled_departure).slice(12, 17))
                    arr_time.push(JSON.stringify(table.rows[i].scheduled_arrival).slice(12, 17))
                    aircraft.push(table1.rows[0].model)
                }


                res.render('flight_status', {
                    depart: depart, arrive: arrive,
                    flight: flight, table: table.rows,
                    dep_time: dep_time, dep_date: dep_date,
                    arr_time: arr_time, aircraft: aircraft,
                    size: size
                })
            }
            else {
                res.render('show', { error: "There's no flight match your search" })
            }
            console.log(table.rows)
        }
        catch (e) {
            res.render('error', { error: translateError(e.message) })
        }
    }
    else if (depart && arrive) {
        try {
            const table = await client.query(`Select * from flights 
            where departure_airport='${depart.toUpperCase()}'
            and arrival_airport='${arrive.toUpperCase()}'`)
            if (table.rows.length) {
                const size = table.rows.length
                const dep_date = []
                const dep_time = []
                const arr_time = []
                const aircraft = []
                for (let i = 0; i < size; i++) {
                    const table1 = await client.query(`Select model from aircrafts 
                                                where aircraft_code='${table.rows[i].aircraft_code}'`)

                    dep_date.push(JSON.stringify(table.rows[i].scheduled_departure).slice(1, 11))
                    dep_time.push(JSON.stringify(table.rows[i].scheduled_departure).slice(12, 17))
                    arr_time.push(JSON.stringify(table.rows[i].scheduled_arrival).slice(12, 17))
                    aircraft.push(table1.rows[0].model)
                }

                res.render('flight_status', {
                    depart: depart, arrive: arrive,
                    flight: flight, table: table.rows,
                    dep_time: dep_time, dep_date: dep_date,
                    arr_time: arr_time, aircraft: aircraft,
                    size: size

                })
            }
            else {
                res.render('show', { error: "There's no flight match your search" })
            }
        }
        catch (e) {
            res.render('error', { error: translateError(e.message) })
        }
    }
    else {
        res.render('show', { error: "There's no flight match your search" })
    }

})

//homepage to modify dbms
app.get('/dbms', (req, res) => {
    res.render('dbms')
})

app.get('/signin', (req, res) => {
    res.render('signin')
})

//DONE
app.get('/select-table', async (req, res) => {
    const q = req.query
    const table_name = q.table_select
    const type = q.flexRadioDefault
    try {
        let table = await client.query(`SELECT distinct(aircraft_code) from aircrafts`)
        // console.log(table.rows)
        const aircraft_code_list = []
        for (let row of table.rows) {
            aircraft_code_list.push(row.aircraft_code)
        }

        let table1 = await client.query(`SELECT distinct(gate_no) from gates`)
        const gate_list = []
        for (let row of table1.rows) {
            gate_list.push(row.gate_no)
        }

        let table2 = await client.query(`SELECT airport_code from airports`)
        const airport_list = []
        for (let row of table2.rows) {
            airport_list.push(row.airport_code)
        }

        let airport_object = {}
        for (let temp of airport_list) {
            let table3 = await client.query(`SELECT gate_no from gates where airport_code='${temp}'`)
            let temp1 = []
            for (let row of table3.rows) {
                temp1.push(row.gate_no)
            }
            airport_object[temp] = temp1
        }

        if (type === 'insert') {
            res.render('insert', { table_name: table_name, aircraft_code_list: aircraft_code_list, gates: gate_list, airport_gates: airport_object })
        }
        else if (type === 'delete') {
            res.render('delete', { table_name: table_name })
        }
        else if (type === 'update') {
            res.render('choose_row_update', { table_name: table_name })
        }
        else {
            try {
                let table4 = await sendQuery(`SELECT * FROM ${table_name}`)
                if (table4.rows.length) {
                    res.render('show', { table_name: table_name, table: table4.rows })
                }
                else {
                    res.render('error', { error: "Empty Table" })
                }

            }
            catch (e) {
                res.render('error', { error: translateError(e.message) })
            }
        }


    }
    catch (e) {
        res.render('error', { error: translateError(e.message) })
    }


})

const translateError = (e) => {
    if (e) {
        if (e=="insert or update on table \"flights\" violates foreign key constraint \"flights_departure_gate_departure_airport_fkey\"") {
            e = 'That Airport/Gate Combination Does Not Exist'
        }
        else if (e == "error: insert or update on table \"flights\" violates foreign key constraint \"flights_departure_gate_departure_airport_fkey\"") {
            e = 'That Airport/Gate Combination Does Not Exist'
        }
        if (e=="duplicate key value violates unique constraint \"aircrafts_pkey\"") {
            e = 'That Aircraft Already Exists'
        }
        if (e == "duplicate key value violates unique constraint \"airports_pkey\"") {
            e = 'That Airport Already Exists'
        }

        return e
    }
}


//DONE - This is not the sql function for update flight
app.post('/update_flight', async (req, res) => {
    const input = req.body
    const flight_id = input.flight_id
    try {
        let row = await client.query(`SELECT * FROM FLIGHTS WHERE FLIGHT_ID = '${flight_id.split(" ").join("")}'`)
        // console.log(row.rows[0].scheduled_departure)
        let table = await client.query(`SELECT distinct(aircraft_code) from aircrafts`)
        // console.log(table.rows)
        const aircraft_code_list = []
        for (let row of table.rows) {
            aircraft_code_list.push(row.aircraft_code)
        }

        let table1 = await client.query(`SELECT distinct(gate_no) from gates`)
        const gate_list = []
        for (let row of table1.rows) {
            gate_list.push(row.gate_no)
        }

        let table2 = await client.query(`SELECT airport_code from airports`)
        const airport_list = []
        for (let row of table2.rows) {
            airport_list.push(row.airport_code)
        }

        let airport_object = {}
        for (let temp of airport_list) {
            let table3 = await client.query(`SELECT gate_no from gates where airport_code='${temp}'`)
            let temp1 = []
            for (let row of table3.rows) {
                temp1.push(row.gate_no)
            }
            airport_object[temp] = temp1
        }
        

        if (Object.entries(row.rows).length) {
            const arr_date = JSON.stringify(row.rows[0].scheduled_departure).slice(1, 11)
            const dep_date = JSON.stringify(row.rows[0].scheduled_departure).slice(1, 11)
            const dep_time = JSON.stringify(row.rows[0].scheduled_departure).slice(12, 17)
            const arr_time = JSON.stringify(row.rows[0].scheduled_arrival).slice(12, 17)
            
            res.render('update', {
                table_name: "Flights", row: row.rows,
                aircraft_code_list: aircraft_code_list,
                gates: gate_list, airport_gates: airport_object,
                arr_date: arr_date, dep_date: dep_date,
                dep_time: dep_time, arr_time: arr_time
            })
        }
        else {
            res.render('error', { error: "There's no result on the database, please try again!" })

        }
    }
    catch (e) {
        res.render('error', { error: translateError(e.message) })
    }
})

//DONE - This is not the sql function for update aircraft
app.post('/update_aircraft', async (req, res) => {
    const input = req.body

    let row = await client.query(`SELECT * FROM AIRCRAFTS WHERE aircraft_code= '${input.aircraft_code}'`)
    if (Object.entries(row.rows).length) {
        res.render('update', { table_name: " Aircrafts", row: row.rows })
    }
    else {
        res.render('error', { error: "There's no result on the database, please try again!" })
    }


})

//DONE - This is not the sql function for update airport
app.post('/update_airport', async (req, res) => {
    const input = req.body
    let row = await client.query(`SELECT * FROM AIRPORTS WHERE airport_code= '${input.airport_code}'`)

    if (Object.entries(row.rows).length) {
        res.render('update', { table_name: "Airports", row: row.rows })
    }
    else {
        res.render('error', { error: "There's no result on the database, please try again!" })
    }
})

// DONE - INSERT FLIGHT
app.post('/insert_flight', async (req, res) => {
    const input = req.body
    console.log(input)
    try {
        await client.query(`BEGIN TRANSACTION;
                            insert into TEMP_FLIGHT Values('${input.flight_id}', TO_TIMESTAMP('${input.departure_time}','YYYY-MM-DD HH24:MI'), TO_TIMESTAMP('${input.arrival_time}','YYYY-MM-DD HH24:MI'), '${input.departure_airport}', '${input.arrival_airport}', '${input.departure_gate}', '${input.arrival_gate}', '${input.aircraft_code}', '${input.refuel.toUpperCase()}' , '${input.cleaning.toUpperCase()}', '${input.maintainance.toUpperCase()}');
                            COMMIT;`)

        
        /*determines if 2 flights share a DEPARTURE gate at the same time(outputs an object with boolean value)*/
        dGateViolation = await client.query(`select exists (
                                            select * 
                                            from flights 
                                            where date(scheduled_departure) = (select date(scheduled_dep) from temp_flight) and 
                                                departure_airport = (select dep_airport from temp_flight) and departure_gate = 
                                                (select dep_gate from temp_flight)
                                        ) as violation`
        )

        if (input.departure_time > input.arrival_time) {
            res.render('error', { error: "Cannot Enter Flight with Departure Time After Arrival Time" })
        }
        else if (dGateViolation.rows[0].violation == true) { /*shared DEPARTURE gate*/
            res.render('error', { error: "Departure Gate is Busy At That Time" })
        }
        else {
            /*determines if 2 flights share an ARRIVAL gate at the same time(outputs object with boolean element)*/
            aGateViolation = await client.query(`select exists (
                                                select * 
                                                from flights 
                                                where date(scheduled_arrival) = (select date(scheduled_arr) from temp_flight) and 
                                                    arrival_airport = (select arr_airport from temp_flight) and arrival_gate = 
                                                    (select arr_gate from temp_flight)
                                            ) as violation`
            )

            if (aGateViolation.rows[0].violation == true) { /*shared ARRIVAL gate */
                res.render('error', { error: "Arrival Gate is Busy At That Time" })
            }
            else {
                /*determines if a departure gate is shared with new arrival gate*/
                newArrGateViolation = await client.query(`select exists (
                                                        select * 
                                                        from flights 
                                                        where date(scheduled_departure) = (select date(scheduled_arr) from temp_flight) and 
                                                        departure_airport = (select arr_airport from temp_flight) and departure_gate = 
                                                        (select arr_gate from temp_flight)
                                                    ) as violation`
                )
                if (newArrGateViolation.rows[0].violation == true) {/*new arrival gate is busy*/
                    res.render('error', { error: "Arrival Gate is Busy At That Time" })
                }
                else {
                    /*determines if an arrival gate is shared with a new departure gate*/
                    newDepGateViolation = await client.query(`select exists (
                                                            select * 
                                                            from flights 
                                                            where date(scheduled_arrival) = (select date(scheduled_dep) from temp_flight) and 
                                                                arrival_airport = (select dep_airport from temp_flight) and arrival_gate = 
                                                                (select dep_gate from temp_flight)
                                                                ) as violation`
                    )
                    if (newDepGateViolation.rows[0].violation == true) {/*new departure gate is busy*/
                        res.render('error', { error: "Departure Gate is Busy At That Time" })
                    }
                    else { /*No shared Gates*/
                        await sendTransaction(`BEGIN TRANSACTION;
                                                insert into flights
                                                select * from temp_flight;
                                            COMMIT;`)
                        try {
                            let table = await sendQuery(`SELECT * FROM FLIGHTS`)
                            res.render('show', { table_name: "flights", table: table.rows })
                        }
                        catch (e) {
                            console.log(e)
                            res.render('error', { error: translateError(e.message) })
                        }
                    }
                }
            }
        }

        await client.query('delete from temp_flight;')
    }
    catch (e) {
        await client.query(`ROLLBACK;`)
        await client.query('delete from temp_flight;')
        res.render('error', { error: translateError(e.message) })
    }

})

//DONE - INSERT AIRPORT (TRANSACTION)
app.post('/insert_airport', async (req, res) => {
    const input = req.body
    try {
        await sendTransaction(`BEGIN TRANSACTION;
                            INSERT INTO Airports(airport_code, airport_name, city)
                            VALUES('${input.airport_code}', '${input.airport_name}', '${input.city}');
                             COMMIT;`)
    }
    catch (e) {
        await client.query(`ROLLBACK;`)

        res.render('error', { error: translateError(e.message) })
    }

    try {
        let table = await sendQuery(`SELECT * FROM AIRPORTS`)
        res.render('show', { table_name: "airports", table: table.rows })
    }
    catch (e) {
        res.render('error', { error: translateError(e.message) })
    }
})


//DONE - INSERT AIRCRAFT (TRANSACTION)
app.post('/insert_aircraft', async (req, res) => {
    const input = req.body

    try {
        await sendTransaction(`BEGIN TRANSACTION;
        INSERT INTO Aircrafts (aircraft_code, model, movie, wifi, no_economy_seats, no_business_seats, no_first_class_seats)
        VALUES  ('${input.aircraft_code}', '${input.model}', ${input.movie}, ${input.wifi}, ${input.no_economy_seats} , ${input.no_business_seats} , ${input.no_first_class_seats});
        COMMIT;`)
    }
    catch (e) {
        await client.query(`ROLLBACK;`)
        res.render('error', { error: translateError(e.message) })
    }

    try {
        await client.query(`
        do $$
        declare
        numEco int := ${input.no_economy_seats};
        numBus int := ${input.no_business_seats};
        numFir int := ${input.no_first_class_seats};
        air_code char(3) := '${input.aircraft_code}';

        begin
        for r in 1..numEco loop
        insert into seats values(air_code, r, 'Economy');
        end loop;

        for r in numEco+1..numBus+numEco loop
        insert into seats values(air_code, r, 'Business');
        end loop;

        for r in numEco+numBus+1..numBus+numEco+numFir loop
        insert into seats values(air_code, r, 'First Class');
        end loop;
        end;
        $$;
        `)

    }
    catch (e) {
        res.render('error', { error: translateError(e.message) })
    }

    try {
        let table = await sendQuery(`SELECT * FROM AIRcrafts`)
        res.render('show', { table_name: "aircrafts", table: table.rows })
    }
    catch (e) {
        res.render('error', { error: translateError(e.message) })
    }
})

// NOT DONE - UPDATE FLIGHT
app.post('/sql_update_flight', async (req, res) => {
    const input = req.body
    // console.log(input)
    if (input.departure_time == "") {
        input.departure_time = input.original_dep
    }
    if (input.arrival_time == "") {
        input.arrival_time = input.original_arr
    }
    try {
        await client.query(`BEGIN TRANSACTION;
                                insert into TEMP_FLIGHT Values('${input.flight_id}', TO_TIMESTAMP('${input.departure_time}','YYYY-MM-DD HH24:MI'), TO_TIMESTAMP('${input.arrival_time}','YYYY-MM-DD HH24:MI'), '${input.departure_airport}', '${input.arrival_airport}', '${input.departure_gate}', '${input.arrival_gate}', '${input.aircraft_code}', '${input.refuel.toUpperCase()}' , '${input.cleaning.toUpperCase()}', '${input.maintainance.toUpperCase()}');
                            COMMIT;`)

        /*determines if 2 flights share a DEPARTURE gate at the same time(outputs an object with boolean value)*/
        dGateViolation = await client.query(`select exists (
                    select * 
                    from flights 
                    where date(scheduled_departure) = (select date(scheduled_dep) from temp_flight) and 
                        departure_airport = (select dep_airport from temp_flight) and departure_gate = 
                        (select dep_gate from temp_flight) and flight_id != (select flight_id from temp_flight)
                ) as violation`
        )
        

        if (input.departure_time > input.arrival_time) {
            res.render('error', { error: "Cannot Enter Flight with Departure Time After Arrival Time" })
        }
        else if (dGateViolation.rows[0].violation == true) { /*shared DEPARTURE gate*/
            res.render('error', { error: "Departure Gate is Busy At That Time" })

        }
        else {
            /*determines if 2 flights share an ARRIVAL gate at the same time(outputs object with boolean element)*/
            aGateViolation = await client.query(`select exists (
                        select * 
                        from flights 
                        where date(scheduled_arrival) = (select date(scheduled_arr) from temp_flight) and 
                            arrival_airport = (select arr_airport from temp_flight) and arrival_gate = 
                            (select arr_gate from temp_flight) and flight_id != (select flight_id from temp_flight)
                    ) as violation`
            )

            if (aGateViolation.rows[0].violation == true) { /*shared ARRIVAL gate */
                res.render('error', { error: "Arrival Gate is Busy At That Time" })
            }
            else {
                /*determines if a departure gate is shared with new arrival gate*/
                newArrGateViolation = await client.query(`select exists (
                                select * 
                                from flights 
                                where date(scheduled_departure) = (select date(scheduled_arr) from temp_flight) and 
                                departure_airport = (select arr_airport from temp_flight) and departure_gate = 
                                (select arr_gate from temp_flight) and flight_id != (select flight_id from temp_flight)
                            ) as violation`
                )
                if (newArrGateViolation.rows[0].violation == true) {/*new arrival gate is busy*/
                    res.render('error', { error: "Arrival Gate is Busy At That Time" })
                }
                else {
                    /*determines if an arrival gate is shared with a new departure gate*/
                    newDepGateViolation = await client.query(`select exists (
                                    select * 
                                    from flights 
                                    where date(scheduled_arrival) = (select date(scheduled_dep) from temp_flight) and 
                                        arrival_airport = (select dep_airport from temp_flight) and arrival_gate = 
                                        (select dep_gate from temp_flight) and flight_id != (select flight_id from temp_flight)
                                        ) as violation`
                    )
                    if (newDepGateViolation.rows[0].violation == true) {/*new departure gate is busy*/
                        res.render('error', { error: "Departure Gate is Busy At That Time" })
                    }
                    else { /*No shared Gates*/
                        await sendTransaction(`BEGIN TRANSACTION;
                                                UPDATE flights
                                                SET scheduled_departure = TO_TIMESTAMP('${input.departure_time}','YYYY-MM-DD HH24:MI'), scheduled_arrival = TO_TIMESTAMP('${input.arrival_time}','YYYY-MM-DD HH24:MI'), departure_airport = '${input.departure_airport}', arrival_airport = '${input.arrival_airport}', departure_gate = '${input.departure_gate}', arrival_gate = '${input.arrival_gate}', aircraft_code = '${input.aircraft_code}', refueling = '${input.refuel.toUpperCase()}', cleaning = '${input.cleaning.toUpperCase()}',maintenance = '${input.maintainance.toUpperCase()}'
                                                WHERE flight_id = '${input.flight_id}';
                                            COMMIT;`)
                    }
                    try {
                        let table = await sendQuery(`SELECT * FROM FLIGHTS`)
                        res.render('show', { table_name: "flights", table: table.rows })
                    }
                    catch (e) {
                        res.render('error', { error: translateError(e) })
                    }
                }
            }
        }

        await client.query('delete from temp_flight;')
    }
    catch (e) {
        await client.query(`ROLLBACK;`)
        await client.query('delete from temp_flight;')
        res.render('error', { error: translateError(e) })
    }
})

//DONE - UPDATE AIRCRAFT (TRANSACTION)
app.post('/sql_update_aircraft', async (req, res) => {
    const input = req.body

    try {
        let table = await sendTransaction(`BEGIN TRANSACTION;
        UPDATE Aircrafts
        SET    model = '${input.model}', movie = ${input.movie.toUpperCase()}, wifi =${input.wifi.toUpperCase()}
        WHERE aircraft_code= '${input.aircraft_code.split(" ").join("")}';
        COMMIT;`)
    }
    catch (e) {
        await client.query(`ROLLBACK;`)
        res.render('error', { error: translateError(e.message) })
    }

    try {
        let table = sendQuery(`SELECT * FROM AIRcrafts`)
        res.render('show', { table_name: "aircrafts", table: (await table).rows })
    }
    catch (e) {
        res.render('error', { error: translateError(e.message) })
    }
})

//DONE - UPDATE AIRPORT (TRANSACTION)
app.post('/sql_update_airport', async (req, res) => {
    const input = req.body

    try {
        await sendTransaction(`BEGIN TRANSACTION;
        UPDATE Airports
        SET   airport_name = '${input.airport_name}', city = '${input.city}'
        WHERE airport_code = '${input.airport_code.split(" ").join("")}';
        COMMIT;`)
    }
    catch (e) {
        await client.query(`ROLLBACK;`)
        res.render('error', { error: translateError(e.message) })
    }

    try {
        let table = await sendQuery(`SELECT * FROM airports`)
        res.render('show', { table_name: "airports", table: table.rows })
    }
    catch (e) {
        res.render('error', { error: translateError(e.message) })
    }
})



app.get('*', (req, res) => {
    res.send("There is nothing here, please try again with valid URL!")
})

app.listen(3000, () => {
    console.log("LISTENING ON PORT 3000!")
})
