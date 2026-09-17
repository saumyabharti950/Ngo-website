import slugify from "slugify";

export const makeSlug = (value) => slugify(value || "", { lower: true, strict: true, trim: true });
