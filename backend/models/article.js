import mongoose from 'mongoose';


const articleSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: {type: String},
    content: {type: String},
 
   
    
}, {
    timestamps: true
  });




   

const Article= mongoose.model('Article', articleSchema);

export default Article;