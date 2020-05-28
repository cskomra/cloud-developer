import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */
  
  // Validate image
  // reference https://stackoverflow.com/questions/30970068/js-regex-url-validation/30970319 
  const validateUrl = async (url:string) => {
    console.log('VALIDATING');
    var isUrl = url.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    if(isUrl == null)
        return false;
    else
        return true;
  }
  
  // GET /filteredimage?image_url={{URL}}
  app.get( "/filteredimage/", async (req, res) => {
    let { image_url } = req.query;
    console.log(image_url);

    let isValid = await validateUrl(image_url);

    if(!isValid) {
      return res.status(400).send('invalid url or no url');
    }

    filterImageFromURL(image_url)
    .then(filteredPath => {
      res.status(200).sendFile(filteredPath, () => {
        deleteLocalFiles([filteredPath])
      })
    })
    .catch(() => {res.status(400).send('invalid url or no url')});
    
    console.log("DONE!");

  });

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();