import mongoose from 'mongoose';
import { Password } from '../services/password';

interface UserAttrs {
    name: string;
    email: string;
    password: string;
    about: string;
    sex: string;
    image_name: string;
    path: string;
};

interface UserModel extends mongoose.Model<UserDoc>{
    build(attrs: UserAttrs): UserDoc;
};

interface UserDoc extends mongoose.Document{
    name: string;
    email: string;
    password: string;
    about: string;
    sex: string;
    image_name: string;
    path: string;
    createdAt: string;
    updatedAt: string;
};

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    sex: {
        type: String,
        enum : ['male','female'],
        required: true
    },
    about: {
        type : String,
        required: true
    },
    image_name: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true 
    }
    
});

userSchema.pre('save', async function(done){
    if(this.isModified('password')){
        const hashed = await Password.toHash(this.get('password'));
        this.set('password', hashed);
    };
    
    done();
})

userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs);
};

userSchema.virtual('url').get(function(this: { path: string }) {
    return `${process.env.APP_URL}/files/${this.path}`;
});


const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };