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
use regex::Regex;
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

    let mut piter = path.iter();
    match piter.next() {
        None => Err(RedirectError::NotFound),
        Some(path) => {
            let kw = String::from(path.to_str().unwrap_or(""));
            let golink = conn
                .run(move |c| shortlinks.filter(keyword.eq(kw)).first::<Golink>(c))
                .await?;
            let maybe_remaining: Option<String> = piter
                .map(|osstr| Some(osstr.to_str()?.to_string()))
                .collect();
            match maybe_remaining {
                Some(remaining) => Ok(Redirect::to(golink.link.replace("%s", &remaining))),
                None => Ok(Redirect::to(golink.link)),
            }
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
    use crate::schema::shortlinks::dsl::*;

    let filter_kw = format!("{}%", String::from(q.unwrap_or("")));
    let filter_link = format!("%{}%", String::from(q.unwrap_or("")));
    let golinks = conn
        .run(move |c| {
            shortlinks
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
    use crate::schema::shortlinks::dsl::shortlinks;

    let golink: Golink = conn
        .run(move |c| shortlinks.find(id).first::<Golink>(c))
        .await?;
    Ok(Json(golink))
}

fn validate_golink_keyword(keyword: &str) -> Result<(), ApiError> {
    let re = Regex::new(r"^[a-z0-9\-_]+$").unwrap();
    if !re.is_match(keyword) {
        return Err(ApiError::AppError(ErrorCode::InvalidKeyword));
    }
    Ok(())
}

#[test]
fn test_validate_golink_keyword() {
    assert_eq!(Ok(()), validate_golink_keyword("abc"));
    assert_eq!(Ok(()), validate_golink_keyword("09"));
    assert_eq!(Ok(()), validate_golink_keyword("_"));
    assert_eq!(Ok(()), validate_golink_keyword("-"));

    let err = Err(ApiError::AppError(ErrorCode::InvalidKeyword));
    assert_eq!(err, validate_golink_keyword(""));
    assert_eq!(err, validate_golink_keyword("ABC"));
    assert_eq!(err, validate_golink_keyword("def/"));
}

fn validate_new_golink(golink: Json<NewGolink>) -> Result<Json<NewGolink>, ApiError> {
    let _ = validate_golink_keyword(&*golink.keyword)?;
    return Ok(golink);
}

#[post("/link", format = "json", data = "<golink>")]
async fn create_link(
    conn: GogoDbConn,
    golink: Json<NewGolink>,
) -> Result<Created<Json<Golink>>, ApiError> {
    use crate::schema::shortlinks;

    let golink = validate_new_golink(golink)?;
    let created_golink = conn
        .run(move |c| {
            diesel::insert_into(shortlinks::table)
                .values((
                    shortlinks::keyword.eq(&golink.keyword),
                    shortlinks::link.eq(&golink.link),
                    shortlinks::updated_at.eq(diesel::dsl::now),
                ))
                .get_result(c)
        })
        .await?;
    Ok(Created::new("/link").body(Json(created_golink)))
}

fn validate_golink(golink: Json<Golink>) -> Result<Json<Golink>, ApiError> {
    let _ = validate_golink_keyword(&*golink.keyword)?;
    return Ok(golink);
}

#[put("/link/<id>", format = "json", data = "<golink>")]
async fn update_link(
    conn: GogoDbConn,
    id: i32,
    golink: Json<Golink>,
) -> Result<Json<Golink>, ApiError> {
    use crate::schema::shortlinks;

    let golink = validate_golink(golink)?;
    let updated_golink: Golink = conn
        .run(move |c| {
            diesel::update(shortlinks::table.find(id))
                .set((
                    shortlinks::revision.eq(shortlinks::revision + 1),
                    shortlinks::keyword.eq(&golink.keyword),
                    shortlinks::link.eq(&golink.link),
                    shortlinks::active.eq(golink.active),
                ))
                .get_result(c)
        })
        .await?;
    Ok(Json(updated_golink))
}

#[delete("/link/<id>/<revision>")]
async fn delete_link(conn: GogoDbConn, id: i32, revision: i32) -> Result<NoContent, ApiError> {
    use crate::schema::shortlinks;

    let _num_deleted = conn
        .run(move |c| {
            diesel::delete(
                shortlinks::table
                    .filter(shortlinks::id.eq(id).and(shortlinks::revision.eq(revision))),
            )
            .execute(c)
        })
        .await?;

    Ok(NoContent)
}

#[launch]
fn rocket() -> _ {
    use rocket::figment::util::map;
    use rocket::figment::value::{Map, Value};

    dotenv().ok();

    let db_config: Map<_, Value> =
        map! { "url" => env::var("GOGO_DB_URL").expect("GOGO_DB_URL environment variable").into() };
    let config = rocket::Config::figment().merge(("databases", map!["gogo" => db_config]));

    rocket::custom(config)
        .attach(GogoDbConn::fairing())
        .mount("/", routes![redirect])
        .mount(
            "/go/api",
            routes![list_links, create_link, get_link, update_link, delete_link],
        )
}
