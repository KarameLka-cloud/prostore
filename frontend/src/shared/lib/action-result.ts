import { getErrorMessage } from "./errors";

export type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export function unwrapActionResult<T>(
  result: ActionResult<T>,
  fallback: string,
): T {
  if (!result.ok) {
    throw new Error(result.error || fallback);
  }

  return result.data;
}

export async function runAction<T>(
  fallback: string,
  action: () => Promise<T>,
): Promise<ActionResult<T>> {
  try {
    return { ok: true, data: await action() };
  } catch (error) {
    console.error(fallback, error);

    return { ok: false, error: getErrorMessage(error, fallback) };
  }
}
