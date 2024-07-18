import Compressor from "compressorjs";
import { formatDistance } from "date-fns";
import * as marked from "marked";

/**
 *
 * Convierte un archivo a base64.
 * @param file archivo a convertir
 * @returns Promise<string>, retorna una promesa que resuelve en un string base64
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      resolve(e.target.result);
    };
    reader.readAsDataURL(file);
  });
};

/**
 * Comprime una imagen.
 *
 * @param image archivo de imagen
 * @returns Promise<File>, retorna una promesa que resuelve en un archivo comprimido
 */
export function compressImage(image: File): Promise<File> {
  return new Promise((resolve, reject) => {
    new Compressor(image, {
      quality: 0.9,
      maxWidth: 1280,
      maxHeight: 720,
      success(v: any) {
        resolve(v);
      },
      error(e: any) {
        reject(e);
      },
    });
  });
}

// convierte un texto markdown a html
export const formatMarkdown = (text: string) => marked.parse(text);

export const strFormatDistance = (date: Date): string => {
  return formatDistance(date, new Date(), { addSuffix: true });
};
