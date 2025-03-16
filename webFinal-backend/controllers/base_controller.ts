import { NextFunction, Request, Response } from "express";
import { Model } from "mongoose";
import posts_controller from "./posts_controller";

interface IPopulationField {
  path: string;
  select: string;
  populate?: IPopulationField;
}

/* istanbul ignore next */
class BaseController<T> {
  model: Model<T>;
  constructor(model: any) {
    this.model = model;
  }

  getAllHandler(controller: any, filterField: string, populationFields: IPopulationField[]) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        await controller.getAll(req, res, filterField, populationFields);
      } catch (error) {
        next(error);
      }
    };
  }

  async getAll(req: Request, res: Response, filterField: string, populationFields: IPopulationField[]) {
    const filterValue = req.query[filterField];
    try {
      let query = this.model.find();
      if (filterValue) {
        query = query.where(filterField).equals(filterValue);
      }
      if (populationFields && populationFields.length > 0) {
        populationFields.forEach((field) => {
          query = query.populate(field);
        });
      }
      const items = await query;
      res.send(items);
    } catch (error) {
      res.status(400).send(error);
    }
  }

  getByIdHandler(controller: any, populationFields: IPopulationField[]) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        await controller.getById(req, res, populationFields);
      } catch (error) {
        next(error);
      }
    };
  }

  async getById(req: Request, res: Response, populationFields: IPopulationField[]) {
    const id = req.params.id;
    try {
      let query = this.model.findById(id);
      if (populationFields && populationFields.length > 0) {
        populationFields.forEach((field) => {
          query = query.populate(field);
        });
      }
      const item = await query;
      res.send(item);
    } catch (error) {
      res.status(400).send(error);
    }
  }

  createHandler(controller: any, populationFields: IPopulationField[], preprocess?: (req: Request) => void) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        if (preprocess) {
          preprocess(req); // Apply preprocessing if provided
        }
        await controller.create(req, res, populationFields);
      } catch (error) {
        next(error);
      }
    };
  }

  async create(req: Request, res: Response, populationFields: IPopulationField[]) {
    const body = req.body;
    try {
      let item = await this.model.create(body);
      if (item && populationFields && populationFields.length > 0) {
        item = (await this.model.findById(item._id).populate(populationFields)) ?? item;
      }
      res.status(201).send(item);
    } catch (error) {
      res.status(400).send(error);
    }
  }

  updateHandler(controller: any, populationFields: IPopulationField[]) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        await controller.update(req, res, populationFields);
      } catch (error) {
        next(error);
      }
    };
  }

  async update(req: Request, res: Response, populationFields: IPopulationField[]) {
    const id = req.params.id;
    const body = req.body;
    try {
      let item = await this.model.findByIdAndUpdate(id, body);
      if (populationFields && populationFields.length > 0) {
        item = await this.model.findById(item?._id).populate(populationFields);
      }
      res.status(200).send(item);
    } catch (error) {
      res.status(400).send(error);
    }
  }

  async deleteItem(req: Request, res: Response) {
    const id = req.params.id;
    try {
      const rs = await this.model.findByIdAndDelete(id);
      res.status(200).send("deleted");
    } catch (error) {
      res.status(400).send(error);
    }
  }
}

export default BaseController;
