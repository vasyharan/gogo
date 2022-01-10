CREATE TABLE shortlinks (
    id SERIAL,
    version INTEGER NOT NULL DEFAULT 0,
    keyword VARCHAR NOT NULL,
    link VARCHAR NOT NULL,
    archived BOOLEAN NOT NULL DEFAULT false,
    PRIMARY KEY(id, version)
);

CREATE UNIQUE INDEX shortlinks_keyword_version ON shortlinks(keyword, version);

CREATE VIEW active_shortlinks AS 
    SELECT s.*
    FROM shortlinks s
    INNER JOIN (SELECT ss.id, MAX(ss.version) as version FROM shortlinks ss GROUP BY 1) ss 
        ON ss.id = s.id AND ss.version = s.version;