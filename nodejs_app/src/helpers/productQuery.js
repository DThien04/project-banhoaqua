module.exports = ({ search, categoryId, isActive }) => {
  const query = { isDeleted: false };

  if (search) {
    query.name = { $regex: search, $options: "i" };
  }

  if (categoryId) {
    query.category = categoryId;
  }

  if (isActive !== undefined) {
    query.isActive = isActive;
  }
  return query;
};
