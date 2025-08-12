import { IOption } from "../interface";

const pagination = (option: Partial<IOption>) => {
  const page = Number(option.page) || 1;
  const limit = Number(option.limit) || 10;
  const sortBy = option.sortBy || "createdAt";
  const sortOrder = option.sortOrder === "asc" ? "asc" : "desc";

  const skip = (page - 1) * limit;
  //   const sortOption = { [sortBy]: sortOrder };

  return {
    page,
    skip,
    limit,
    sortBy,
    sortOrder,
  };
};

export default pagination;
