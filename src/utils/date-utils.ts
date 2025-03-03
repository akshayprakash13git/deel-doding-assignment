import moment, { Moment } from "moment";
import { InternalServerError } from "../core/api-error";

class DateUtils {
  // Default formats (can be overridden dynamically)
  private static readonly DEFAULT_INPUT_FORMAT = "DD-MM-YYYY";
  private static readonly DEFAULT_OUTPUT_FORMAT = "YYYY-MM-DD HH:mm:ss";

  /**
   * Parses a date string based on the expected format and returns a Moment.js object.
   * @param dateStr - The date string to parse.
   * @param inputFormat - The expected format of the input date string.
   * @returns {Moment} - A Moment.js object representing the parsed date.
   * @throws {Error} - Throws an error if the date format is invalid.
   */
  public static parseDate(
    dateStr: string,
    inputFormat: string = DateUtils.DEFAULT_INPUT_FORMAT
  ): Moment {
    const date = moment(dateStr, inputFormat, true);
    if (!date.isValid()) {
      throw new InternalServerError(
        `Invalid date format: ${dateStr}. Expected format is ${inputFormat}`
      );
    }
    return date;
  }

  /**
   * Validates if a given date string follows the expected format and is a valid date.
   * @param dateStr - The date string to validate.
   * @param inputFormat - The expected format of the input date string.
   * @returns {boolean} - Returns true if the date is valid, otherwise false.
   */
  public static isValidDate(
    dateStr: string,
    inputFormat: string = DateUtils.DEFAULT_INPUT_FORMAT
  ): boolean {
    return moment(dateStr, inputFormat, true).isValid();
  }

  /**
   * Converts a date string to a UTC date-time string at the **start of the day**.
   * @param dateStr - The date string in the expected format.
   * @param inputFormat - (Optional) The expected format of the input date string.
   * @param outputFormat - (Optional) The desired format for output.
   * @returns {string} - The formatted UTC start-of-day timestamp.
   * @throws {Error} - Throws an error if the date format is invalid.
   */
  public static formatStartOfDay(
    dateStr: string,
    inputFormat: string = DateUtils.DEFAULT_INPUT_FORMAT,
    outputFormat: string = DateUtils.DEFAULT_OUTPUT_FORMAT
  ): string {
    const date = this.parseDate(dateStr, inputFormat);
    return date.utc().startOf("day").format(outputFormat);
  }

  /**
   * Converts a date string to a UTC date-time string at the **end of the day**.
   * @param dateStr - The date string in the expected format.
   * @param inputFormat - (Optional) The expected format of the input date string.
   * @param outputFormat - (Optional) The desired format for output.
   * @returns {string} - The formatted UTC end-of-day timestamp.
   * @throws {Error} - Throws an error if the date format is invalid.
   */
  public static formatEndOfDay(
    dateStr: string,
    inputFormat: string = DateUtils.DEFAULT_INPUT_FORMAT,
    outputFormat: string = DateUtils.DEFAULT_OUTPUT_FORMAT
  ): string {
    const date = this.parseDate(dateStr, inputFormat);
    return date.utc().endOf("day").format(outputFormat);
  }
}

export default DateUtils;
