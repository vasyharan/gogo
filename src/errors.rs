use rocket::http::{ContentType, Status};
use rocket::response::Responder;
use rocket::Response;
use std::io::Cursor;

pub enum RedirectError {
    DatabaseError(diesel::result::Error),
    NotFound,
}

impl From<diesel::result::Error> for RedirectError {
    fn from(e: diesel::result::Error) -> Self {
        RedirectError::DatabaseError(e)
    }
}

impl<'r> Responder<'r, 'static> for RedirectError {
    fn respond_to(
        self,
        _: &'r rocket::Request<'_>,
    ) -> std::result::Result<rocket::Response<'static>, rocket::http::Status> {
        let not_found = (Status::NotFound, String::from("Not found"));
        let (status, body) = match self {
            Self::NotFound => not_found,
            Self::DatabaseError(err) => match err {
                diesel::result::Error::NotFound => not_found,
                _ => (
                    Status::InternalServerError,
                    format!("Database error: {}", err),
                ),
            },
        };
        let res = Response::build()
            .status(status)
            .header(ContentType::Plain)
            .sized_body(body.len(), Cursor::new(body))
            .finalize();

        Ok(res)
    }
}

pub enum ApiError {
    DatabaseError(diesel::result::Error),
}

impl From<diesel::result::Error> for ApiError {
    fn from(e: diesel::result::Error) -> Self {
        ApiError::DatabaseError(e)
    }
}

impl<'r> Responder<'r, 'static> for ApiError {
    fn respond_to(
        self,
        _: &'r rocket::Request<'_>,
    ) -> std::result::Result<rocket::Response<'static>, rocket::http::Status> {
        let not_found = (Status::NotFound, String::from("Not found"));
        let (status, body) = match self {
            Self::DatabaseError(err) => match err {
                diesel::result::Error::NotFound => not_found,
                _ => (
                    Status::InternalServerError,
                    format!("Database error: {}", err),
                ),
            },
        };
        let res = Response::build()
            .status(status)
            .header(ContentType::Plain)
            .sized_body(body.len(), Cursor::new(body))
            .finalize();

        Ok(res)
    }
}
