declare module "sequelize-mock" {
  import { Model, DataTypes, BuildOptions } from "sequelize";

  class MockModel extends Model {
    public id: number;
    public save: jest.Mock;
    public update: jest.Mock;
    public destroy: jest.Mock;
    static findOne: jest.Mock;
    static findAll: jest.Mock;
    static findByPk: jest.Mock;
    static create: jest.Mock;
  }

  class SequelizeMock {
    constructor();
    define(
      modelName: string,
      attributes?: any,
      options?: any
    ): typeof MockModel;
  }

  export = SequelizeMock;
}
