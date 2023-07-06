const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
// const User = require('./userModel');


const recipeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            // required: [true, 'A recipe must have a name'],
            // unique: true,
            maxlength: [25, 'A recipe name must have less or equal to 40 characters'],
            minlength: [2, 'A recipe name must have more or equal to 10 characters'],
        },
        slug: String,
        type: {
          type: String,
          required: [true, "A reipe must have a type"],
          enum: {
            values: ["veg", "non-veg"],
            message: "type is either: veg, nonveg",
          },
        },
        ratingsAverage: {
            type: Number,
            default: 4.5,
            min: [1, 'Rating must be above 1.0'],//It is a validator
            max: [5, 'Rating must be below 5.0'],//It is a validator
            set: val => Math.round(val * 10) / 10// 4.666666 -> 46.66666 -> 47 -> 4.7
        },
        ratingsQuantity: {
            type: Number,
            default: 0
        },
        price: {
            type: Number,
            // required: [true, 'A recipe must have a price']
        },
        cookingTime: {
            type: Number,
        },
        cookingInstructions: {
            type: String,
            trim: true, //removes all white-spaces from beginning and from end
            // required: [true, 'A recipe must have a description']
        },
        servings: {
            type: Number
        },
        description: {
            type: String,
            trim: true
        },
        category: {
            type: String,
            trim: true
        },
        imageCover: { //name of image
            type: String,
            // required: [true, 'A recipe must have a cover image']
        },
        images: [String],//name of images
        ingredients: [String],
        sourceLink: {
            type: String,
        },
        // createdAt: {
        //     type: Date,
        //     default: Date.now(),//mongoose converts this to today's date from milliseconds
        //     select: false //permanantly hide this property from client
        // },
        secretRecipe: {
            type: Boolean,
            default: false
        },

        authors: [
            { //doing child-referencing for dishes
                type: String,
                // ref: User
            }
        ]
    },
    {
        toJSON: { virtuals: true }, //to show virtual properties as in output
        toObject: { virtuals: true }
    });

recipeSchema.index({ price: 1, ratingsAverage: -1 }); //ratingsAverage in descending order
recipeSchema.index({ slug: 1 });



recipeSchema.pre('save', function (next) {//this callbacak func. will be called before a document is saved to database
    // this keyword -> here gonna points to currently processed document
    // ❗ virtual properties are available in document before it is saved into database so we can act on them before document saved

    this.slug = slugify(this.name, { lower: true });
    next();
});


// 💥 Query Middleware -

recipeSchema.pre(/^find/, function (next) { // /^find/ will take care of both find and fndOne -
    this.find({ secretRecipe: { $ne: true } })//this keyword points to query
    this.start = Date.now();//for measuring how long query took time to execute and we log result by subtracting start from middleware just time.  
    next();
});


const Recipe = mongoose.model('Recipe', recipeSchema);
module.exports = Recipe;