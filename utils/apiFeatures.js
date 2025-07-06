

class APIFeature {
    constructor(query ,queryString) {
        this.query = query;
        this.queryString = queryString;
    }
    filter(){
//1. filtering
    const queryObj = {...this.queryString};
    const excludeFields = ['page','sort','limit','fields'];
    excludeFields.forEach(el => delete queryObj[el]);

    //1b. advance filtering
    let queryStr = JSON.stringify(queryObj);
    //replacing get with $get
    queryStr = queryStr.replace(/\b(gte|gt|lt|lte)\b/g, match => `$${match}`);
    console.log(JSON.parse(queryStr));
    this.query.find(JSON.parse(queryStr));
    return this;

   // let query =  Tour.find(JSON.parse(queryStr));
    }
    sort(){
        if(this.queryString.sort){
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
           
        }else{
            this.query = this.query.sort('-createdAt');
        }
        return this;
    }
    limitFields(){
        if(this.queryString.fields){
            const fields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        }else{
            this.query = this.query.select('-__v')
        }
        return this;
    }
    paginate(){
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    //    if(this.queryString.page){
    //         const numTours = await Tour.countDocuments();
    //         if(skip >= numTours) throw new Error('this page does not exist');
    //         res.status(400).json({
    //             status: 'failed',
              
    //         });

            
    //    }
    return this;
    }
}
module.exports = APIFeature