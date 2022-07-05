CREATE TABLE Tickets (
    ticket_no VARCHAR(256),
	passenger_id VARCHAR(256),
	passenger_name VARCHAR(256),
	PRIMARY KEY (ticket_no)
);

INSERT INTO Tickets (ticket_no, passenger_id, passenger_name)
VALUES  ('0006274432500', '6996274697', 'Toni Johnson'),
		('0006274432507', '2686036773', 'Earl Alvarado'),
		('0006274432522', '2381811488', 'Cameron Austin'),
		('0006274432534', '4711755142', 'Roland Alvarez'),
		('0006274432552', '5231847974', 'Mike Carlson'),
		('0006274432577', '9105839805', 'Loretta Hunt'),
		('0006274432578', '4446871100', 'Joshua Mills'),
		('0006274432582', '2135623178', 'Theodore Pierce'),
		('0006274432585', '2720147601', 'Carl Weaver'),
		('0006274432595', '1670104070', 'Christine Barnett');



		
		
CREATE TABLE Airports (
    airport_code VARCHAR(3),
    airport_name VARCHAR(256),
    city VARCHAR(256),
	PRIMARY KEY (airport_code)
);	

INSERT INTO Airports (airport_code, airport_name, city)
VALUES  ('HOU', 'William P. Hobby Airport', 'Houston'),
		('DFW', 'Dallas/Fort Worth International Airport', 'Dallas'),
		('IAH', 'George Bush Intercontinental Airport', 'Houston'),
		('JAX', 'Jacksonville International Airport', 'Jacksonville'),
		('MIA', 'Miami International Airport', 'Miami'),
		('MCO', 'Orlando International Airport', 'Orlando'),
		('LAX', 'Los Angeles International Airport', 'Los Angeles'),
		('SFO', 'San Francisco International Airport', 'San Fransisco'),
		('JFK', 'John F. Kennedy International Airport', 'New York'),
		('LGA', 'LaGuardia Airport', 'New York');
		

CREATE TABLE Aircrafts (
    aircraft_code VARCHAR(3),
    model VARCHAR(256),
	movie BOOLEAN,
	wifi BOOLEAN,
	no_economy_seats INT,
	no_business_seats INT,
	no_first_class_seats INT,
	PRIMARY KEY (aircraft_code)
);	
		
INSERT INTO Aircrafts (aircraft_code, model, movie, wifi, no_economy_seats, no_business_seats, no_first_class_seats)
VALUES  ('388', 'Airbus A380-800', TRUE, TRUE, 399 , 76 , 14),
		('321', 'Airbus A321', TRUE, TRUE, 142, 29, 20),
		('74H', 'Boeing 747-8I', FALSE, TRUE, 244, 80, 8),
		('744', 'Boeing 747-400', FALSE, TRUE, 308, 53, 12),
		('762', 'Boeing 767-200', FALSE, FALSE, 249, 0, 0),
		('342', 'Airbus A340-200', TRUE, TRUE, 122, 52, 12),
		('319', 'Airbus A319', TRUE, FALSE, 96, 18, 8);
		

CREATE TABLE Gates (
	airport_code VARCHAR(3),
    gate_no VARCHAR(2),
	PRIMARY KEY (gate_no, airport_code),
	FOREIGN KEY (airport_code) REFERENCES Airports(airport_code)
);	

INSERT INTO Gates (airport_code, gate_no)
VALUES  ('HOU', 'A1'),
		('HOU', 'B5'),
		('DFW', 'D1'),
		('DFW', 'E5'),
		('IAH', 'G3'),
		('IAH', 'D2'),
		('JAX', 'B6'),
		('JAX', 'E2'),
		('MIA', 'A2'),
		('MIA', 'B5'),
		('MCO', 'A1'),
		('MCO', 'C4'),
		('LAX', 'D3'),
		('LAX', 'E2'),
		('SFO', 'C6'),
		('SFO', 'B5'),
		('JFK', 'F4'),
		('JFK', 'A7'),
		('LGA', 'C9'),
		('LGA', 'E4');
		
		
CREATE TABLE Baggage (
	baggage_id VARCHAR(256),
    ticket_no VARCHAR(256),
	PRIMARY KEY (baggage_id),
	FOREIGN KEY (ticket_no) REFERENCES Tickets(ticket_no)
);	

INSERT INTO Baggage (baggage_id, ticket_no)
VALUES  ('L1651', '0006274432500'),
		('F5548', '0006274432500'),
		('N5230', '0006274432500'),
		('D0237', '0006274432507'),
		('J7076', '0006274432507'),
		('A1574', '0006274432522'),
		('H3510', '0006274432534'),
		('D2214', '0006274432534'),
		('M3214', '0006274432552'),
		('A8413', '0006274432577'),
		('L2141', '0006274432578'),
		('G1349', '0006274432578'),
		('I2372', '0006274432582'),
		('H3854', '0006274432582'),
		('I4610', '0006274432582'),
		('K0121', '0006274432585'),
		('G6610', '0006274432585'),
		('A8796', '0006274432585'),
		('B2140', '0006274432595'),
		('B8962', '0006274432595');
		


		
		
		

CREATE TABLE Flights (
    flight_id VARCHAR(6),
    scheduled_departure TIMESTAMP,
    scheduled_arrival TIMESTAMP,
    departure_airport VARCHAR(3),
    arrival_airport VARCHAR(3),
	departure_gate VARCHAR(3),
	arrival_gate VARCHAR(3),
    aircraft_code VARCHAR(3),
	refueling BOOLEAN,
	cleaning BOOLEAN,
	maintenance BOOLEAN,
	PRIMARY KEY (flight_id),
	FOREIGN KEY (departure_airport) REFERENCES Airports(airport_code),
	FOREIGN KEY (arrival_airport) REFERENCES Airports(airport_code),
	FOREIGN KEY (departure_gate, departure_airport) REFERENCES Gates(gate_no, airport_code),
	FOREIGN KEY (arrival_gate, arrival_airport) REFERENCES Gates(gate_no, airport_code),
	FOREIGN KEY (aircraft_code) REFERENCES Aircrafts(aircraft_code)
);


INSERT INTO Flights (flight_id, scheduled_departure, scheduled_arrival, departure_gate, arrival_gate, departure_airport, arrival_airport, aircraft_code, refueling, cleaning, maintenance)
VALUES  ('AA1137', TO_TIMESTAMP('2022-02-11 17:50', 'YYYY-MM-DD HH24:MI'), TO_TIMESTAMP('2022-02-11 23:45', 'YYYY-MM-DD HH24:MI'), 'A1', 'B6','HOU', 'JAX', '388', TRUE, TRUE, TRUE),
		('AA1501', TO_TIMESTAMP('2022-01-24 08:30', 'YYYY-MM-DD HH24:MI'), TO_TIMESTAMP('2022-01-24 13:45', 'YYYY-MM-DD HH24:MI'), 'A1', 'A7','MCO', 'JFK', '74H', FALSE, FALSE, TRUE),
		('AA3544', TO_TIMESTAMP('2022-01-17 12:45', 'YYYY-MM-DD HH24:MI'), TO_TIMESTAMP('2022-01-17 18:15', 'YYYY-MM-DD HH24:MI'), 'B5', 'C6','MIA', 'SFO', '744', FALSE, TRUE, FALSE),
		('AA2361', TO_TIMESTAMP('2022-02-23 18:50', 'YYYY-MM-DD HH24:MI'), TO_TIMESTAMP('2022-02-24 07:25', 'YYYY-MM-DD HH24:MI'), 'D3', 'A1','LAX', 'MCO', '762', TRUE, TRUE, FALSE),
		('UA3020', TO_TIMESTAMP('2022-02-11 13:20', 'YYYY-MM-DD HH24:MI'), TO_TIMESTAMP('2022-02-11 17:50', 'YYYY-MM-DD HH24:MI'), 'C9', 'B5','LGA', 'HOU', '342', TRUE, TRUE, TRUE),
		('UA4730', TO_TIMESTAMP('2022-02-09 11:50', 'YYYY-MM-DD HH24:MI'), TO_TIMESTAMP('2022-02-09 16:20', 'YYYY-MM-DD HH24:MI'), 'C4', 'D1','MCO', 'DFW', '319', FALSE, FALSE, TRUE),
		('UA2116', TO_TIMESTAMP('2022-02-12 06:45', 'YYYY-MM-DD HH24:MI'), TO_TIMESTAMP('2022-02-12 10:35', 'YYYY-MM-DD HH24:MI'), 'E2', 'A7','JAX', 'JFK', '321', TRUE, FALSE, TRUE),
		('UA4431', TO_TIMESTAMP('2022-02-20 10:10', 'YYYY-MM-DD HH24:MI'), TO_TIMESTAMP('2022-02-20 14:30', 'YYYY-MM-DD HH24:MI'), 'B5', 'C4','HOU', 'MCO', '744', TRUE, TRUE, FALSE),
		('UA1262', TO_TIMESTAMP('2022-01-25 06:05', 'YYYY-MM-DD HH24:MI'), TO_TIMESTAMP('2022-01-25 11:20', 'YYYY-MM-DD HH24:MI'), 'D1', 'D3','DFW', 'LAX', '319', FALSE, TRUE, TRUE),
		('DA2507', TO_TIMESTAMP('2022-02-05 17:15', 'YYYY-MM-DD HH24:MI'), TO_TIMESTAMP('2022-02-05 21:50', 'YYYY-MM-DD HH24:MI'), 'D1', 'E4','DFW', 'LGA', '388', TRUE, FALSE, TRUE),
		('DA6192', TO_TIMESTAMP('2022-02-19 09:45', 'YYYY-MM-DD HH24:MI'), TO_TIMESTAMP('2022-02-19 16:45', 'YYYY-MM-DD HH24:MI'), 'B6', 'G3','JAX', 'IAH', '744', TRUE, TRUE, TRUE),
		('DA3840', TO_TIMESTAMP('2022-01-17 21:35', 'YYYY-MM-DD HH24:MI'), TO_TIMESTAMP('2022-01-18 05:35', 'YYYY-MM-DD HH24:MI'), 'C6', 'E5','SFO', 'DFW', '319', TRUE, TRUE, TRUE),
		('SA8002', TO_TIMESTAMP('2022-02-19 22:50', 'YYYY-MM-DD HH24:MI'), TO_TIMESTAMP('2022-02-20 04:15', 'YYYY-MM-DD HH24:MI'), 'D2', 'A1','IAH', 'HOU', '74H', FALSE, FALSE, TRUE),
		('SA3199', TO_TIMESTAMP('2022-01-25 15:50', 'YYYY-MM-DD HH24:MI'), TO_TIMESTAMP('2022-01-25 19:35', 'YYYY-MM-DD HH24:MI'), 'E2', 'B6','LAX', 'JAX', '342', TRUE, TRUE, TRUE),
		('SA4726', TO_TIMESTAMP('2022-01-17 21:35', 'YYYY-MM-DD HH24:MI'), TO_TIMESTAMP('2022-01-18 02:10', 'YYYY-MM-DD HH24:MI'), 'B5', 'D2','SFO', 'IAH', '342', TRUE, TRUE, FALSE),
		('SA4370', TO_TIMESTAMP('2022-02-23 18:50', 'YYYY-MM-DD HH24:MI'), TO_TIMESTAMP('2022-02-23 23:35', 'YYYY-MM-DD HH24:MI'), 'B5', 'E2','HOU', 'JAX', '744', TRUE, FALSE, FALSE),
		('JB1413', TO_TIMESTAMP('2022-01-17 14:20', 'YYYY-MM-DD HH24:MI'), TO_TIMESTAMP('2022-01-17 19:25', 'YYYY-MM-DD HH24:MI'), 'C9', 'B5','LGA', 'SFO', '74H', FALSE, TRUE, FALSE),
		('JB3552', TO_TIMESTAMP('2022-02-06 08:45', 'YYYY-MM-DD HH24:MI'), TO_TIMESTAMP('2022-02-06 12:15', 'YYYY-MM-DD HH24:MI'), 'E4', 'A2','LGA', 'MIA', '744', TRUE, FALSE, TRUE),
		('JB2068', TO_TIMESTAMP('2022-02-06 13:55', 'YYYY-MM-DD HH24:MI'), TO_TIMESTAMP('2022-02-06 19:20', 'YYYY-MM-DD HH24:MI'), 'B5', 'G3','MIA', 'IAH', '388', TRUE, TRUE, TRUE),
		('JB1402', TO_TIMESTAMP('2022-01-24 14:15', 'YYYY-MM-DD HH24:MI'), TO_TIMESTAMP('2022-01-25 01:15', 'YYYY-MM-DD HH24:MI'), 'F4', 'E5','JFK', 'DFW', '321', TRUE, TRUE, TRUE);


CREATE TABLE Boarding_passes (
	ticket_no VARCHAR(256),
	flight_id VARCHAR(6),
	seat_no VARCHAR(3),
	PRIMARY KEY (ticket_no, flight_id),
	FOREIGN KEY (ticket_no) REFERENCES Tickets(ticket_no),
	FOREIGN KEY (flight_id) REFERENCES Flights(flight_id)
);

INSERT INTO Boarding_passes (ticket_no, flight_id, seat_no)
VALUES  ('0006274432500', 'AA1501', '331'),
		('0006274432500', 'JB1402', '156'),
		('0006274432507', 'UA4730', '17'),
		('0006274432522', 'SA8002', '45'),
		('0006274432522', 'SA4370', '255'),
		('0006274432534', 'DA6192', '337'),
		('0006274432534', 'SA8002', '327'),
		('0006274432534', 'UA4431', '370'),
		('0006274432552', 'DA2507', '85'),
		('0006274432577', 'AA1501', '44'),
		('0006274432577', 'JB1402', '25'),
		('0006274432577', 'UA1262', '77'),
		('0006274432577', 'SA3199', '45'),
		('0006274432578', 'JB1413', '257'),
		('0006274432578', 'DA3840', '108'),
		('0006274432582', 'UA3020', '184'),
		('0006274432582', 'AA1137', '484'),
		('0006274432582', 'UA2116', '161'),
		('0006274432585', 'DA2507', '418'),
		('0006274432585', 'JB3552', '255'),
		('0006274432585', 'JB2068', '77' ),
		('0006274432595', 'AA3544', '42' ),
		('0006274432595', 'SA4726', '58' ),
		('0006274432595', 'JB2068', '73' );
		
		
CREATE TABLE Crew (
	emp_id VARCHAR(6),
	flight_id VARCHAR(6),
	position VARCHAR(256),
	PRIMARY KEY (emp_id, flight_id),
	FOREIGN KEY (flight_id) REFERENCES Flights(flight_id)
);	

INSERT INTO Crew (emp_id, flight_id, position)
VALUES  ('412345', 'AA1137', 'Captain'),
		('122145', 'AA1137', 'Co-pilot'),
		('128554', 'AA1137', 'Engineer'),
		('477144', 'AA1137', 'Medic'),
		('381255', 'AA1137', 'Purser'),
		('453187', 'AA1137', 'Load Master'),
		('455331', 'AA1137', 'Flight attendent'),
		('458791', 'AA1137', 'Flight attendent'),
		('620298', 'AA1137', 'Flight attendent'),
		('442573', 'AA3544', 'Flight attendent'),
		('213214', 'AA1501', 'Flight attendent'),
		('188607', 'AA2361', 'Captain'),
		('540714', 'AA2361', 'Co-pilot'),
		('549900', 'AA2361', 'Engineer'),
		('742258', 'AA2361', 'Medic'),
		('425554', 'AA2361', 'Purser'),
		('713626', 'UA2116', 'Load Master'),
		('425554', 'AA1501', 'Flight attendent'),
		('988716', 'AA1501', 'Flight attendent'),
		('620298', 'UA4431', 'Flight attendent'),
		('442573', 'AA1501', 'Flight attendent');

CREATE TABLE temp_flight (
    flight_id VARCHAR(6),
    scheduled_dep TIMESTAMP,
    scheduled_arr TIMESTAMP,
    dep_airport VARCHAR(3),
    arr_airport VARCHAR(3),
	dep_gate VARCHAR(3),
	arr_gate VARCHAR(3),
    craft_code VARCHAR(3),
	refueling BOOLEAN,
	cleaning BOOLEAN,
	maintenance BOOLEAN
);

CREATE TABLE Seats (
	aircraft_code char(3),
	seat_no int,
	fare_condition varchar(15)
);