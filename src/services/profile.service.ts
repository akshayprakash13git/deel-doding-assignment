import { Op, Sequelize } from "sequelize";
import { Job, Profile, Contract } from "../model";

class ProfileService {
  /**
   * Retrieve the profession that earned the most within a given time range.
   * Ensures that the provided date range is valid.
   * @param {string} start - The start date of the time range in YYYY-MM-DD format.
   * @param {string} end - The end date of the time range in YYYY-MM-DD format.
   * @returns {Promise<{ profession: string; totalEarned: number } | null>} - The top-earning profession and total earnings, or null if no data is found.
   * @throws {BadRequestError} - If the start date is after the end date.
   */
  async getBestProfession(
    start: string,
    end: string
  ): Promise<{ profession: string; totalEarned: number } | null> {
    const result = await Job.findOne({
      attributes: [
        [Sequelize.col("Contract.Contractor.profession"), "profession"],
        [Sequelize.fn("SUM", Sequelize.col("price")), "totalEarned"],
      ],
      include: [
        {
          model: Contract,
          as: "Contract",
          attributes: [],
          where: { status: "in_progress" },
          include: [
            {
              model: Profile,
              as: "Contractor",
              attributes: [],
            },
          ],
        },
      ],
      where: {
        paid: true,
        paymentDate: { [Op.between]: [start, end] },
      },
      group: ["Contract.Contractor.profession"],
      order: [[Sequelize.literal("totalEarned"), "DESC"]],
      raw: true,
    });

    return result as { profession: string; totalEarned: number } | null;
  }

  /**
   * Retrieve the top-paying clients within a given time range.
   * Ensures that the provided date range and limit are valid.
   * @param {string} start - The start date of the time range in YYYY-MM-DD format.
   * @param {string} end - The end date of the time range in YYYY-MM-DD format.
   * @param {number} limit - The maximum number of clients to return.
   * @returns {Promise<{ id: number; fullName: string; paid: number }[]>} - A list of top-paying clients with their total payments.
   * @throws {BadRequestError} - If the start date is after the end date or the limit is invalid.
   */
  async getBestClients(
    start: string,
    end: string,
    limit: number
  ): Promise<{ id: number; fullName: string; paid: number }[]> {
    const results = await Job.findAll({
      attributes: [
        [Sequelize.col("Contract.Client.id"), "id"],
        [
          Sequelize.literal(
            "`Contract->Client`.`firstName` || ' ' || `Contract->Client`.`lastName`"
          ),
          "fullName",
        ],
        [Sequelize.fn("SUM", Sequelize.col("price")), "paid"],
      ],
      include: [
        {
          model: Contract,
          as: "Contract",
          attributes: [],
          where: { status: "in_progress" },
          include: [
            {
              model: Profile,
              as: "Client",
              attributes: [],
            },
          ],
        },
      ],
      where: {
        paid: true,
        paymentDate: { [Op.between]: [start, end] },
      },
      group: ["Contract.Client.id"],
      order: [[Sequelize.literal("paid"), "DESC"]],
      limit: limit,
      raw: true,
    });

    return results as {
      id: number;
      fullName: string;
      paid: number;
    }[];
  }
}
export default ProfileService;
