import { v2 as cloudinary } from 'cloudinary';
import products from 'razorpay/dist/types/products';

(async function() {

    // Configuration
    cloudinary.config({ 
        cloud_name: 'process.env.CLOUDINARY_NAME', 
        api_key: 'process.env.CLOUDINARY_API_KEY', 
        api_secret: 'process.env.CLOUDINARY_API_SECRET' // Click 'View API Keys' above to copy your API secret
    });
    









    // Upload an image
     const uploadResult = await cloudinary.uploader
       .upload(req.file.path,{
            folder: products
           }
       )
       .catch((error) => {
           console.log(error);
       });
    
    console.log(uploadResult);  
})();