import express from 'express';
import { createRequire } from 'module';
import path from 'path';
import * as url from 'url'
import root from './routes/root.js'

const __dirname = url.fileURLToPath(new URL('.',import .meta.url));


const PORT = process.env.PORT || 8080;
const app = express();

//where to find static files
app.use('/', express.static(path.join(__dirname, '/public')))
app.use('/', root)

//Not Found
app.get('*', (req,res) => {
  res.status(404)
  if(req.accepts('html')){
    res.sendFile(path.join(__dirname, 'views', '404.html'))
  } else if(req.accepts('json')) {
    res.json({ message: '404 Not Found' })
  } else {
    res.type('txt').send('404 Not Found')
  }
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
