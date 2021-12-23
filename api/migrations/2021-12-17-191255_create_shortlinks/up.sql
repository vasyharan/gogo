CREATE TABLE shortlinks (
    id SERIAL PRIMARY KEY,
    keyword VARCHAR NOT NULL,
    link VARCHAR NOT NULL,
    UNIQUE(keyword)
);