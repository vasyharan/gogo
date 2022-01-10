#[macro_use]
extern crate rocket;
#[macro_use]
extern crate diesel;

pub mod errors;
pub mod models;
pub mod schema;
pub mod views;

use crate::diesel::prelude::*;
use crate::errors::*;
use crate::models::*;
use dotenv::dotenv;
use rocket::response::status::Created;
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
    use crate::views::active_shortlinks::dsl::{active_shortlinks, id, keyword, link};

    let filter_kw = format!("{}%", String::from(q.unwrap_or("")));
    let filter_link = format!("%{}%", String::from(q.unwrap_or("")));
    let golinks = conn
        .run(move |c| {
            active_shortlinks
                .filter(keyword.like(filter_kw).or(link.like(filter_link)))
                .filter(id.gt(after.unwrap_or(0)))
                .order(id.asc())
                .limit(std::cmp::max(50, first.unwrap_or(50)))
                .load::<Golink>(c)
        })
        .await?;
    Ok(Json(golinks))
}

#[get("/link/<id>")]
async fn get_link(conn: GogoDbConn, id: i32) -> Result<Json<Golink>, ApiError> {
    use crate::views::active_shortlinks::dsl::active_shortlinks;
    let golink: Golink = conn
        .run(move |c| active_shortlinks.find(id).first::<Golink>(c))
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
    mut golink: Json<Golink>,
) -> Result<Json<Golink>, ApiError> {
    use crate::schema::shortlinks::dsl::shortlinks;
    let version: i32 = golink.version;
    golink.id = id;
    golink.version = version + 1;
    let updated_golink: Golink = conn
        .run(move |c| {
            diesel::insert_into(shortlinks)
                .values(&*golink)
                .get_result(c)
        })
        .await?;
    Ok(Json(updated_golink))
}

#[delete("/link/<id>/<version>")]
async fn delete_link(conn: GogoDbConn, id: i32, version: i32) -> Result<Json<Golink>, ApiError> {
    use crate::schema::shortlinks;
    use diesel::sql_types::{Bool, Integer};

    let updated_golink: Golink = conn
        .run(move |c| {
            shortlinks::table
                .select((
                    id.into_sql::<Integer>(),
                    (version + 1).into_sql::<Integer>(),
                    shortlinks::keyword,
                    shortlinks::link,
                    (true).into_sql::<Bool>(),
                ))
                .filter(shortlinks::id.eq(id).and(shortlinks::version.eq(version)))
                .insert_into(shortlinks::table)
                .into_columns((
                    shortlinks::id,
                    shortlinks::version,
                    shortlinks::keyword,
                    shortlinks::link,
                    shortlinks::archived,
                ))
                .get_result(c)
        })
        .await?;

    Ok(Json(updated_golink))
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
            "/go/api",
            routes![list_links, create_link, get_link, update_link, delete_link],
        )
}
