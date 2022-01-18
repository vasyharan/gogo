use rocket::http::{ContentType, Status};
use rocket::response::Responder;
use rocket::serde::json::Json;
use rocket::serde::{Serialize, Serializer};
use rocket::Response;
use serde::ser::SerializeStruct;

#[derive(Clone, Copy, PartialEq, Debug)]
pub enum ErrorCode {
    Unknown = 0,
    NotFound = 100,
    InvalidKeyword,
    KeywordConflict,
}

impl ErrorCode {
    const fn status(&self) -> Status {
        match self {
            ErrorCode::Unknown => Status::InternalServerError,
            _ => Status::BadRequest,
        }
    }
    const fn message(&self) -> &str {
        match self {
            ErrorCode::Unknown => "",
            ErrorCode::NotFound => "link not found",
            ErrorCode::InvalidKeyword => {
                "keyword must be non empty and consist only of a-z, 0-9, -, and _"
            }
            ErrorCode::KeywordConflict => "keyword must be unique",
        }
    }
}

#[derive(Debug)]
struct ErrorResponse<'a> {
    status: Status,
    code: ErrorCode,
    message: &'a str,
}

// impl<'a> Deserialize<'a> for ErrorResponse<'a> {
//     fn deserialize<D>(_: D) -> std::result::Result<Self, <D as Deserializer<'a>>::Error>
//     where
//         D: Deserializer<'a>,
//     {
//         todo!()
//     }
// }

impl Serialize for ErrorResponse<'_> {
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        let mut s = serializer.serialize_struct("ErrorResponse", 3)?;
        s.serialize_field("status", &self.status.code)?;
        s.serialize_field("code", &(self.code as u16))?;
        s.serialize_field("message", &self.message)?;
        s.end()
    }
}

pub enum RedirectError {
    DatabaseError(diesel::result::Error),
    NotFound,
}

impl From<diesel::result::Error> for RedirectError {
    fn from(e: diesel::result::Error) -> Self {
        RedirectError::DatabaseError(e)
    }
}

const NOT_FOUND_RESPONSE: ErrorResponse = ErrorResponse {
    code: ErrorCode::NotFound,
    status: ErrorCode::NotFound.status(),
    message: ErrorCode::NotFound.message(),
};

impl<'r> Responder<'r, 'static> for RedirectError {
    fn respond_to(
        self,
        req: &'r rocket::Request<'_>,
    ) -> std::result::Result<rocket::Response<'static>, rocket::http::Status> {
        use diesel::result::Error as DieselError;

        let message: String;
        let resp: ErrorResponse = match self {
            Self::NotFound | Self::DatabaseError(DieselError::NotFound) => NOT_FOUND_RESPONSE,
            Self::DatabaseError(err) => {
                message = format!("Database error: {}", err);
                ErrorResponse {
                    status: Status::InternalServerError,
                    code: ErrorCode::Unknown,
                    message: message.as_str(),
                }
            }
        };

        let status = resp.status;
        let json = Json(resp);
        Response::build_from(json.respond_to(&req).unwrap())
            .status(status)
            .header(ContentType::JSON)
            .ok()
    }
}

#[derive(Debug, PartialEq)]
pub enum ApiError {
    DatabaseError(diesel::result::Error),
    AppError(ErrorCode),
}

impl From<diesel::result::Error> for ApiError {
    fn from(e: diesel::result::Error) -> Self {
        ApiError::DatabaseError(e)
    }
}

impl<'r> Responder<'r, 'static> for ApiError {
    fn respond_to(
        self,
        req: &'r rocket::Request<'_>,
    ) -> std::result::Result<rocket::Response<'static>, rocket::http::Status> {
        use diesel::result::{DatabaseErrorKind, Error as DieselError};

        let message: String;
        let resp: ErrorResponse = match self {
            Self::DatabaseError(DieselError::NotFound) => NOT_FOUND_RESPONSE,
            Self::DatabaseError(DieselError::DatabaseError(
                DatabaseErrorKind::UniqueViolation,
                _,
            )) => {
                let code = ErrorCode::KeywordConflict;
                message = code.message().to_string();
                ErrorResponse {
                    code,
                    status: code.status(),
                    message: message.as_str(),
                }
            }
            Self::DatabaseError(err) => {
                message = format!("Database error: {}", err);
                ErrorResponse {
                    status: Status::InternalServerError,
                    code: ErrorCode::Unknown,
                    message: message.as_str(),
                }
            }
            Self::AppError(code) => {
                message = code.message().to_string();
                ErrorResponse {
                    code,
                    status: code.status(),
                    message: message.as_str(),
                }
            }
        };

        let status = resp.status;
        let json = Json(resp);
        Response::build_from(json.respond_to(&req).unwrap())
            .status(status)
            .header(ContentType::JSON)
            .ok()
    }
}
