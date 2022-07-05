const pg = require('pg')
const { Client } = require('pg')
const client = new Client({
    host: '3380db.cs.uh.edu',
    user: 'dbs063',
    password: '1887820L',
    port: 5432,
    database: 'COSC3380'
});

async function main() {
    await client.connect()
    q = await client.query('select aircraft_code, no_economy_seats, no_business_seats, no_first_class_seats from aircrafts')
    for (i=0;i<7;i++){
        await client.query(`
        do $$
        declare
        numEco int := '${q.rows[i].no_economy_seats}';
        numBus int := '${q.rows[i].no_business_seats}';
        numFir int := '${q.rows[i].no_first_class_seats}';
        air_code char(3) := '${q.rows[i].aircraft_code}';

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
    client.end()
}

try{main()}
catch(e){
    client.end()
  throw error(e)
}

