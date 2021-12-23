#[macro_use]
extern crate rocket;
#[macro_use]
extern crate diesel;

pub mod errors;
pub mod models;
pub mod schema;

use crate::diesel::prelude::*;
use crate::errors::*;
use crate::models::*;
use dotenv::dotenv;
use rocket::response::status::{Created, NoContent};
use rocket::response::Redirect;
use rocket::serde::json::Json;
use rocket_sync_db_pools::database;
use std::env;
use std::path::PathBuf;

#[database("gogo")]
struct GogoDbConn(diesel::PgConnection);

#[get("/<path..>")]
async fn redirect(conn: GogoDbConn, path: PathBuf) -> Result<Redirect, RedirectError> {
    use crate::schema::shortlinks::dsl::*;

    let mut path_iter = path.iter();
    match path_iter.next() {
        None => Err(RedirectError::NotFound),
        Some(path) => {
            let kw = String::from(path.to_str().unwrap_or(""));
            let golink = conn
                .run(move |c| shortlinks.filter(keyword.eq(kw)).first::<Golink>(c))
                .await?;
            Ok(Redirect::to(golink.link))
        }
    }
}

#[get("/link?<q>&<first>&<after>")]
async fn list_links(
    conn: GogoDbConn,
    q: Option<&str>,
    first: Option<i64>,
    after: Option<i32>,
) -> Result<Json<Vec<Golink>>, ApiError> {
    use crate::schema::shortlinks::dsl::{id, keyword, shortlinks};

    let filter_kw = format!("{}%", String::from(q.unwrap_or("")));
    let golinks = conn
        .run(move |c| {
            shortlinks
                .filter(keyword.like(filter_kw))
                .filter(id.gt(after.unwrap_or(0)))
                .limit(std::cmp::max(50, first.unwrap_or(50)))
                .load::<Golink>(c)
        })
        .await?;
    Ok(Json(golinks))
}

#[get("/link/<id>")]
async fn get_link(conn: GogoDbConn, id: i32) -> Result<Json<Golink>, ApiError> {
    use crate::schema::shortlinks::dsl::shortlinks;
    let golink: Golink = conn
        .run(move |c| shortlinks.find(id).first::<Golink>(c))
        .await?;
    Ok(Json(golink))
}

#[post("/link", format = "json", data = "<golink>")]
async fn create_link(
    conn: GogoDbConn,
    golink: Json<NewGolink>,
) -> Result<Created<Json<Golink>>, ApiError> {
    use crate::schema::shortlinks::dsl::shortlinks;
    let created_golink: Golink = conn
        .run(move |c| {
            diesel::insert_into(shortlinks)
                .values(&*golink)
                .get_result(c)
        })
        .await?;
    Ok(Created::new("/link").body(Json(created_golink)))
}

#[put("/link/<id>", format = "json", data = "<golink>")]
async fn update_link(
    conn: GogoDbConn,
    id: i32,
    golink: Json<Golink>,
) -> Result<Json<Golink>, ApiError> {
    use crate::schema::shortlinks::dsl::shortlinks;
    let updated_golink: Golink = conn
        .run(move |c| {
            diesel::update(shortlinks.find(id))
                .set(&*golink)
                .get_result(c)
        })
        .await?;
    Ok(Json(updated_golink))
}

#[delete("/link/<id>")]
async fn delete_link(conn: GogoDbConn, id: i32) -> Result<NoContent, ApiError> {
    use crate::schema::shortlinks::dsl::shortlinks;
    let _num_deleted: usize = conn
        .run(move |c| diesel::delete(shortlinks.find(id)).execute(c))
        .await?;
    Ok(NoContent)
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
        .mount(
            "/go",
            routes![list_links, create_link, get_link, update_link, delete_link],
        )
}
