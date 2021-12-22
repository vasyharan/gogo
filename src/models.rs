#[derive(Queryable, Debug)]
pub struct Shortlink {
    pub id: i32,
    pub keyword: String,
    pub link: String,
}
