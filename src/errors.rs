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
        let notFoundRes = (Status::NotFound, String::from("Not found"));
        let (status, body) = match self {
            Self::NotFound => notFoundRes,
            Self::DatabaseError(err) => match err {
                diesel::result::Error::NotFound => notFoundRes,
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
