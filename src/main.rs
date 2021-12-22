#[macro_use]
extern crate rocket;
#[macro_use]
extern crate diesel;

pub mod errors;
pub mod models;
pub mod schema;

use crate::diesel::prelude::*;
use dotenv::dotenv;
use rocket::response::Redirect;
use rocket_sync_db_pools::database;
use std::env;
use std::path::PathBuf;

#[database("gogo")]
struct GogoDbConn(diesel::PgConnection);

#[get("/<path..>")]
async fn redirect(conn: GogoDbConn, path: PathBuf) -> Result<Redirect, errors::RedirectError> {
    use crate::schema::shortlinks::dsl::*;

    let mut path_iter = path.iter();
    match path_iter.next() {
        None => Err(errors::RedirectError::NotFound),
        Some(path) => {
            let kw = String::from(path.to_str().unwrap_or(""));
            let golink = conn
                .run(move |c| {
                    shortlinks
                        .filter(keyword.eq(kw))
                        .first::<models::Shortlink>(c)
                })
                .await?;
            Ok(Redirect::to(golink.link))
        }
    }
}

#[launch]
fn rocket() -> _ {
    use rocket::figment::util::map;
    use rocket::figment::value::{Map, Value};

    dotenv().ok();

    let db_config: Map<_, Value> = map! { "url" => env::var("GOGO_DB_URL").unwrap().into() };
    let config = rocket::Config::figment().merge(("databases", map!["gogo" => db_config]));

    rocket::custom(config)
        .attach(GogoDbConn::fairing())
        .mount("/", routes![redirect])
}
