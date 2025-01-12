import { NextFunction, Request, Response } from "express";
import { Model } from "mongoose";

interface populationField {
  path: string
  select: string
}

/* istanbul ignore next */
class BaseController<T> {
  model: Model<T>;
  constructor(model: any) {
    this.model = model;
  }

  getAllHandler(controller: any, filterField: string, populationFields: populationField[]) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        await controller.getAll(req, res, filterField, populationFields);
      } catch (error) {
        next(error); // Pass errors to Express error handler
      }
    };
  }

  async getAll(req: Request, res: Response, filterField: string, populationFields: populationField[]) {
    const filterValue = req.query[filterField];
    try {
      let query = this.model.find();
      if (filterValue) {
        query = query.where(filterField).equals(filterValue);
      }
      if (populationFields && populationFields.length > 0) {
        populationFields.forEach(field => {
          if (field.select != '') query.populate({ path: field.path, select: field.select });
          else query = query.populate(field);
        })
        query = query.populate(populationFields);
      }
      const items = await query;
      res.send(items);
    } catch (error) {
      res.status(400).send(error);
    }
  }

  async getById(req: Request, res: Response) {
    const id = req.params.id;

    try {
      const item = await this.model.findById(id);
      if (item != null) {
        res.send(item);
      } else {
        res.status(404).send("not found");
      }
    } catch (error) {
      res.status(400).send(error);
    }
  }

  async create(req: Request, res: Response) {
    const body = req.body;
    try {
      const item = await this.model.create(body);
      res.status(201).send(item);
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
