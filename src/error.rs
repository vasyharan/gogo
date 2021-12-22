use rocket::http::{ContentType, Status};
use rocket::response::Responder;
use rocket::Response;
use std::io::Cursor;

pub enum ApiError {
    DatabaseError(diesel::result::Error),
    NotFound,
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
        let (status, body) = match self {
            Self::NotFound => (Status::NotFound, String::from("Not found")),
            Self::DatabaseError(err) => match err {
                diesel::result::Error::NotFound => (Status::NotFound, String::from("Not found")),
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
