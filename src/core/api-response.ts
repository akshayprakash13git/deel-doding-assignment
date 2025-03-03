/**
 * Standardized API response structure.
 * Encapsulates response status, success flag, message, and optional data payload.
 * @template T - The type of the response data.
 */
export class ApiResponse<T> {
  statusCode?: number;
  success?: boolean;
  message?: string;
  data?: T | null;

  /**
   * Creates an instance of ApiResponse.
   * @param {Partial<ApiResponse<T>>} [params] - Optional parameters to initialize the response.
   */
  constructor({
    statusCode = 200,
    success = true,
    message = "",
    data = null,
  }: Partial<ApiResponse<T>> = {}) {
    this.statusCode = statusCode;
    this.success = success;
    this.message = message;
    this.data = data;
  }

  /**
   * Creates an ApiResponse instance from a partial object.
   * @param {Partial<ApiResponse<T>>} [partial] - Partial response object.
   * @returns {ApiResponse<T>} - A new ApiResponse instance.
   */
  static from<T>(partial: Partial<ApiResponse<T>> = {}): ApiResponse<T> {
    return new ApiResponse(partial);
  }
}
