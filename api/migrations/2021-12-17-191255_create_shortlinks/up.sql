CREATE TABLE shortlinks (
    id SERIAL,
    revision INTEGER NOT NULL DEFAULT 0,
    keyword VARCHAR NOT NULL,
    link VARCHAR NOT NULL,
    active BOOLEAN NOT NULL DEFAULT true,
    updated_at TIMESTAMPTZ NOT NULL,
    PRIMARY KEY(id)
);

CREATE UNIQUE INDEX shortlinks_keyword ON shortlinks(keyword);
