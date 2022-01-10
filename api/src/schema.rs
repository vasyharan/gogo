table! {
    shortlinks (id) {
        id -> Int4,
        revision -> Int4,
        keyword -> Varchar,
        link -> Varchar,
        active -> Bool,
        updated_at -> Timestamptz,
    }
}
