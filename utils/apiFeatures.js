// To make the API reusable
class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString }; // using destructring to get the queries data

    const excludedFields = ['page', 'sort', 'limit', 'fields']; // Filtering queries
    excludedFields.forEach((el) => delete queryObj[el]); // Excluding FIltering queries fields

    // 1B) Advanced Filtering // TODO:  Not working
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`); // Reqular expression to put the mongoDB $ sign

    this.query = this.query.find(JSON.parse(queryStr));
    return this; // return the entire object
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' '); // To allow multiple sort conditions with (,)
      this.query = this.query.sort(sortBy);
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit; // calcultaing items limit in each page;
    // page=2&limit=10 --> 1-10 in page 1 , 21-30 in page 2
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = APIFeatures;
