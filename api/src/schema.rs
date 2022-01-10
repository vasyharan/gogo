table! {
    shortlinks (id, version) {
        id -> Int4,
        version -> Int4,
        keyword -> Varchar,
        link -> Varchar,
        archived -> Bool,
    }
}
