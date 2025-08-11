import PengaduanController from '@/controllers/master/PengaduanController'
import { AuthMiddleware } from '@/middleware/AuthMiddleware'
import { Router } from 'express'
import { fileUploadMiddleware } from '@/middleware/FileUploadMiddleware'
import { CONFIG } from '@/config'

const fileUpload = fileUploadMiddleware.fileUploadHandler('uploads', {
  maxFileSize: CONFIG.maxFileSize as number,
  allowedFileTypes : ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  saveToBucket: CONFIG.saveToBucket,
})

export const PengaduanRouter = (): Router => {
  const router = Router()

  router.post('/create', fileUpload.single('file'), PengaduanController.createPengaduan)

  router.use(AuthMiddleware)

  router.get('/', PengaduanController.getAllPengaduan)
  router.get('/detail/:id', PengaduanController.getDetailPengaduan)

  return router
}
