use crate::schema::shortlinks;
use chrono::{DateTime, Utc};
use rocket::serde::{Deserialize, Serialize};

#[derive(
    Debug, Clone, Deserialize, Serialize, Identifiable, Queryable, Insertable, AsChangeset,
)]
#[table_name = "shortlinks"]
pub struct Golink {
    pub id: i32,
    pub revision: i32,
    pub keyword: String,
    pub link: String,
    pub active: bool,
    pub updated_at: DateTime<Utc>,
}

#[derive(Deserialize, Insertable, PartialEq, Debug)]
#[table_name = "shortlinks"]
pub struct NewGolink {
    pub keyword: String,
    pub link: String,
}
