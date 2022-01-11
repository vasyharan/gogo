import { assert } from "./assert";
import { Golink, NewGolink } from "./models";

const DEFAULT_HEADERS = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

export type ApiResponse<T> =
  | { type: "error"; error: { status: number; code: number; message: string } }
  | { type: "success"; value: T };

async function toApiResponse<T>(resp: Response): Promise<ApiResponse<T>> {
  if (resp.ok) {
    const value = await resp.json();
    return { type: "success", value };
  } else {
    const { status, code, message } = await resp.json();
    assert(status === resp.status, "expected http status to match resp.status");
    return { type: "error", error: { status, code, message } };
  }
}

export async function listLinks(q: string): Promise<ApiResponse<Golink[]>> {
  const params = new URLSearchParams({ q });
  const resp = await fetch(`/go/api/link?${params.toString()}`, {
    headers: DEFAULT_HEADERS,
  });
  return await toApiResponse(resp);
}

export async function updateLink(link: Golink): Promise<ApiResponse<Golink>> {
  const resp = await fetch(`/go/api/link/${link.id}`, {
    method: "PUT",
    headers: DEFAULT_HEADERS,
    body: JSON.stringify(link),
  });
  return await toApiResponse(resp);
}

export async function createLink(
  link: NewGolink,
): Promise<ApiResponse<Golink>> {
  const resp = await fetch(`/go/api/link`, {
    method: "POST",
    headers: DEFAULT_HEADERS,
    body: JSON.stringify(link),
  });

  return await toApiResponse(resp);
}
