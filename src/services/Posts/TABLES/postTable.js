import mongoose from "mongoose";

import  profile from "../../profiles/schema.js"



const { Schema, model } = mongoose;


// const commentModel = new Schema( //Christian part
//   {
//     comment: { type: String, required: true },
//     name: { type: Number, required: true,  },
//   },
//   { timestamps: true,
//}
// );

const commentSchema = new Schema(
  {
    comment: { type: String },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Profile",
    },
  },

  {
    timestamps: true,
  }
);


const PostSchema = new mongoose.Schema({
  text: { type: String, required: true },
  userName: { type: String, required: true },

  user: { 
        //type : [profilesSchema], required: true
        type: mongoose.Schema.Types.ObjectId, required: true, ref: "profile"
    },

 comments: { default: [], type: [commentSchema] },
  image :{ type: String},
 },
{
  timestamps: true,

 
});

PostSchema.static("findPostWithComments", async function (mongoQuery) {
  // this cannot be an arrow function
  const total = await this.countDocuments(mongoQuery.criteria);
  const posts = await this.find(mongoQuery.criteria, mongoQuery.options.fields)
    .limit(mongoQuery.options.limit || 10)
    .skip(mongoQuery.options.skip)
    .sort(mongoQuery.options.sort) // no matter how I write them but Mongo will always apply SORT then SKIP then LIMIT in this order
    .populate({ path: "comments", select: "comment" })
    .populate({ path: "user"  })
    
    
  return { total, posts };
});

export default model("Post", PostSchema);
