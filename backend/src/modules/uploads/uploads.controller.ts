import { Request, Response } from "express";
import { cloudinary } from "../../config/cloudinary";
import { HttpError } from "../../utils/http-error";

export const uploadImage = async (req: Request, res: Response): Promise<void> => {
  if (!req.file) {
    throw new HttpError(400, "No se envio ninguna imagen");
  }

  const b64 = Buffer.from(req.file.buffer).toString("base64");
  const dataURI = `data:${req.file.mimetype};base64,${b64}`;

  const result = await cloudinary.uploader.upload(dataURI, {
    folder: "ptmaja",
    resource_type: "image"
  });

  res.json({ url: result.secure_url, publicId: result.public_id });
};
