import { CONFIG } from '@/config'
import BlogController from '@/controllers/master/BlogController'
import { AuthMiddleware } from '@/middleware/AuthMiddleware'
import { fileUploadMiddleware } from '@/middleware/FileUploadMiddleware'
import { Router } from 'express'

const fileUpload = fileUploadMiddleware.fileUploadHandler('uploads', {
  maxFileSize: CONFIG.maxFileSize as number,
  allowedFileTypes : ['image/jpeg', 'image/png', 'image/jpg'],
  saveToBucket: CONFIG.saveToBucket,
})

export const BlogRouter = (): Router => {
  const router = Router()

  router.get('/', BlogController.getAllBlog)
  router.get('/detail/:slug', BlogController.getDetailBlog)

  router.use(AuthMiddleware)

  router.post('/create', fileUpload.single('file'), BlogController.createBlog)
  router.put('/update/:slug', fileUpload.single('file'), BlogController.updateBlog)
  router.delete('/delete/:slug', BlogController.deleteBlog)

  return router
}
