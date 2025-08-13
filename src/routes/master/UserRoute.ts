import UserController from '@/controllers/master/UserController'
import { AuthMiddleware } from '@/middleware/AuthMiddleware'
import { fileUploadMiddleware } from '@/middleware/FileUploadMiddleware'
import { Router } from 'express'
import { CONFIG } from '@/config'

const fileUpload = fileUploadMiddleware.fileUploadHandler('uploads', {
  maxFileSize: CONFIG.maxFileSize as number,
  allowedFileTypes : ['image/jpeg', 'image/png', 'image/jpg'],
  saveToBucket: CONFIG.saveToBucket,
})

export const UserRouter = (): Router => {
  const router = Router()

  router.use(AuthMiddleware)

  router.get('/', UserController.getAllUser)
  router.get('/:id', UserController.getUserById)
  router.post('/', fileUpload.single('img'), UserController.createUser)
  router.put('/:id', fileUpload.single('img'), UserController.updateUser)
  router.delete('/:id/soft', UserController.softDeleteUser)
  router.patch('/:id/restore', UserController.restoreUser)
  router.delete('/:id/hard', UserController.deleteUser)

  return router
}
