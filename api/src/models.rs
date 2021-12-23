use crate::schema::shortlinks;
use rocket::serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize, Queryable, AsChangeset, Debug)]
#[table_name = "shortlinks"]
pub struct Golink {
    pub id: i32,
    pub keyword: String,
    pub link: String,
}

#[derive(Deserialize, Insertable, Debug)]
#[table_name = "shortlinks"]
pub struct NewGolink {
    pub keyword: String,
    pub link: String,
}
