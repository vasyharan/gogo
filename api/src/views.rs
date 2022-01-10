table! {
    active_shortlinks (id) {
        id -> Int4,
        version -> Int4,
        keyword -> Varchar,
        link -> Varchar,
        archived -> Bool,
    }
}
