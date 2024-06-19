CREATE TABLE makanan_minuman (
    id SERIAL NOT NULL,
    nama VARCHAR(100) NOT NULL,
    harga NUMERIC(10, 2) NOT NULL,
    stok INT NOT NULL
);

ALTER TABLE makanan_minuman
    ADD PRIMARY KEY (id);


CREATE TABLE customer (
    id SERIAL NOT NULL,
    username VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT unique_username UNIQUE (username)
);

CREATE TABLE orders (
    id SERIAL NOT NULL,
    quantity INT NOT NULL,
    total_harga NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE orders
    ADD CONSTRAINT fk_order_customer FOREIGN KEY (id_customer) REFERENCES customer (id);

CREATE TABLE order_detail (
    id_customer
)