import { Request, Response } from "express";
import { prismaClient } from "../../database/prismaClient";
import fs from 'fs';

type reqBody = {
  name: string, 
  description: string, 
  price: string, 
  quantity: string, 
  category: string,
  bar_code: string
}

export class ProductsController {
  static async addProduct(req: Request, res: Response) {
    const { name, description, price, quantity, category, bar_code }: reqBody = req.body;
    if(!name || !description || !price || !quantity || !category || !bar_code && req.file ) {
      fs.unlinkSync(`src/public/images/products/${req.file?.filename}`);
    } 
    if(!name) {
      return res.status(401).json({message: 'Digite um nome para o produto!'});
    }
    if(!description) {
      return res.status(401).json({message: 'Digite uma descrição para o produto!'});
    }
    if(!price) {
      return res.status(401).json({message: 'Digite o preço do produto!'});
    }
    if(!quantity) {
      return res.status(401).json({message: 'Digite a quantidade para o produto!'});
    }
    if(!category) {
      return res.status(401).json({message: 'Digite a categoria do produto!'});
    }
    if(!bar_code) {
      return res.status(401).json({message: 'Digite o código de barras do produto!'});
    }
    if(!req.file) {
      return res.status(401).json({message: 'Adicione uma imagem!'});
    }

    const image = req.file;

    const productExists = await prismaClient.products.findUnique({where: {bar_code: bar_code}});

    if(productExists) {
      fs.unlinkSync(`src/public/images/products/${req.file?.filename}`);
      return res.status(401).json({message: "Esse produto já existe!"});
    }
    await prismaClient.products.create({
      data: {
        image: image.filename,
        name,
        description,
        price,
        category,
        quantity,
        bar_code,
      }
    }).then(() => {
      return res.status(200).json({message: "Produto criado com sucesso!"});
    }).catch((err) => { 
      fs.unlinkSync(`src/public/images/products/${req.file?.filename}`);
      return res.status(401).json({
        message: 'Ocorreu algum erro!',
        err
      })
    });
  }

  static async editProduct(req: Request, res: Response) {
    const { name, description, price, quantity, bar_code }: reqBody = req.body;

    if(!bar_code) {
      return res.status(401).json({message: "Digite o código de barras!"});
    }
    if(!req.file) {
      return res.status(401).json({message: 'Adicione uma imagem!'});
    }
    const image = req.file;
    const productExists = await prismaClient.products.findUnique({where: {bar_code: bar_code}});

    if(!productExists) {
      return res.status(401).json({message: "Esse produto não existe!"});
    }
    if(!name) {
      return res.status(401).json({message: 'Digite um nome para o produto!'});
    }
    if(!description) {
      return res.status(401).json({message: 'Digite uma descrição para o produto!'});
    }
    if(!price) {
      return res.status(401).json({message: 'Digite o preço do produto!'});
    }
    if(!quantity) {
      return res.status(401).json({message: 'Digite a quantidade para o produto!'});
    }
    await prismaClient.products.update({
      data: {
        image: image.filename,
        name,
        description,
        price,
        quantity
      },
      where: {
        bar_code: bar_code
      }
    }).then(() => {
      fs.unlinkSync(`src/public/images/products/${productExists.image}`);
      return res.status(200).json({message: "Produto editado com sucesso!"});
    }).catch((err) => {
      return res.status(401).json({
        message: 'Ocorreu algum erro!',
        err
      })
    });
  }
}