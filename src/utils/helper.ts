import path from "path";
import { URL } from "url";
import { uuidv7 } from "uuidv7";

import { FrontMatter } from "@/types/post"; import { putImage } from "@/infrastructures/image";
import { UrlMap } from "@/types/helper";


export function validateFormData(form: FormData): { markdown: string; files: File[] } {
  // validate the markdown content
  const markdown = form.get("content");

  if (!markdown) throw new Error("`name=content` is required in form-data");
  if (typeof markdown !== "string") throw new Error("`name=content` must be a string");

  // validate the files
  const files = form.getAll("files").map((file) => {
    if (!((file instanceof File) && file.name)) {
      throw new Error("`filename` is required for all form-data files");
    }

    // rename the filename, delete path information
    const newName = path.basename(file.name);
    return new File([file], newName);
  });

  return { markdown, files }
}


export function isUrl(value: string): boolean {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

// function extractPathFileNames(paths: string[]): string[] {
//   return paths
//     .filter((path) => !isUrl(path))
//     .map((imagePath) => path.basename(imagePath));
// }


export function checkAllFilesExist(filePaths: string[], files: File[]): boolean {
  return filePaths
    .map((filename) => path.basename(filename))
    .every((filename) =>
      files.some((file) => file.name === filename)
    );
}


export function makeFileMap(filePaths: string[], files: File[]): Record<string, File> {
  const fileMap = filePaths
    // only include the files that are actually referenced in markdown
    // .filter((fileName) => files.find((file) => file.name === fileName))

    // create a map of filename -> File
    .reduce((map, filePath) => {
      const fileName = path.basename(filePath);
      const file = files.find((file) => file.name === fileName);

      if (file) {
        map[filePath] = file;
      }

      return map;
    }, {} as Record<string, File>);

  return fileMap;
}


export async function makeUriMap(fileMap: Record<string, File>): Promise<UrlMap> {
  const urlMap: UrlMap = {};

  const uploadings = Object.entries(fileMap)
    .map(async ([filePath, file]) => {
      const id = uuidv7();
      const fileExtension = file.name.split('.').pop() || '';
      const filename = `${id}.${fileExtension}`;
      await putImage(filename, file);

      urlMap[filePath] = { id, key: filename, uri: `/api/images/${filename}` };
    });

  await Promise.all(uploadings);

  return urlMap;
}


export function updateFrontmatter(
  prevFrontmatter: FrontMatter,
  newFrontmatter: FrontMatter,
  urlMap: UrlMap
): FrontMatter {
  console.log("Previous frontmatter:", prevFrontmatter);
  console.log("New frontmatter:", newFrontmatter);
  const updatedFrontmatter = Object.assign(prevFrontmatter, newFrontmatter);
  console.log("Frontmatter before URL update:", updatedFrontmatter);

  if (updatedFrontmatter.thumbnail_uri && urlMap[updatedFrontmatter.thumbnail_uri]) {
    updatedFrontmatter.thumbnail_uri = urlMap[updatedFrontmatter.thumbnail_uri].uri;
  }
  console.log("Updated frontmatter:", updatedFrontmatter);
  console.log("URL map:", urlMap);

  return updatedFrontmatter;
}
