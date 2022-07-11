import { NextFunction, Request, Response } from 'express';
import { prismaClient } from '../../database/prismaClient';
import fs from 'fs';

export class ProductsController {
  static async addProduct(req: Request, res: Response, next: NextFunction) {
    const { name, description, price, quantity, category, bar_code } = req.body;
    if (
      !name ||
      !description ||
      !price ||
      !quantity ||
      !category ||
      !bar_code
    ) {
      return res.status(401).json({ message: 'Missing parameter' });
    }
    if (!req.file) {
      return res.status(401).json({ message: 'Missing image!' });
    }

    const image = req.file;

    const productAlreadyExists = await prismaClient.products.findUnique({
      where: { bar_code },
    });

    if (productAlreadyExists) {
      return res.status(401).json({ message: 'Product already exists!' });
    }
    try {
      await prismaClient.products.create({
        data: {
          image: image.filename,
          name,
          description,
          price,
          category,
          quantity,
          bar_code,
        },
      });
      res.status(200).json({ message: 'Produto criado com sucesso!' });
      next();
    } catch (error) {
      return res.status(401).json({
        message: 'Some problem occur!',
        error,
      });
    }
  }

  static async editProduct(req: Request, res: Response) {
    const { name, description, price, quantity, bar_code } = req.body;

    if (!bar_code) {
      return res.status(401).json({ message: 'Missing bar code!' });
    }
    if (!req.file) {
      return res.status(401).json({ message: 'Missing image!' });
    }
    const image = req.file;
    const productExists = await prismaClient.products.findUnique({
      where: { bar_code: bar_code },
    });

    if (!productExists) {
      return res.status(401).json({ message: 'Esse produto não existe!' });
    }
    if (!name) {
      return res
        .status(401)
        .json({ message: 'Digite um nome para o produto!' });
    }
    if (!description) {
      return res
        .status(401)
        .json({ message: 'Digite uma descrição para o produto!' });
    }
    if (!price) {
      return res.status(401).json({ message: 'Digite o preço do produto!' });
    }
    if (!quantity) {
      return res
        .status(401)
        .json({ message: 'Digite a quantidade para o produto!' });
    }
    await prismaClient.products
      .update({
        data: {
          image: image.filename,
          name,
          description,
          price,
          quantity,
        },
        where: {
          bar_code: bar_code,
        },
      })
      .then(() => {
        fs.unlinkSync(`src/assets/images/products/${productExists.image}`);
        return res
          .status(200)
          .json({ message: 'Produto editado com sucesso!' });
      })
      .catch((err) => {
        return res.status(401).json({
          message: 'Ocorreu algum erro!',
          err,
        });
      });
  }
}
